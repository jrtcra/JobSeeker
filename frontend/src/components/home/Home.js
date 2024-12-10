import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown, faFilter } from '@fortawesome/free-solid-svg-icons'
import StatusOptions from './StatusOptions'
import axios from 'axios'
import './Home.css'

const testApplications = [
    {
        name: "Data Science Intern",
        company: "Meta",
        status: "Applied",
        statusColor: StatusOptions.find(option => option.value === "Applied")?.color,
        webpage: "https://meta.com/careers",
        notes: "",
        date: "2024-12-01",
    },
    {
        name: "Software Engineer",
        company: "Google",
        status: "Interview Scheduled",
        statusColor: StatusOptions.find(option => option.value === "Interview Scheduled")?.color,
        webpage: "https://google.com/careers/application",
        notes: "On 12/12/24",
        date: "2024-11-15",
    },
    {
        name: "SWE Intern",
        company: "IBM",
        status: "Rejected",
        statusColor: StatusOptions.find(option => option.value === "Rejected")?.color,
        webpage: "https://ibm.com/careerprofile",
        notes: "",
        date: "2024-10-20",
    },
    {
        name: "Security Intern",
        company: "CrowdStrike",
        status: "Applied",
        statusColor: StatusOptions.find(option => option.value === "Applied")?.color,
        webpage: "https://crowdstrike.com/interns",
        notes: "Send email to HR",
        date: "2024-11-01",
    },
]

const Home = () => {
    const [applications, setApplications] = useState([])
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState(null) // Track which application is being edited
    const [sortOrder, setSortOrder] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [filterStatus, setFilterStatus] = useState('')
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
            newApplication.status
        ) {
            // TODO: make API request to save the new application
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

    const sortApplicationsByDate = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc"
        const sortedApplications = [...applications].sort((a, b) => {
            if (newOrder === "asc") {
                return new Date(a.date) - new Date(b.date)
            } else {
                return new Date(b.date) - new Date(a.date)
            }
        })
        setApplications(sortedApplications)
        setSortOrder(newOrder)
    }

    const handleStatusFilterChange = (status) => {
        setFilterStatus(status)
        setShowDropdown(false)
    }

    const filteredApplications = applications.filter((app) => {
        const matchesSearch = searchQuery
            ? app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              app.company.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        const matchesStatus = filterStatus ? app.status === filterStatus : true
        return matchesSearch && matchesStatus
    })

    return (
        <div className="home-container">
            <h1 className="component-title">My Job Applications</h1>
            <input
                    type="text"
                    placeholder="Search by Job Title or Company Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>
                            Date Applied
                            <button
                                onClick={sortApplicationsByDate}
                                className="sort-button"
                                style={{ marginLeft: "5px", border: "none", background: "none" }}
                            >
                                {sortOrder === "asc" ? (
                                    <FontAwesomeIcon icon={faSortUp} />
                                ) : sortOrder === "desc" ? (
                                    <FontAwesomeIcon icon={faSortDown} />
                                ) : (
                                    <FontAwesomeIcon icon={faSort} />
                                )}
                            </button>
                        </th>
                        <th>
                            Status
                            <div
                                className="status-filter-container"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                                onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown on click
                            >
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="filter-icon"
                                />
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <div
                                            onClick={() =>
                                                handleStatusFilterChange('')
                                            }
                                            className="dropdown-item"
                                        >
                                            All
                                        </div>
                                        {StatusOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() =>
                                                    handleStatusFilterChange(
                                                        option.value
                                                    )
                                                }
                                                className="dropdown-item"
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </th>
                        <th>Webpage</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.map((app, index) => {
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
                                <span className="add-text"> Add new Application</span>
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