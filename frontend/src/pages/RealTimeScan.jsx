import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function RealTimeScan() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalPackets: 0,
    normal: 0,
    threats: 0,
  });
  const [connected, setConnected] = useState(false);
  const [running, setRunning] = useState(false);
  const [online, setOnline] = useState(navigator.onLine); // 🔥 NEW

  const ws = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  /* ================= NETWORK STATUS ================= */
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Internet connected");
      setOnline(true);
    };

    const handleOffline = () => {
      console.log("❌ Internet disconnected");
      setOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /* ================= START ================= */
  const startScan = async () => {
    try {
      if (!user?.email) {
        alert("Login required");
        return;
      }

      // 🔥 CHECK INTERNET BEFORE START
      if (!online) {
        alert("❌ No internet connection. Please check your network.");
        return;
      }

      setLogs([]);
      setStats({ totalPackets: 0, normal: 0, threats: 0 });

      localStorage.removeItem("nids_logs");
      localStorage.removeItem("nids_stats");

      await axios.post("http://localhost:5000/api/nids/start", {
        email: user.email,
      });

      setRunning(true);
    } catch (err) {
      console.error("❌ Start error:", err);
    }
  };

  /* ================= STOP ================= */
  const stopScan = async () => {
    try {
      await axios.post("http://localhost:5000/api/nids/stop");
      setRunning(false);
    } catch (err) {
      console.error("❌ Stop error:", err);
    }
  };

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!user?.email) return;

    if (ws.current) ws.current.close();

    ws.current = new WebSocket(`ws://localhost:5000?email=${user.email}`);

    ws.current.onopen = () => {
      console.log("✅ Connected:", user.email);
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (!data.src || !data.dst) return;

        const label = (data.label || "NORMAL").toUpperCase();

        const newLog = {
          timestamp: data.timestamp || new Date().toISOString(),
          src: data.src,
          dst: data.dst,
          label,
          threat: label === "THREAT",
        };

        setLogs((prev) => {
          const updated = [newLog, ...prev.slice(0, 99)];
          localStorage.setItem("nids_logs", JSON.stringify(updated));
          return updated;
        });

        setStats((prev) => {
          const updated = {
            totalPackets: prev.totalPackets + 1,
            normal: prev.normal + (label === "NORMAL" ? 1 : 0),
            threats: prev.threats + (label === "THREAT" ? 1 : 0),
          };

          localStorage.setItem("nids_stats", JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.error("⚠️ WS Parse Error:", err);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
    };

    ws.current.onerror = (err) => {
      console.error("⚠️ WebSocket Error:", err);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [user?.email]);

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <h1 className="fw-bold mb-4">Real-Time Network Intrusion Monitor</h1>

      {/* 🔥 NETWORK ALERT */}
      {!online && (
        <div className="alert alert-danger">
          ❌ No Internet Connection. Please check your network.
        </div>
      )}

      {/* STATUS */}
      <div className="mb-3">
        Status:
        <span className={connected ? "text-success ms-2" : "text-danger ms-2"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* BUTTONS */}
      <div className="mb-4">
        <button
          className="btn btn-success me-2"
          onClick={startScan}
          disabled={running || !online} // 🔥 disable if offline
        >
          ▶ Start Scan
        </button>

        <button
          className="btn btn-danger"
          onClick={stopScan}
          disabled={!running}
        >
          ■ Stop Scan
        </button>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-dark text-white p-3">
            <h5>Total Packets</h5>
            <h2>{stats.totalPackets}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success text-white p-3">
            <h5>Normal</h5>
            <h2>{stats.normal}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-danger text-white p-3">
            <h5>Threats</h5>
            <h2>{stats.threats}</h2>
          </div>
        </div>
      </div>

      {/* LOGS */}
      <div
        className="card bg-dark text-white p-3"
        style={{ height: "400px", overflowY: "auto" }}
      >
        <h5>Live Packet Logs</h5>

        {logs.length === 0 && (
          <p className="text-secondary">Waiting for packets...</p>
        )}

        {logs.map((log, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              log.threat ? "bg-danger" : "bg-success"
            }`}
          >
            <div>
              <strong>Time:</strong>{" "}
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div>
              <strong>Source:</strong> {log.src}
            </div>
            <div>
              <strong>Destination:</strong> {log.dst}
            </div>
            <div>
              <strong>Status:</strong> {log.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}