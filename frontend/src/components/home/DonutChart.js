import React from "react";
import { Chart } from "react-google-charts";

const DonutChart = ({ applications }) => {
  // Prepare data for the donut chart
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const donutChartData = [["Status", "Count"], ...Object.entries(statusCounts)];

  const donutChartOptions = {
    title: "Applications by Status",
    pieHole: 0.4,
    is3D: false,
    fontSize: 14,
    colors: ["#4CAF50", "#FFC107", "#F44336", "#03A9F4"],
    chartArea: { width: "80%", height: "80%" },
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#fff",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Applications by Status
      </h3>
      <Chart
        chartType="PieChart"
        width="100%"
        height="300px"
        data={donutChartData}
        options={donutChartOptions}
        style={{
          margin: "0 auto",
          display: "block",
        }}
      />
    </div>
  );
};

export default DonutChart;
