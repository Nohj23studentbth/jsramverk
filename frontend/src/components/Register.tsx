import { useState } from 'react';
import utils from '../utils.mjs';

interface RegisterProps {
    onLoginSuccess: () => void;  // Callback function to notify App when login is successful
}

function Register({ onLoginSuccess }: RegisterProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous error
        setMessage(''); // Clear previous success message

        try {
            const response = await utils.processRoute('POST', '/auth/register', { username, password });

            if (response.status === 201) {
                localStorage.setItem('token', response.result.token);  // Fixed token storage key
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);

                setMessage('Registration successful! Welcome!');
                onLoginSuccess();  // Notify parent component of successful registration
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (e) {
            setError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="register-form-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>New user? Sign up</h2>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
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
                <button type="submit" className="submit-btn">Register</button>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
            </form>

            <div className="terms">
                <h3>Terms and Conditions</h3>
                <p>
                    Your email will be stored together with your personal API key to contact you in case of violation of the
                    terms and conditions or if an excessive number of requests is made to the API.
                </p>
                <p>
                    You are responsible for ensuring that the data stored in the API's database complies with current legal
                    regulations.
                </p>
                <p>
                    You may request the deletion of your API key and all associated data at any time by using the{' '}
                    <a href="/api_key/deregister">deregister form</a>.
                </p>
            </div>
        </div>
    );
}

export default Register;
