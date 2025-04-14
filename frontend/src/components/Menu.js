import React from 'react';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {clearToken} from "../redux/authSlice";

function Menu() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleClick(page) {
        navigate(`/${page}`);
    }

    function logOut() {
        dispatch(clearToken());
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        navigate('/login');
    }

    return (
        <nav>
            <ul>
                <li onClick={() => handleClick('payments')}>
                    <img  src={require('../assets/Icon.png')}/>
                    Pagamentos
                </li>
                <li onClick={() => handleClick('balance')}>
                    <img  src={require('../assets/Icon2.png')}/>
                    Saldos
                </li>
                <li onClick={() => logOut()}>
                    <img  src={require('../assets/Icon1.png')}/>
                    Sair da conta
                </li>
            </ul>
        </nav>
    );
}

export default Menu;
