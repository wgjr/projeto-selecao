import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.scss';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import AuthProvider from "./components/AuthProvider";
import store from "./redux/store";

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
    <Provider store={store}> {}
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    </Provider>
);
