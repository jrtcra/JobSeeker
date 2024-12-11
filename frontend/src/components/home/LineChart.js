import React, { useState } from "react";
import { Chart } from "react-google-charts";

const LineChart = ({ applications }) => {
  const [seriesVisibility, setSeriesVisibility] = useState({
    Applied: true,
    "Interview Scheduled": true,
    Rejected: true,
    Offered: true,
  });

  // Prepare data for line chart (accumulative)
  const lineChartData = [["Date", "Applied", "Interview Scheduled", "Rejected", "Offered"]];
  const lineChartMap = {};

  // Map dates and statuses
  applications.forEach((app) => {
    const date = app.date;
    if (!lineChartMap[date]) {
      lineChartMap[date] = { Applied: 0, "Interview Scheduled": 0, Rejected: 0, Offered: 0 };
    }
    lineChartMap[date][app.status] += 1;
  });

  // Sort dates and calculate accumulative counts
  let cumulativeCounts = { Applied: 0, "Interview Scheduled": 0, Rejected: 0, Offered: 0 };
  Object.entries(lineChartMap)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .forEach(([date, counts]) => {
      cumulativeCounts = {
        Applied: cumulativeCounts.Applied + counts.Applied,
        "Interview Scheduled": cumulativeCounts["Interview Scheduled"] + counts["Interview Scheduled"],
        Rejected: cumulativeCounts.Rejected + counts.Rejected,
        Offered: cumulativeCounts.Offered + counts.Offered,
      };
      lineChartData.push([
        new Date(date),
        cumulativeCounts.Applied,
        cumulativeCounts["Interview Scheduled"],
        cumulativeCounts.Rejected,
        cumulativeCounts.Offered,
      ]);
    });

  // Filter data based on visibility
  const filteredLineChartData = lineChartData.map((row, rowIndex) => {
    if (rowIndex === 0) {
      return row.filter((_, colIndex) => colIndex === 0 || seriesVisibility[row[colIndex]]);
    } else {
      return row.filter((_, colIndex) => colIndex === 0 || seriesVisibility[lineChartData[0][colIndex]]);
    }
  });

  const lineChartOptions = {
    title: "Accumulative Applications Over Time",
    curveType: "none",
    legend: { position: "bottom" },
    fontSize: 11,
    hAxis: {
      title: "Date",
      format: "MMM dd, yyyy",
      gridlines: { color: "#e0e0e0" },
    },
    vAxis: {
      title: "Cumulative Number of Applications",
      gridlines: { color: "#e0e0e0" },
    },
    colors: ["#4CAF50", "#FFC107", "#F44336", "#03A9F4"],
  };

  const handleCheckboxChange = (series) => {
    setSeriesVisibility((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#fff",
        maxWidth: "800px",
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
        Accumulative Applications Over Time
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
          gap: "15px",
        }}
      >
        {Object.keys(seriesVisibility).map((series) => (
          <label
            key={series}
            style={{
              fontSize: "1rem",
              color: "#555",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <input
              type="checkbox"
              checked={seriesVisibility[series]}
              onChange={() => handleCheckboxChange(series)}
              style={{ cursor: "pointer" }}
            />
            {series}
          </label>
        ))}
      </div>
      <Chart
        chartType="LineChart"
        width="100%"
        height="300px"
        data={filteredLineChartData}
        options={lineChartOptions}
        style={{
          margin: "0 auto",
          display: "block",
        }}
      />
    </div>
  );
};

export default LineChart;
