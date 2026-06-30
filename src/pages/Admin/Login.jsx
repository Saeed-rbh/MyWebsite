import React, { useState } from 'react';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useSpring, animated, easings } from 'react-spring';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const cardAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(0,30px,0)' },
        to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
        config: { duration: 600, easing: easings.easeOutQuad }
    });

    const errorAnimation = useSpring({
        opacity: error ? 1 : 0,
        transform: error ? 'translate3d(0,0,0)' : 'translate3d(0,-10px,0)'
    });
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError(''); // Clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(credentials);
            localStorage.setItem('token', data.token);
            navigate('/admin');
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}></div>
            <animated.div
                className={styles.loginCard}
                style={cardAnimation}
            >
                <h2 className={styles.title}>Admin Access</h2>

                {error && (
                    <animated.div
                        className={styles.error}
                        style={errorAnimation}
                    >
                        {error}
                    </animated.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            className={styles.input}
                            onChange={handleChange}
                            placeholder="Enter username"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            onChange={handleChange}
                            placeholder="Enter password"
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                        style={{ transition: 'transform 0.1s', cursor: 'pointer' }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </animated.div>
        </div>
    );
};

export default Login;
