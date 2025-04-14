import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Routes, Route, useNavigate} from 'react-router-dom';
import {setupInterceptors} from "./axios";
import EditBalance from "./pages/edit-balance";
import EditPayment from "./pages/edit-payment";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payments from "./pages/payments";
import Balance from "./pages/balance";
import CreateBalance from "./pages/create-balance";
import CreatePayment from "./pages/create-payment";

function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setupInterceptors(navigate, dispatch);
    }, [navigate, dispatch]);

    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/balance" element={<Balance />} />
                <Route path="/create-balance" element={<CreateBalance />} />
                <Route path="/edit-balance/:id" element={<EditBalance />} />
                <Route path="/create-payment" element={<CreatePayment />} />
                <Route path="/edit-payment/:id" element={<EditPayment />} />
                <Route path="/logout" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
