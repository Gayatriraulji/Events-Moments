import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const MembershipChart = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#AEB8F0", "#4B3FBF", "#9FE1CB", "#4B3FBF", "#AEB8F0"],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { display: false },
    },
  };

  return (
    <div style={{ height: "130px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MembershipChart;