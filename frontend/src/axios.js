import axios from 'axios';
import store from "./redux/store";
import { clearToken } from "./redux/authSlice";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const setupInterceptors = (navigate, dispatch) => {
    api.interceptors.request.use(
        (config) => {
            const state = store.getState();
            const token = state.auth.token;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        response => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                dispatch(clearToken());
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
};

export default api;