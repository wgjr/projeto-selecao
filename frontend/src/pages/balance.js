import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert, AlertTitle,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";
import {formatCurrency, fromCents} from "../utils/transform";

export default function Balance() {
    const [balanceLines, setBalanceLines] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(0)
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({type: '', message: ''});


    const fetchData = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/balances`);

            setBalanceLines(response.data.length)
            setData(response.data)
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    useEffect(() => {
        const onDelete = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_API_URL}/balances`);

                setBalanceLines(response.data.length)
                setData(response.data)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        onDelete().then()
    }, [balanceLines]);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedItem) {
            try {
                const response = await api.delete(`${process.env.REACT_APP_API_URL}/balances/${selectedItem.id}`);

                setAlert({type: 'success', message: 'Saldo Removido com sucesso'});
                fetchData().then();
            } catch (error) {
                setAlert({type: 'warning', message: error.response.data.description});

            } finally {
                setLoading(false);
            }
        }
        handleClose();
    };

    return (
        <MainLayout>
            <div className={'default_header'}>
                <h2>Saldos</h2>

                {balanceLines > 0 && (
                    <Link to="/create-balance">
                        <Button variant="contained">
                            CRIAR
                        </Button>
                    </Link>
                )}
            </div>

            {alert.type && (
                <Alert severity={alert.type}>
                    <AlertTitle>{alert.type === 'success' ? 'Success' : alert.type === 'warning' ? 'Warning' : 'Info'}</AlertTitle>
                    {alert.message}
                </Alert>
            )}

            {balanceLines === 0 && (
                <div className="empty-state">
                    <p>Você não possui saldo</p>
                    <Link to="/create-balance">
                        <Button variant="contained" style={{borderRadius: 33}}>Criar Saldo</Button>
                    </Link>
                </div>
            )}

            {balanceLines > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Valor Inicial</TableCell>
                                <TableCell>Valor Utilizado</TableCell>
                                <TableCell>Valor restante</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{`${formatCurrency(fromCents(item.initial_value))}`}</TableCell>
                                    <TableCell>{`${formatCurrency(fromCents(item.operations_value))}`}</TableCell>
                                    <TableCell>{`${formatCurrency(fromCents(item.remaining_value))}`}</TableCell>
                                    <TableCell>
                                        <Link to={`/edit-balance/${item.id}`}>
                                            <IconButton aria-label="delete">
                                                <CreateIcon/>
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleOpen(item)} aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o saldo "{selectedItem?.name}"? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
}
