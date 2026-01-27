import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
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

export default function ThreatGraph() {

  const data = {
    labels: [
      "10 min", "9 min", "8 min", "7 min", "6 min",
      "5 min", "4 min", "3 min", "2 min", "1 min"
    ],
    datasets: [
      {
        label: "Threats Detected",
        data: [0, 1, 0, 2, 1, 3, 1, 2, 0, 2],
        borderColor: "#dc3545",
        backgroundColor: "rgba(220, 53, 69, 0.2)",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#333" }
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "#333" }
      }
    }
  };

  return (
    <div className="card bg-dark border-secondary mt-4">
      <div className="card-body">
        <h5 className="card-title text-white mb-3">
          Threat Detection Over Time
        </h5>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
