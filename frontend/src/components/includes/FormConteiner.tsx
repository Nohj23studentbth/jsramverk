import { useState } from 'react';
import utils from '../../utils.mjs';

interface FormConteinerProps {
    formName: string,
    buttonText: string,
    conditionsHeader: string,
    username: string,
    password: string,
    errorString: string,
    greeting: string,
    conditionsText: JSX.Element[] | null,
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>,
    handleFormChange: (form: 'buttons' | 'login' | 'register' | 'unregister') => void; // New prop
}

function FormConteiner({ formName,
                            buttonText, 
                            conditionsHeader, 
                            errorString,
                            greeting,
                            handleSubmit,
                            conditionsText,
                            username,
                            password,
                            setUsername,
                            setPassword,
                            handleFormChange
                        }: FormConteinerProps) {
    const divClass = formName + "-form-container";
    const formClass = formName + "-form";
    const [agreed, setAgreed] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreed(e.target.checked); // Update the state based on checkbox status
    };
    return (
        <div className={divClass}>
            <button type="submit" className="return-btn" onClick={() => handleFormChange('buttons')}>Back to buttons</button>
            <div className="terms">
                <h3>{conditionsHeader}</h3>
                    {conditionsText}
            </div>
            
            <form  onSubmit={(e) => {
                    if (!agreed) {
                        e.preventDefault(); // Prevent submission if not agreed
                        alert('You must agree to the terms and conditions to proceed.');
                    } else {
                        handleSubmit(e); // Call the provided handleSubmit function
                    }
                }}
                className={formClass}>
                
                <h2>{greeting}</h2>
                <div className="input-group">
                    <label className='check'>
                        <input className='check'
                            type="checkbox"
                            name="check"
                            checked={agreed}
                            onChange={handleCheckboxChange}
                        />
                        I agree to the terms and conditions
                    </label>
                </div>
                <div className="input-group">
                    <input
                        type="email"
                        name='username'
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">{buttonText}</button>
            </form>
        </div>
    );
}

export default FormConteiner;
