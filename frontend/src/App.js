import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payments from "./pages/payments";
import Balance from "./pages/balance";
import CreateBalance from "./pages/create-balance";
import CreatePayment from "./pages/create-payment";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/balance" element={<Balance />} />
                <Route path="/create-balance" element={<CreateBalance />} />
                <Route path="/create-payment" element={<CreatePayment />} />
                <Route path="/logout" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
