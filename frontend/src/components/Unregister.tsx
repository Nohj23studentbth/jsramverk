import { useState } from 'react';
import utils from '../utils.mjs';

function Unregister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous error
        setMessage(''); // Clear previous success message

        try {
            const response = await utils.processRoute('DELETE', '/auth/unregister', { username, password });

            if (response.status === 201) {
                localStorage.removeItem('token'); // Fixed typo in localStorage.removeItem
                localStorage.removeItem('username');
                localStorage.removeItem('password');

                setMessage('Unregistration successful. Your account has been deleted.');
            } else {
                setError('Failed to unregister. Please check your credentials.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="unregister-form-container">
            <form onSubmit={handleSubmit} className="unregister-form">
                <h2>Unregister Account</h2>
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
                <button type="submit" className="submit-btn">Stop Registration</button>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
            </form>
        </div>
    );
}

export default Unregister;
