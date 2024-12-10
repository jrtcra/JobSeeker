import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../config'
import StatusOptions from './StatusOptions'
import axios from 'axios'
import './Home.css'

const testApplications = [
    {
        name: "Data Science Intern",
        company: "Meta",
        status: "Applied",
        statusColor: StatusOptions.find(option => option.value === "Applied")?.color,
        webpage: {
            link: "https://meta.com/careers",
        },
        notes: "",
        date: "2024-12-01",
    },
    {
        name: "Software Engineer",
        company: "Google",
        status: "Interview Scheduled",
        statusColor: StatusOptions.find(option => option.value === "Interview Scheduled")?.color,
        webpage: {
            link: "https://google.com/careers/application",
        },
        notes: "On 12/12/24",
        date: "2024-11-15",
    },
    {
        name: "SWE Intern",
        company: "IBM",
        status: "Rejected",
        statusColor: StatusOptions.find(option => option.value === "Rejected")?.color,
        webpage: {
            link: "https://ibm.com/careerprofile",
        },
        notes: "",
        date: "2024-10-20",
    },
    {
        name: "Security Intern",
        company: "CrowdStrike",
        status: "Applied",
        statusColor: StatusOptions.find(option => option.value === "Applied")?.color,
        webpage: {
            link: "https://crowdstrike.com/interns",
        },
        notes: "Send email to HR",
        date: "2024-11-01",
    },
]

const Home = () => {
    const [applications, setApplications] = useState([])
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState(null) // Track which application is being edited
    const [newApplication, setNewApplication] = useState({
        name: "",
        company: "",
        date: "",
        status: "",
        statusColor: "",
        webpage: {
            link: "",
        },
        notes: "",
    })

    // TODO: Fetch all applications by the user
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/applications`, {
                    withCredentials: true,
                })

                if (res.status === 200) {
                    setApplications(res.data.applications)
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
            const { hostname } = new URL(url)
            return hostname
        } catch (error) {
            console.error("Invalid URL:", url)
            return ""
        }
    }

    const addApplication = () => {
        if (
            newApplication.name &&
            newApplication.company &&
            newApplication.date &&
            newApplication.status &&
            newApplication.webpage.link
        ) {
            // TODO: make API request to save the new application
            setApplications([...applications, { ...newApplication }])
            setNewApplication({
                name: "",
                company: "",
                date: "",
                status: "",
                statusColor: "",
                webpage: {
                    link: "",
                },
                notes: "",
            })
            setIsAdding(false)
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
            webpage: {
                link: "",
            },
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
            webpage: {
                link: "",
            },
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
            webpage: {
                link: "",
            },
            notes: "",
        })
    }

    return (
        <div className="home-container">
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
                        const domain = extractDomain(app.webpage.link)
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
                                        value={newApplication.webpage.link}
                                        onChange={(e) =>
                                            setNewApplication({
                                                ...newApplication,
                                                webpage: {
                                                    ...newApplication.webpage,
                                                    link: e.target.value,
                                                },
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
                                    <a
                                        href={app.webpage.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="webpage-link"
                                    >
                                        <img
                                            src={faviconUrl}
                                            alt={`${app.company} Favicon`}
                                        />
                                        {app.webpage.link}
                                    </a>
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
                                    value={newApplication.webpage.link}
                                    onChange={(e) =>
                                        setNewApplication({
                                            ...newApplication,
                                            webpage: {
                                                ...newApplication.webpage,
                                                link: e.target.value,
                                            },
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
    )
}

export default Home