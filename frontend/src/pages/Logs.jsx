import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const ws = useRef(null);

  /* ================= FETCH FROM DATABASE ================= */

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/logs");

      // Normalize DB logs
      const formattedLogs = res.data.map((log) => ({
        ...log,
        id: log._id || Math.random()
      }));

      setLogs(formattedLogs);
      console.log("📥 Logs from DB:", formattedLogs);

    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ================= WEBSOCKET REAL-TIME ================= */

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => {
      console.log("🔗 WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Ignore system messages
        if (!data.label) return;

        console.log("📡 Incoming:", data);

        // ✅ ONLY ADD THREATS
        if (data.label === "THREAT") {

          const newLog = {
            ...data,
            id: Date.now() + Math.random()
          };

          setLogs((prev) => {
            // ❌ prevent duplicate (same src + time)
            const exists = prev.find(
              (log) =>
                log.src === newLog.src &&
                log.timestamp === newLog.timestamp
            );

            if (exists) return prev;

            return [newLog, ...prev].slice(0, 100);
          });
        }

      } catch (err) {
        console.error("❌ WS parse error:", err);
      }
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  /* ================= UI ================= */

  return (
    <div className="container mt-4">
      <h3 className="text-danger mb-3">🚨 Threat Logs</h3>

      <div
        className="card bg-dark text-white p-3 border-danger"
        style={{ height: "500px", overflowY: "auto" }}
      >
        {logs.length === 0 ? (
          <p className="text-secondary">No threats found...</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="mb-2 p-2 rounded"
              style={{ background: "#5a0000" }}
            >
              <div><strong>Scan ID:</strong> {log.scanId || "N/A"}</div>
              <div><strong>Time:</strong> {log.timestamp}</div>
              <div><strong>Source:</strong> {log.src}</div>
              <div><strong>Destination:</strong> {log.dst}</div>
              <div>
                <strong>Confidence:</strong>{" "}
                {log.prediction_prob
                  ? log.prediction_prob.toFixed(2)
                  : "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className="text-danger fw-bold">
                  {log.label}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;