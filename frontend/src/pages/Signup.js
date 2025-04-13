import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                username,
                email,
                password,
            });

            // Handle successful registration
            setSuccess('Registrado com sucesso');
            setError('');
        } catch (err) {
            // Handle error
            setError('Ocorreu um erro interno. Tente novamente.');
            setSuccess('');
        }
    };

    return (
        <div className="center">
            <h2 className="logo">Payments</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField type="text" label="Nome de usuário" color="secondary" value={username}
                               onChange={(e) => setUsername(e.target.value)} focused required/>
                </div>
                <div>
                    <TextField type="text" label="Email" color="secondary" value={email}
                               onChange={(e) => setEmail(e.target.value)} focused required/>
                </div>
                <div>
                    <TextField type="password" label="Senha" color="secondary" value={password}
                               onChange={(e) => setPassword(e.target.value)} focused required/>
                </div>
                <Button variant="contained" type="submit">
                    Register
                </Button>
                {success && <p className="success">{success} </p>}

                Já tem uma conta? <Link to="/login">Login</Link>
            </form>
        </div>
    );
};

export default Signup;
