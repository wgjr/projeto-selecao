import {CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../axios";
import MainLayout from "../layouts/main-layout";

export default function Payments() {
    const [paymentLines, setPaymentLines] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_API_URL}/payments`);

                setPaymentLines(response.data.length)
                setData(response.data)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then()
    }, [paymentLines]);


    if (loading) {
        return <CircularProgress/>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
            {paymentLines === 0 && (
                <div className="empty-state">
                    <p>Você não possui pagamentos</p>
                    <Link to="/create-payment">
                        <button>Criar Pagamento</button>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{`R$ ${item.amount}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </MainLayout>
    );
}
