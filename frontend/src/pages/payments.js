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
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';

export default function Payments() {
    const [paymentLines, setPaymentLines] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(0)
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({type: '', message: ''});

    const fetchData = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/payments`);
            setPaymentLines(response.data.length);
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);


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
                const response = await api.delete(`${process.env.REACT_APP_API_URL}/payments/${selectedItem.id}`);

                setAlert({type: 'success', message: 'Pagamento removido com sucesso'});
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
                <h2>Pagamentos</h2>

                {paymentLines > 0 && (
                    <Link to="/create-payment">
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

            {paymentLines === 0 && (
                <div className="empty-state">
                    <p>Você não possui pagamentos</p>
                    <Link to="/create-payment">
                        <Button variant="contained" style={{borderRadius: 33}}>Criar Pagamento</Button>
                    </Link>
                </div>
            )}

            {paymentLines > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{`${formatCurrency(fromCents(item.amount))}`}</TableCell>
                                    <TableCell>
                                        <Link to={`/edit-payment/${item.id}`}>
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