import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password,
            });
            console.log('Login Response:', response.data);
            setPhone(response.data.phone);
            setStep(2);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Login Error:', error.response ? error.response.data : error.message);
            setError('Failed to login. Please check your credentials.');
        }
    };

    const handle2FA = async (e) => {
        e.preventDefault();
        try {
            const confirmationResult = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
            const result = await confirmationResult.confirm(code);
            console.log('2FA Result:', result);
            // Validate 2FA code with backend
            const response = await axios.post('http://127.0.0.1:8000/api/2fa/validate', {
                phone,
                code,
            });
            console.log('2FA Validation Response:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('2FA Error:', error.response ? error.response.data : error.message);
            setError('Failed to verify 2FA code. Please try again.');
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {step === 1 && (
                <form onSubmit={handleLogin}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button type="submit">Login</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handle2FA}>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="2FA Code" />
                    <button type="submit">Verify</button>
                </form>
            )}
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Login;
