import { useState } from 'react';
import Register from './Register';
import Unregister from './Unregister';
import utils from '../utils.mjs';

interface LoginProps {
    onLoginSuccess: () => void; // Callback to notify when login is successful
}

function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error state before submission

        try {
            const result = await utils.processRoute('POST', '/auth/login', { username, password });
            
            if (result.status === 200) {
                localStorage.setItem('token', result.result.token);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                onLoginSuccess(); // Notify parent component of successful login
            } else {
                setError('Incorrect username or password. New user? Please register.');
            }
        } catch (e) {
            setError('Login failed. Please try again later.');
        }
    };

    return (
        <div className="login-form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="auth-options">
                <Register onLoginSuccess={onLoginSuccess} />
                <Unregister />
            </div>
        </div>
    );
}

export default Login;
