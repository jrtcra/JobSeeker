import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import { API_BASE_URL } from '../../config'
import StatusOptions from './StatusOptions'
import axios from 'axios'
import './Home.css'

const testApplications = [
    {
        name: "Data Science Intern (PLACEHOLDER DATA)",
        company: "Meta",
        status: "Applied",
        statusColor: StatusOptions.find(option => option.value === "Applied")?.color,
        webpage: "https://meta.com/careers",
        notes: "",
        date: "2024-12-01",
    },
    {
        name: "Software Engineer (PLACEHOLDER DATA)",
        company: "Google",
        status: "Interview Scheduled",
        statusColor: StatusOptions.find(option => option.value === "Interview Scheduled")?.color,
        webpage: "https://google.com/careers/application",
        notes: "On 12/12/24",
        date: "2024-11-15",
    },
    {
        name: "SWE Intern (PLACEHOLDER DATA)",
        company: "IBM",
        status: "Rejected",
        statusColor: StatusOptions.find(option => option.value === "Rejected")?.color,
        webpage: "https://ibm.com/careerprofile",
        notes: "",
        date: "2024-10-20",
    },
    {
        name: "Security Intern (PLACEHOLDER DATA)",
        company: "CrowdStrike",
        status: "Applied",
        statusColor: StatusOptions.find(option => option.value === "Applied")?.color,
        webpage: "https://crowdstrike.com/interns",
        notes: "Send email to HR",
        date: "2024-11-01",
    },
]

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
    const [applications, setApplications] = useState([])
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState(null) // Track which application is being edited
    const [newApplication, setNewApplication] = useState({
        name: "",
        company: "",
        date: "",
        status: "",
        statusColor: "",
        webpage: "",
        notes: "",
    })

    // TODO: Fetch all applications by the user
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/applications`, { params: { username } })

                if (res.status === 200) {
                    console.log(res.data.data);
                    if (res.data.data.length != 0) {
                        var apps = res.data.data;
                        apps.forEach(function(curr_app) {
                            // Your logic here
                            curr_app.statusColor = StatusOptions.find(option => option.value === curr_app.status)?.color;

                        });
                        setApplications(res.data.data);
                    }
                    
                }
            } catch (err) {
                console.error('Error retrieving applications:', err)
            }
        }

        setApplications(testApplications)
        fetchApplications()
    }, [])

    const extractDomain = (url) => {
        try {
            // Ensure the URL has a protocol; if not, add "https://"
            const validUrl = url.includes('://') ? url : `https://${url}`;
            const { hostname } = new URL(validUrl);
            return hostname;
        } catch (error) {
            console.error("Invalid URL:", url);
            return "";
        }
    }

    const addApplication = async () => {
        if (
            newApplication.name &&
            newApplication.company &&
            newApplication.date &&
            newApplication.status
        ) {
            try {
                // TODO: make API request to save the new application
                const name = newApplication.name;
                const company = newApplication.company;
                const date = newApplication.date;
                const status = newApplication.status;
                const webpage = newApplication.webpage;
                const notes = newApplication.notes;
                const res = await axios.post(`${API_BASE_URL}/application`, {username:username, name:name, date:date, company:company, status:status, webpage:webpage, notes:notes})
                if (res.status === 201) {
                    setApplications([...applications, { ...newApplication }])
                    setNewApplication({
                        name: "",
                        company: "",
                        date: "",
                        status: "",
                        statusColor: "",
                        webpage: "",
                        notes: "",
                    })
                    setIsAdding(false)
                }
            } catch (err) {
                console.error('Error retrieving applications:', err)
            }
            
            
        } else {
            alert("Please fill in all required fields")
        }
    }

    const handleStatusChange = (e) => {
        const selectedStatus = StatusOptions.find(
            (option) => option.value === e.target.value
        )
        setNewApplication({
            ...newApplication,
            status: selectedStatus.value,
            statusColor: selectedStatus.color,
        })
    }
    const deleteApplication = (index) => {
        // const res = await axios.delete(`${API_BASE_URL}/application`, {
        //     params: { username: username }
        // });
        // Remove the application from the list
        setApplications(applications.filter((_, i) => i !== index))
        // TODO: make API request to delete the application
    }

    const editApplication = (index) => {
        setIsEditing(index)
        setNewApplication({ ...applications[index] })
    }

    const saveEditedApplication = () => {
        const updatedApplications = applications.map((app, index) =>
            index === isEditing ? newApplication : app
        )
        setApplications(updatedApplications)
        setIsEditing(null)
        setNewApplication({
            name: "",
            company: "",
            date: "",
            status: "",
            statusColor: "",
            webpage: "",
            notes: "",
        })
        // TODO: make API request to update the application
    }

    const cancelEdit = () => {
        setIsEditing(null)
        setNewApplication({
            name: "",
            company: "",
            date: "",
            status: "",
            statusColor: "",
            webpage: "",
            notes: "",
        })
    }

    const cancelAdd = () => {
        setIsAdding(false)
        setNewApplication({
            name: "",
            company: "",
            date: "",
            status: "",
            statusColor: "",
            webpage: "",
            notes: "",
        })
    }

    return (
        <div>
        <div style={headerContainerStyle}>
            <h1 style={{ margin: "20px" }}>JobTracker</h1>
            <button style={{ margin: "20px" }} onClick={logOut}>
            Log Out
            </button>
        </div>
        <div className="home-container">
            <button className="save-button" onClick={navigateToProfile}>Profile</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Date Applied</th>
                        <th>Status</th>
                        <th>Webpage</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app, index) => {
                        let domain = null
                        if (app.webpage) {
                            domain = extractDomain(app.webpage)
                        }

                        const faviconUrl = domain === "google.com"
                            ? `https://www.faviconextractor.com/favicon/${domain}?larger=true`
                            : `https://www.faviconextractor.com/favicon/${domain}`
                        return isEditing === index ? (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        value={newApplication.name}
                                        onChange={(e) =>
                                            setNewApplication({ ...newApplication, name: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newApplication.company}
                                        onChange={(e) =>
                                            setNewApplication({ ...newApplication, company: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={newApplication.date}
                                        onChange={(e) =>
                                            setNewApplication({ ...newApplication, date: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <select
                                        value={newApplication.status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="" disabled>
                                            Select Status
                                        </option>
                                        {StatusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newApplication.webpage}
                                        onChange={(e) =>
                                            setNewApplication({
                                                ...newApplication,
                                                webpage: e.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newApplication.notes}
                                        onChange={(e) =>
                                            setNewApplication({ ...newApplication, notes: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <button className="save-button" onClick={saveEditedApplication}>
                                        Save
                                    </button>
                                    <button className="cancel-button" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={index}>
                                <td>{app.name}</td>
                                <td>{app.company}</td>
                                <td>{app.date}</td>
                                <td>
                                    <span
                                        className="status-span"
                                        style={{ backgroundColor: app.statusColor }}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {domain && <a
                                        href={app.webpage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="webpage-link"
                                    >
                                        <img
                                            src={faviconUrl}
                                            alt={`${app.company} Favicon`}
                                        />
                                        {app.webpage}
                                    </a>}
                                </td>
                                <td>{app.notes}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => editApplication(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteApplication(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    {!isAdding && (
                        <tr>
                            <td colSpan="7">
                                <button
                                    className="add-button"
                                    onClick={() => setIsAdding(true)}
                                >
                                    +
                                </button>
                                <span className="add-text"> Add new task</span>
                            </td>
                        </tr>
                    )}
                    {isAdding && (
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newApplication.name}
                                    onChange={(e) =>
                                        setNewApplication({ ...newApplication, name: e.target.value })
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={newApplication.company}
                                    onChange={(e) =>
                                        setNewApplication({
                                            ...newApplication,
                                            company: e.target.value,
                                        })
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    value={newApplication.date}
                                    onChange={(e) =>
                                        setNewApplication({ ...newApplication, date: e.target.value })
                                    }
                                />
                            </td>
                            <td>
                                <select
                                    value={newApplication.status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="" disabled>
                                        Select Status
                                    </option>
                                    {StatusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Webpage Link"
                                    value={newApplication.webpage}
                                    onChange={(e) =>
                                        setNewApplication({
                                            ...newApplication,
                                            webpage: e.target.value, // Set the value directly as a string
                                        })
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Notes"
                                    value={newApplication.notes}
                                    onChange={(e) =>
                                        setNewApplication({ ...newApplication, notes: e.target.value })
                                    }
                                />
                            </td>
                            <td>
                                <button className="save-button" onClick={addApplication}>
                                    Save
                                </button>
                                <button className="cancel-button" onClick={cancelAdd}>
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}
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

export default Home