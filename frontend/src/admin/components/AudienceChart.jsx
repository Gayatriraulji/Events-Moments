import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const AudienceChart = ({ data }) => {
  const chartData = {
    datasets: [
      {
        data,
        backgroundColor: ["#C5A059", "#9FE1CB"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: { legend: { display: false } },
  };

  return (
    <div style={{ width: "80px", height: "80px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default AudienceChart;