import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './Profile.css'

const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({ username: '', email: '' })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/profile', {
                    withCredentials: true,
                });

                if (res.status !== 200) {
                    navigate('/login')
                } else {
                    setUser(res.data)
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
            const res = await axios.patch(
                '/profile',
                { username: formData.username, email: formData.email },
                { withCredentials: true }
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
    )
}

export default Profile