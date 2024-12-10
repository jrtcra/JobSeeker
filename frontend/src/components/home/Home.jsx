import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'

const Home = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const navigate = useNavigate();
  const navigateToProfile = () => {
      console.log("username: " + username);
      navigate('/profile', {state: {username}});
  };
  const logOut = () => {
    navigate('/login');
  };
  const applications = [
    {
      name: "Data Science Intern",
      company: "Meta",
      status: "Applied",
      statusColor: "#FFD580", // yellow
      webpage: {
        text: "Meta Careers",
        link: "https://meta.com/careers",
      },
      notes: "",
    },
    {
      name: "Software Engineer",
      company: "Google",
      status: "Interview Scheduled",
      statusColor: "#C8FACD", // green
      webpage: {
        text: "Google Applications",
        link: "https://google.com/careers/application",
      },
      notes: "On 12/12/24",
    },
    {
      name: "SWE Intern",
      company: "IBM",
      status: "Rejected",
      statusColor: "#FFABAB", // red
      webpage: {
        text: "Learn More at IBM",
        link: "https://ibm.com/careerprofile",
      },
      notes: "",
    },
    {
      name: "Security Intern",
      company: "CrowdStrike",
      status: "Applied",
      statusColor: "#FFD580", // yellow
      webpage: {
        text: "Work with CrowdStrike",
        link: "https://crowdstrike.com/interns",
      },
      notes: "Send email to HR",
    },
  ]

  return (
    <div>
    <div style={headerContainerStyle}>
        <h1 style={{ margin: "20px" }}>JobTracker</h1>
        <button style={{ margin: "20px" }} onClick={logOut}>
          Log Out
        </button>
      </div>
    <div style={{ padding: "20px" }}>
      
      <h2>You have [2] more applications to reach your weekly goal!</h2>
      <button onClick={navigateToProfile}>Profile</button>
      <button>Stats</button>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Company</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Webpage</th>
            <th style={headerStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={cellStyle}>{app.name}</td>
              <td style={cellStyle}>{app.company}</td>
              <td style={cellStyle}>
                <span
                  style={{
                    backgroundColor: app.statusColor,
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  {app.status}
                </span>
              </td>
              <td style={cellStyle}>
                <a
                  href={app.webpage.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0073e6", textDecoration: "none" }}
                >
                  {app.webpage.text}
                </a>
              </td>
              <td style={cellStyle}>{app.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

const headerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: '#4285f4',
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #ddd",
};


const headerStyle = {
  backgroundColor: "#f4f4f4",
  padding: "10px",
  textAlign: "left",
  border: "1px solid #ddd",
}

const cellStyle = {
  padding: "10px",
  textAlign: "left",
}

export default Home