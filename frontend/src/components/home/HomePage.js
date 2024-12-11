import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import Home from "./Home";
import "./HomePage.css";
import { API_BASE_URL } from '../../config'
import axios from 'axios'
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const [applications, setApplications] = useState([]);
  const location = useLocation();
  const { username } = location.state || {};
  useEffect(() => {
    // const mockApplications = [
    //   { name: "Software Engineer", company: "Google", date: "2024-11-15", status: "Applied" },
    //   { name: "Data Scientist", company: "Meta", date: "2024-12-01", status: "Interview Scheduled" },
    //   { name: "SWE Intern", company: "IBM", date: "2024-10-20", status: "Rejected" },
    //   { name: "Security Intern", company: "CrowdStrike", date: "2024-11-01", status: "Applied" },
    //   { name: "Software Developer", company: "Amazon", date: "2024-11-10", status: "Offered" },
    //   { name: "Frontend Developer", company: "Netflix", date: "2024-11-25", status: "Interview Scheduled" },
    //   { name: "Backend Engineer", company: "Oracle", date: "2024-12-05", status: "Applied" },
    //   { name: "Full Stack Developer", company: "Adobe", date: "2024-10-18", status: "Rejected" },
    //   { name: "Mobile Developer", company: "Samsung", date: "2024-10-30", status: "Applied" },
    //   { name: "Cloud Engineer", company: "Microsoft", date: "2024-11-12", status: "Offered" },
    // ];
    // setApplications(mockApplications);
    const fetchApplications = async () => {
      try {
          
          const res = await axios.get(`https://job-seeker-backend.vercel.app/api/applications`, { params: { username } })
          
          if (res.status === 200) {
              setApplications(res.data.data)
              console.log(res.data.data);
          }
      } catch (err) {
          console.error('Error retrieving applications:', err)
      }
    }

    fetchApplications()
  }, []);

  return (
    <div className="statistics-page">
      <h1 className="page-title">Job Applications Dashboard</h1>
      <p className="page-subtitle">Visualize and manage your job applications effectively.</p>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-container">
          <DonutChart applications={applications} />
        </div>
        <div className="chart-container">
          <LineChart applications={applications} />
        </div>
      </div>

      {/* Home Component */}
      <div className="home-section">
        <Home username = {username}/>
      </div>
    </div>
  );
};

export default HomePage;
