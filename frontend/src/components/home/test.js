// import React from "react";
// import { Chart } from "react-google-charts";

// const ApplicationsOverTimeChart = () => {
//   const data = [
//     ["Date", "Applications"],
//     [new Date(2024, 9, 29), 2],   // September 29, 2024
//     [new Date(2024, 10, 1), 5],   // November 1, 2024
//     [new Date(2024, 10, 3), 15],  // November 3, 2024
//     [new Date(2024, 10, 5), 30],  // November 5, 2024
//     [new Date(2024, 10, 7), 50],  // November 7, 2024
//     [new Date(2024, 10, 10), 80], // November 10, 2024
//     [new Date(2024, 10, 12), 120],// November 12, 2024
//     [new Date(2024, 10, 15), 160],// November 15, 2024
//     [new Date(2024, 10, 18), 200],// November 18, 2024
//     [new Date(2024, 10, 20), 250],// November 20, 2024
//     [new Date(2024, 10, 22), 300],// November 22, 2024
//     [new Date(2024, 10, 25), 400],// November 25, 2024
//     [new Date(2024, 10, 28), 550],// November 28, 2024
//     [new Date(2024, 11, 1), 700], // December 1, 2024
//     [new Date(2024, 11, 5), 1000],// December 5, 2024
//   ];

//   // Generate weekly ticks for the horizontal axis
//   const getWeeklyTicks = (data) => {
//     const dates = data.slice(1).map((entry) => entry[0]);
//     const minDate = new Date(Math.min(...dates));
//     const maxDate = new Date(Math.max(...dates));
//     const ticks = [];
//     const currentDate = new Date(minDate);
//     currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from the previous Sunday
//     while (currentDate <= maxDate) {
//       ticks.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
//     }
//     return ticks;
//   };

//   const options = {
//     title: "Applications Over Time",
//     curveType: "function",  // Enables smooth curves
//     legend: { position: "bottom" },
//     hAxis: {
//       title: "Date",
//       format: "MMM dd, yyyy",  // Formats the date on the horizontal axis
//       ticks: getWeeklyTicks(data),  // Set weekly ticks
//     },
//     vAxis: {
//       title: "Number of Applications",
//     },
//   };

//   return (
//     <Chart
//       chartType="LineChart"
//       width="400px"
//       height="400px"
//       data={data}
//       options={options}
//     />
//   );
// };

// export default ApplicationsOverTimeChart;

import React, { useState } from "react";
import { Chart } from "react-google-charts";

const initialData = [
  ["Year", "Sales", "Expenses", "another"],
  ["2013", 1000, 400, 500],
  ["2014", 1170, 460, 100],
  ["2015", 660, 1120, 700],
  ["2016", 1030, 540, 1200],
];

const options = {
  chart: {
    title: "Company Performance",
    subtitle: "Sales and Expenses over the Years",
  },
};

function App() {
  const [seriesVisibility, setSeriesVisibility] = useState({
    Sales: true,
    Expenses: true,
    another: true
  });

  // Filter data based on series visibility
  const filteredData = initialData.map((row, rowIndex) => {
    if (rowIndex === 0) {
      // Header row
      return row.filter((_, colIndex) => colIndex === 0 || seriesVisibility[row[colIndex]]);
    } else {
      // Data rows
      return row.filter((_, colIndex) => colIndex === 0 || seriesVisibility[initialData[0][colIndex]]);
    }
  });

  const handleCheckboxChange = (series) => {
    setSeriesVisibility((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  return (
    <div>
      <div>
        {Object.keys(seriesVisibility).map((series) => (
          <label key={series}>
            <input
              type="checkbox"
              checked={seriesVisibility[series]}
              onChange={() => handleCheckboxChange(series)}
            />
            {series}
          </label>
        ))}
      </div>
      <Chart
        chartType="Line"
        width="50%"
        height="400px"
        data={filteredData}
        options={options}
      />
    </div>
  );
}

export default App;
