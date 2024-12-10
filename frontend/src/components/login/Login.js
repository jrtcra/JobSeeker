import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { API_BASE_URL } from '../../config'
import axios from 'axios'
import './Login.css'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const [isLoginErrorVisible, setIsLoginErrorVisible] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(`${API_BASE_URL}/user/login`, { username, password })
            if (res.status === 200) {
                console.log('Login successful')

                const { token } = res.data.data
                if (token) {
                    sessionStorage.setItem('authToken', token)
                }

                navigate('/home', { state: { username } });
            } else {
                setIsLoginErrorVisible(true)
            }
        } catch (err) {
            console.error('Server error:', err)
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div className='login-form'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className='login-username'>
                    <p>Username</p>
                    <input type='text' onChange={handleUsernameChange} required />
                </div>
                <div className='login-password'>
                    <p>Password</p>
                    <div className='password-input-wrapper'>
                        <input
                            type={visible ? 'text' : 'password'}
                            onChange={handlePasswordChange}
                            required
                        />
                        <button
                            type='button'
                            className='password-toggle-button'
                            onClick={() => setVisible(!visible)}
                            aria-label={visible ? 'Hide password' : 'Show password'}
                        >
                            <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
                        </button>
                    </div>
                </div>
                {isLoginErrorVisible && (
                    <p className='login-error'>Incorrect username or password. Please try again.</p>
                )}
                <button type='submit'>Login</button>
            </form>
            <p>
                Don't have an account? Click <a href='/signup'>here</a> to sign up.
            </p>
        </div>
    )
}

export default Login