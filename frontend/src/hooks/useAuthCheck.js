import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, clearToken } from '../redux/authSlice';

export const useAuthCheck = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (token) {
            dispatch(setToken({token: token, email: email}));
        } else {
            dispatch(clearToken());
        }
    }, [dispatch]);
};
