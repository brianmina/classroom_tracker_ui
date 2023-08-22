import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Router } from 'react-router-dom';


import Home from './Home';
import Login from './components/Login';


function App() {
    const navigate = useNavigate();

    useEffect(() => {
        // @ts-ignore
        const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

        if (!User) navigate('/login');
    }, [navigate]);


    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/*" element={<Home />} />
        </Routes>
    );
}

export default App;