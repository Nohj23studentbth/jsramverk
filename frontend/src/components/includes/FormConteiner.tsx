import { useState } from 'react';
import utils from '../../utils.mjs';

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
    // handleSubmit: () => void;
    conditionsText: JSX.Element[] | null,
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
                        }: FormConteinerProps) {
    const divClass = formName + "-form-container";
    const formClass = formName + "-form";
    return (
        <div className={divClass}>
            <div className="terms">
                <h3>{conditionsHeader}</h3>
                    {conditionsText}
            </div>
            <form onSubmit={handleSubmit} className={formClass}>
                <h2>{greeting}</h2>
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
