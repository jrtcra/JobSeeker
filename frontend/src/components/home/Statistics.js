import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import "./Statistics.css"; // Add a separate CSS file for styling

const Statistics = () => {
  const [applications, setApplications] = useState([]);
  const [seriesVisibility, setSeriesVisibility] = useState({
    Applied: true,
    "Interview Scheduled": true,
    Rejected: true,
    Offered: true,
  });

  // Fetch mock applications
  useEffect(() => {
    const mockApplications = [
      { name: "Software Engineer", company: "Google", date: "2024-11-15", status: "Applied" },
      { name: "Data Scientist", company: "Meta", date: "2024-12-01", status: "Interview Scheduled" },
      { name: "SWE Intern", company: "IBM", date: "2024-10-20", status: "Rejected" },
      { name: "Security Intern", company: "CrowdStrike", date: "2024-11-01", status: "Applied" },
      { name: "Software Developer", company: "Amazon", date: "2024-11-10", status: "Offered" },
    ];
    setApplications(mockApplications);
  }, []);

  // Prepare data for donut chart
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

  // Prepare data for line chart
  const lineChartData = [["Date", "Applied", "Interview Scheduled", "Rejected", "Offered"]];
  const lineChartMap = {};
  applications.forEach((app) => {
    const date = app.date;
    if (!lineChartMap[date]) {
      lineChartMap[date] = { Applied: 0, "Interview Scheduled": 0, Rejected: 0, Offered: 0 };
    }
    lineChartMap[date][app.status] += 1;
  });

  Object.entries(lineChartMap)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .forEach(([date, counts]) => {
      lineChartData.push([new Date(date), counts.Applied, counts["Interview Scheduled"], counts.Rejected, counts.Offered]);
    });

  const filteredLineChartData = lineChartData.map((row, rowIndex) => {
    if (rowIndex === 0) {
      return row.filter((_, colIndex) => colIndex === 0 || seriesVisibility[row[colIndex]]);
    } else {
      return row.filter((_, colIndex) => colIndex === 0 || seriesVisibility[lineChartData[0][colIndex]]);
    }
  });

  const lineChartOptions = {
    title: "Applications Over Time",
    curveType: "function",
    legend: { position: "bottom" },
    fontSize: 14,
    hAxis: {
      title: "Date",
      format: "MMM dd, yyyy",
      gridlines: { color: "#e0e0e0" },
    },
    vAxis: {
      title: "Number of Applications",
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
    <div className="statistics-container">
      <h1 className="title">Job Applications Statistics</h1>
      <p className="subtitle">Analyze your job applications to track your progress and success over time.</p>

      {/* Total number of applications */}
      <div className="summary">
        <h2>Total Applications</h2>
        <p className="count">{applications.length}</p>
      </div>

      {/* Donut Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Applications by Status</h3>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={donutChartData}
          options={donutChartOptions}
        />
      </div>

      {/* Line Chart Controls */}
      <div className="chart-controls">
        <h3 className="chart-title">Toggle Lines</h3>
        <div className="checkbox-group">
          {Object.keys(seriesVisibility).map((series) => (
            <label key={series} className="checkbox-label">
              <input
                type="checkbox"
                checked={seriesVisibility[series]}
                onChange={() => handleCheckboxChange(series)}
              />
              {series}
            </label>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Applications Over Time</h3>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={filteredLineChartData}
          options={lineChartOptions}
        />
      </div>
    </div>
  );
};

export default Statistics;
