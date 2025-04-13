import {CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";

export default function Balance() {
    const [balanceLines, setBalanceLines] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        fetchData().then()
    }, [balanceLines]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>{error}</div>;
    }

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

            {balanceLines === 0 && (
                <div className="empty-state">
                    <p>Você não possui saldo</p>
                    <Link to="/create-balance">
                        <button>Criar Saldo</button>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{`R$ ${item.initial_value}`}</TableCell>
                                    <TableCell>{`R$ ${item.operations_value}`}</TableCell>
                                    <TableCell>{`R$ ${item.remaining_value}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </MainLayout>
    );
}
