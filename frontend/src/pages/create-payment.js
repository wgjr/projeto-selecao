import {Alert, AlertTitle, CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";
import {toCents} from "../utils/transform";

export default function CreatePayment() {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({type: '', message: ''});

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

        fetchData().then()
    }, [loading]);

    const handleChange = (event) => {
        setSelected(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(`${process.env.REACT_APP_API_URL}/payments`, {
                name: name,
                amount: toCents(amount),
                description: description,
                balanceId: selected
            });

            setAlert({type: 'success', message: 'Pagamento adicionado com sucesso'});
        } catch (error) {
            setAlert({
                type: 'warning',
                message: `Ocorreu um erro ao criar pagamento: ${error.response.data.description}`
            });
        }
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
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id="api-select-label">Selecione o saldo a utilizar</InputLabel>
                            {loading ? (
                                <CircularProgress size={24}/>
                            ) : (
                                <Select
                                    labelId="api-select-label"
                                    value={selected}
                                    label="Usuário"
                                    onChange={handleChange}
                                >
                                    {options.length === 0 ? (
                                        <MenuItem value="" disabled>
                                            Sem saldos disponíveis
                                        </MenuItem>
                                    ) : (
                                        options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            )}
                        </FormControl>
                    </div>
                    <div className={'footer_btns'}>
                        <Link to="/payments">
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
    )
        ;
}
