import {Alert, AlertTitle} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";
import showAlert from "../utils/alert";
import {toCents} from "../utils/transform";

export default function CreateBalance() {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [alert, setAlert] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`${process.env.REACT_APP_API_URL}/balances`,{
                name: name,
                amount: toCents(amount),
                description: description
            });

            setAlert({ type: 'success', message: 'Saldo adicionado com sucesso' });
            handleRedirect()
        } catch (error) {
            setAlert({ type: 'warning', message: 'Ocorreu um erro ao adicionar o saldo' });
        }
    };

    const handleRedirect = () => {
        navigate('/balance');
    };

    return (
        <MainLayout>
            <h2>Saldos | Adicionar</h2>

            {alert.type && (
                <Alert severity={alert.type}>
                    <AlertTitle>{alert.type === 'success' ? 'Success' : alert.type === 'warning' ? 'Warning' : 'Info'}</AlertTitle>
                    {alert.message}
                </Alert>
            )}

            <div className="empty-state">
                <form onSubmit={handleSubmit}>
                    <div>
                        <TextField type="text" fullWidth label="Nome" color="secondary"
                                   onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div>
                        <TextField type="text" fullWidth label="Descrição" color="secondary"
                                   onChange={(e) => setDescription(e.target.value)} required/>
                    </div>
                    <div>
                        <TextField type="text" fullWidth label="Valor" color="secondary"
                                   onChange={(e) => setAmount(e.target.value)} required/>
                    </div>
                    <div className={'footer_btns'}>
                        <Link to="/balance">
                            <Button variant="outlined">
                                CANCELAR
                            </Button>
                        </Link>

                        <Button variant="contained" type="submit">
                            CRIAR
                        </Button>
                    </div>

                </form>
            </div>
        </MainLayout>
    );
}
