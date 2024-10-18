import { useState } from 'react';
import FormConteiner from './includes/FormConteiner';
import utils from '../utils.mjs';

interface AuthProps {
    onLoginSuccess: () => void; // Callback to notify when login is successful
}

function Auth({ onLoginSuccess }: AuthProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // State to track which form to display
    const [currentForm, setCurrentForm] = useState<'buttons' | 'login' | 'register' | 'unregister'>('buttons');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleFormChange = (form: 'buttons' | 'login' | 'register' | 'unregister') => {
        setCurrentForm(form);
        setError(''); // Clear error when switching forms
        setMessage('');
    };

    // Modified handleSubmit for the FormContainer
    const handleSubmit = async (e: React.FormEvent, route: string, method: string) => {
        e.preventDefault();
        setError(''); // Reset error state before submission
        setMessage(''); // Reset message state before submission

        try {
            const response = await utils.processRoute(method, route, { "username":username, "password":password });

            if (response.ok) {
                if (route === '/auth/login') {
                    localStorage.setItem('token', response.result.token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                    onLoginSuccess(); // Notify parent component of successful login
                } else if (route === '/auth/register') {
                    setMessage('User successfully registered. Please log in!');
                    handleFormChange('login'); // Switch to login form after successful registration
                } else if (route === '/auth/unregister') {
                    localStorage.clear(); // Clear local storage on account removal
                    setMessage('User successfully removed. All your data are removed!');
                    handleFormChange('buttons'); // Go back to buttons after unregistration
                }
            } else {
                // Handle unsuccessful login and return to buttons
                if (route === '/auth/login') {
                    setError('Incorrect username or password. New user? Please register.');
                    handleFormChange('buttons'); // Return to button selection
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        } catch (e) {
            setError(`Connection to database failed, please try later. Error: ${e}`);
        }
    };

    return (
        <>
            {currentForm === 'buttons' && (
                <div className='auth-button'>
                    <button className="auth" onClick={() => handleFormChange('login')}>Login</button>
                    <button className="auth" onClick={() => handleFormChange('register')}>Register</button>
                    <button className="auth" onClick={() => handleFormChange('unregister')}>Remove Account</button>
                </div>
            )}
            
            {currentForm === 'login' && (
                <div className='auth-options'>
                
                <FormConteiner
                    formName={'login'}
                    buttonText={'Login'}
                    conditionsHeader={''}
                    errorString={'Incorrect username or password. New user? Please register.'}
                    greeting={'Login'}
                    conditionsText={null}
                    handleSubmit={(e) => handleSubmit(e, '/auth/login', 'POST')} // Pass down the handleSubmit
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
                 {error && <p className="error-message">{error}</p>}
                 {message && <p className="success-message">{message}</p>}
                </div>
            )}

            {currentForm === 'register' && (
                <div className='auth-options'>
                <FormConteiner
                    formName={'register'}
                    buttonText={'Register'}
                    errorString={'An error occurred during registration. Please try again.'}
                    greeting={'New user? Sign up'}
                    conditionsHeader={'Terms and Conditions'}
                    conditionsText={[
                        <p key="1">Your email will be stored together with your personal API key to contact you in case of violation of the terms and conditions or if an excessive number of requests is made to the API.</p>,
                        <p key="2">You are responsible for ensuring that the data stored in the API's database complies with current legal regulations.</p>,
                        <p key="3">You may request the deletion of your API key and all associated data at any time by <a href="/api_key/deregister">removing your account</a>.</p>,
                      ]} 
                    handleSubmit={(e) => handleSubmit(e, '/auth/register', 'POST')} // Pass down the handleSubmit
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
                 {error && <p className="error-message">{error} <a href="/api_key/deregister">or return to start</a></p>}
                 {message && <p className="success-message">{message}</p>}
                </div>
            )}

            {currentForm === 'unregister' && (
                <div className='auth-options'>
                <FormConteiner
                    formName={'unregister'}
                    buttonText={'Remove Account'}
                    errorString={'Failed to unregister. Please check your credentials.'}
                    greeting={'Remove your account'}
                    conditionsHeader={'CAUTION!'}
                    conditionsText={[<><h3 key="1">IT IS YOUR RESPONSIBILITY TO SAVE YOUR DATA </h3>
                        <h3 key="2">IF YOUR PROCEED All YOUR DATA WILL BE REMOVED </h3>
                        <h3 key="3">All your credential will be also removed.</h3></>]}
                    handleSubmit={(e) => handleSubmit(e, '/auth/unregister', 'DELETE')} // Pass down the handleSubmit
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
                 {error && <p className="error-message">{error}</p>}
                 {message && <p className="success-message">{message}</p>}
                </div>
            )}

           
        
        </>
    );
}

export default Auth;