"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserActivityChart({ active, inactive, total }) {
  const data = {
    labels: ["Users"], // You can dynamically add more time points
    datasets: [
      {
        label: "Total Users",
        data: [total],
        borderColor: "#fdba74",
        backgroundColor: "rgba(253,186,116,0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Active Users",
        data: [active],
        borderColor: "#86efac",
        backgroundColor: "rgba(134,239,172,0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Inactive Users",
        data: [inactive],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.1)",
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#cbd5e1", font: { size: 13 } }
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0"
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.1)" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.1)" }
      },
    },
  };

  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      padding: "16px",
      borderRadius: "14px",
      width: "100%",
      height: "260px", 
      boxSizing: "border-box"
    }}>
      <Line data={data} options={options} />
    </div>
  );
}
