import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import { API_BASE_URL } from '../../config'
import './Profile.css'

const Profile = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({ username: '', email: '' })
    const logOut = () => {
        navigate('/login');
    };
    const returnToTracker = () => {
        navigate('/home', {state: {username}});
    };
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // const res = await axios.get(`${API_BASE_URL}/user/profile/:id`, {
                //     withCredentials: true,
                // });
                console.log(username);
                const res = await axios.get(`${API_BASE_URL}/user/profile`, { params: { username } });

                if (res.status !== 200) {
                    navigate('/login')
                } else {
                    console.log(res);
                    console.log(res.data.data.username);
                    setUser(res.data.data);
                    setFormData({ username: res.data.username, email: res.data.email })
                }
            } catch (err) {
                console.error('Error fetching profile:', err)
                navigate('/login')
            } finally {
                setLoading(false)
            }
        };

        fetchProfile()
    }, [navigate])

    const handleEditToggle = () => {
        setEditMode(!editMode)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    };

    const handleSave = async () => {
        try {
            // const res = await axios.patch(
            //     `${API_BASE_URL}/user`,
            //     { username: formData.username, email: formData.email },
            //     { withCredentials: true }
            // );
            const res = await axios.patch(
                `${API_BASE_URL}/user`,
                { original_username: username, new_info:{username: formData.username, email: formData.email} }
            );

            if (res.status === 200) {
                setUser(res.data)
                setEditMode(false)
            } else {
                console.error('Error saving profile changes:', res)
            }
        } catch (err) {
            console.error('Error saving profile changes:', err)
        }
    };

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <div>Error: User data is unavailable.</div>
    }

    return (
        <div>
        <div style={headerContainerStyle}>
            <h1 style={{ margin: "20px" }}>JobTracker</h1>
            <button style={{ margin: "20px" }} onClick={logOut}>
            Log Out
            </button>
        </div>
        <button style={{ margin: "20px" }} onClick={returnToTracker}>↩  Back to Tracker</button>
        <div className='profile'>
            <div className='profile-container'>
                <div className='profile-field'>
                    <p>Username</p>
                    {editMode ? (
                        <input
                            type='text'
                            name='username'
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <div>{user.username}</div>
                    )}
                </div>
                <div className='profile-field'>
                    <p>Email</p>
                    {editMode ? (
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <div>{user.email}</div>
                    )}
                </div>
                <div className='profile-actions'>
                    {editMode ? (
                        <button onClick={handleSave}>Save</button>
                    ) : (
                        <button onClick={handleEditToggle}>Edit Profile</button>
                    )}
                    {editMode && <button onClick={handleEditToggle}>Cancel</button>}
                </div>
            </div>
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

export default Profile