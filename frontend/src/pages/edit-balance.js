import {Alert, AlertTitle, CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";
import {formatCurrency, fromCents, toCents} from "../utils/transform";

export default function EditBalance() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({type: '', message: ''});
    const navigate = useNavigate();

    useEffect(() => {

        const fetchDataPayment = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_API_URL}/balances/${id}`);

                setName(response.data.name)
                setAmount(fromCents(response.data.initial_value))

                setLoading(false);
            } catch (err) {
                console.error('Erro ao carregar opções:', err);
                setLoading(false);
            }
        };

        fetchDataPayment().then()
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(`${process.env.REACT_APP_API_URL}/balances/${id}`, {
                newName: name
            });

            setAlert({type: 'success', message: 'Saldo editado com sucesso'});
            handleRedirect()
        } catch (error) {
            setAlert({
                type: 'warning',
                message: `Ocorreu um erro ao editar o Saldo: ${error.response.data.description}`
            });
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
                        <TextField type="text" defaultValue={name} fullWidth label="Nome" color="secondary"
                                   onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div>
                        <TextField type="text" defaultValue={amount} fullWidth label="Valor" color="secondary"
                                    disabled required/>
                    </div>
                    <div className={'footer_btns'}>
                        <Link to="/payments">
                            <Button variant="outlined">
                                CANCELAR
                            </Button>
                        </Link>

                        <Button variant="contained" type="submit">
                            Editar
                        </Button>
                    </div>

                </form>
            </div>
        </MainLayout>
    )
        ;
}
