import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import './Signup.css'

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [isSignupErrorVisible, setIsSignupErrorVisible] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/user/register', { username, email, password });
            if (res.status === 201) {
                console.log('Signup successful');
                navigate('/login'); // Redirect to login after successful signup
            } else {
                setIsSignupErrorVisible(true);
            }
        } catch (err) {
            console.error('Server error:', err);
            setIsSignupErrorVisible(true);
        }
    };

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    return (
        <div className='login-form'>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className='login-username'>
                    <p>Username</p>
                    <input type='text' onChange={handleUsernameChange} required />
                </div>
                <div className='login-email'>
                    <p>Email</p>
                    <input type='email' onChange={handleEmailChange} required />
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
                            <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>
                {isSignupErrorVisible && (
                    <p className='login-error'>Signup failed. Please try again.</p>
                )}
                <button type='submit'>Signup</button>
            </form>
        </div>
    );
};

export default Signup;