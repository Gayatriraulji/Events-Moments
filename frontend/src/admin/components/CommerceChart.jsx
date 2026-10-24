import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const CommerceChart = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: "#4B3FBF",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 9 } } },
    },
  };

  return (
    <div style={{ height: "130px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CommerceChart;