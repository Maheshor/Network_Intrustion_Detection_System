import React from "react";
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

  const threatData = {
    labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25"],
    datasets: [
      {
        label: "Threats Detected",
        data: [1, 3, 2, 5, 4, 7],
        borderColor: "#dc3545",
        backgroundColor: "rgba(220,53,69,0.2)",
        tension: 0.4,
      },
      {
        label: "Safe Packets",
        data: [120, 140, 160, 180, 200, 230],
        borderColor: "#28a745",
        backgroundColor: "rgba(40,167,69,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔴 IMPORTANT
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#adb5bd" },
        grid: { color: "#2c2c2c" },
      },
      y: {
        ticks: { color: "#adb5bd" },
        grid: { color: "#2c2c2c" },
      },
    },
  };

  return (
    <div className="container-fluid min-vh-100 overflow-hidden px-4 py-3">

      <h1 className="fw-bold mb-3">Dashboard</h1>

      {/* CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card text-center text-white bg-dark border-secondary">
            <div className="card-body py-3">
              <h6>Safe Packets</h6>
              <p className="fs-2 text-success fw-bold">561</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center text-white bg-dark border-secondary">
            <div className="card-body py-3">
              <h6>Threats Detected</h6>
              <p className="fs-2 text-danger fw-bold">51</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center text-white bg-dark border-secondary">
            <div className="card-body py-3">
              <h6>Last Scan</h6>
              <p className="text-secondary">5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* SMALLER CHART */}
      <div className="card bg-dark border-secondary p-3">
        <h6 className="text-white mb-2">Network Threat Analysis</h6>

        {/* Chart Height Controlled Here */}
        <div style={{ height: "280px" }}>
          <Line data={threatData} options={options} />
        </div>
      </div>

    </div>
  );
}
