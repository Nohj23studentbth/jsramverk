// import { useState } from 'react';
// import utils from '../../utils.mjs';

import { useState } from "react";

interface FormConteinerProps {
    formName: string,
    buttonText: string,
    conditionsHeader: string,
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    errorString: string,
    greeting: string,
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleFormChange: (form: 'buttons' | 'login' | 'register' | 'unregister') => void;
    // handleSubmit: () => void;
    conditionsText: JSX.Element[] | null,
}

function FormConteiner({ formName,
                            buttonText, 
                            conditionsHeader, 
                            errorString,
                            greeting,
                            handleSubmit,
                            handleFormChange,
                            conditionsText,
                            username,
                            password,
                            setUsername,
                            setPassword,
                        }: FormConteinerProps) {
    const [isGdprApproved, setIsGdprApproved] = useState(false);
    const divClass = formName + "-form-container";
    const formClass = formName + "-form";



    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setIsGdprApproved(e.target.checked); // Update the parent component's selectedIndex
    };

    const handleButtonClick = () => {
        if (!isGdprApproved) {
            alert('You must agree to the terms and conditions to enable this button.');
        } else {
            // Trigger form submission
            document.getElementById('submit-form')?.dispatchEvent(new MouseEvent('click'));
        }
    };

    return (
        <div className={divClass}>
        <button type="button" className="return-button" onClick={() => handleFormChange('buttons')}>
           Back to start
        </button>
            <div className="terms">
                <h3>{conditionsHeader}</h3>
                    {conditionsText}
            </div>
            <form onSubmit={handleSubmit} className={formClass}>
                <h2>{greeting}</h2>
                <div className="input-group check">
                    <label>
                        <input
                            type="checkbox"
                            checked={isGdprApproved}
                            onChange={handleCheckboxChange}
                        />
                        I approve all terms and conditions.
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
                <button type="submit" 
                        className="submit-button"
                        onClick={handleButtonClick} 
                        // disabled={!isGdprApproved} 
                        >
                            {buttonText}
                </button>
            </form>
        </div>
    );
}

export default FormConteiner;
