import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalPackets: 0, normal: 0, threats: 0 });

  useEffect(() => {
    const fetchFromLocalStorage = () => {
      const savedLogs = JSON.parse(localStorage.getItem("nids_logs") || "[]");
      const savedStats = JSON.parse(localStorage.getItem("nids_stats") || "{}");

      setLogs(savedLogs);
      setStats({
        totalPackets: savedStats.totalPackets || 0,
        normal: savedStats.normal || 0,
        threats: savedStats.threats || 0
      });
    };

    fetchFromLocalStorage();
    const interval = setInterval(fetchFromLocalStorage, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, []);

  // Last 6 logs for chart
  const lastLogs = logs.slice(-6);

  const labels = lastLogs.map((log) =>
    new Date(log.timestamp || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const threatCounts = lastLogs.map((log) => (log.label?.toLowerCase() === "threat" ? 1 : 0));
  const safeCounts = lastLogs.map((log) => (log.label?.toLowerCase() === "normal" ? 1 : 0));

  const threatData = {
    labels,
    datasets: [
      {
        label: "Threats Detected",
        data: threatCounts,
        borderColor: "#dc3545",
        backgroundColor: "rgba(220,53,69,0.2)",
        tension: 0.4,
      },
      {
        label: "Safe Packets",
        data: safeCounts,
        borderColor: "#28a745",
        backgroundColor: "rgba(40,167,69,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#ffffff" } } },
    scales: {
      x: { ticks: { color: "#adb5bd" }, grid: { color: "#2c2c2c" } },
      y: { ticks: { color: "#adb5bd" }, grid: { color: "#2c2c2c" } },
    },
  };

  return (
    <div className="container-fluid min-vh-100 px-4 py-3">
      <h1 className="fw-bold mb-3">Dashboard</h1>

      {/* CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card text-center text-white bg-dark border-secondary">
            <div className="card-body py-3">
              <h6>Safe Packets</h6>
              <p className="fs-2 text-success fw-bold">{stats.normal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center text-white bg-dark border-secondary">
            <div className="card-body py-3">
              <h6>Threats Detected</h6>
              <p className="fs-2 text-danger fw-bold">{stats.threats}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center text-white bg-dark border-secondary">
            <div className="card-body py-3">
              <h6>Last Scan</h6>
              <p className="text-secondary">
                {logs.length > 0
                  ? new Date(logs[0].timestamp).toLocaleString()
                  : "No data"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="card bg-dark border-secondary p-3">
        <h6 className="text-white mb-2">Network Threat Analysis</h6>
        <div style={{ height: "280px" }}>
          <Line data={threatData} options={options} />
        </div>
      </div>
    </div>
  );
}