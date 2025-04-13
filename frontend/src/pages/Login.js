import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setToken} from '../redux/authSlice';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useSession} from "../hooks/useSession";

const Login = () => {
    const { hasSession } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook para navegação programática

    useEffect(() => {
        if (hasSession()) {
            handleRedirect();
        }
    }, [hasSession]);

    useEffect(() => {
        document.body.classList.add('content-login');

        return () => {
            document.body.classList.remove('content-login');
        };
    }, []);

    const handleRedirect = () => {
        navigate('/payments'); // Redireciona para a rota /upload
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                email,
                password,
            });

            const {access_token, email: userEmail} = response.data;

            dispatch(setToken({token: access_token, email: userEmail}));
            localStorage.setItem('token', access_token)
            localStorage.setItem('email', userEmail)

            setError('');

            handleRedirect()
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="center">
            <h2 className="logo">Payments</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField fullWidth label="Email" id="Email"  onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <TextField type='password' fullWidth label="Senha" id="Senha"  onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <Button variant="contained" type="submit">
                    Login
                </Button>
                Não tem uma conta? <Link to="/signup">Cadastre aqui</Link>
            </form>
        </div>
    );
};

export default Login;