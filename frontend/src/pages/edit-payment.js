import {Alert, AlertTitle, CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";
import {formatCurrency, fromCents, toCents} from "../utils/transform";

export default function EditPayment() {
    const {id} = useParams();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({type: '', message: ''});
    const [currentPaymentData, setCurrentPaymentData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_API_URL}/balances`);

                setOptions(response.data.map(balance => ({value: balance.id, label: balance.name})));
                setLoading(false);
            } catch (err) {
                console.error('Erro ao carregar opções:', err);
                setLoading(false);
            }
        };

        const fetchDataPayment = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_API_URL}/payments/${id}`);

                setCurrentPaymentData(response.data);

                setName(response.data.name)
                setAmount(fromCents(response.data.amount))
                setDescription(response.data.description)
                setSelected(response.data.balance_id.name)

                setLoading(false);
            } catch (err) {
                console.error('Erro ao carregar opções:', err);
                setLoading(false);
            }
        };

        fetchData().then()
        fetchDataPayment().then()
    }, [loading]);

    const handleChange = (event) => {
        setSelected(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(`${process.env.REACT_APP_API_URL}/payments/${id}`, {
                newName: name
            });

            setAlert({type: 'success', message: 'Pagamento editado com sucesso'});
            handleRedirect()
        } catch (error) {
            setAlert({
                type: 'warning',
                message: `Ocorreu um erro ao editar o pagamento: ${error.response.data.description}`
            });
        }
    };

    const handleRedirect = () => {
        navigate('/payments');
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
                                   required/>
                    </div>
                    <div>
                        <TextField type="text" defaultValue={description} fullWidth label="Descrição" color="secondary"
                                   disabled required/>
                    </div>
                    <div>
                        <TextField type="text" defaultValue={amount} fullWidth label="Valor" color="secondary"
                                   disabled required/>
                    </div>
                    <div>
                        <TextField type="text" defaultValue={selected} fullWidth label="Saldo utilizado"
                                   color="secondary"
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
