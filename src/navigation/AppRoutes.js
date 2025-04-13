import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Profile from "../pages/Profile";
import Landing from "../pages/Landing";

function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profile" element={<Profile/>} />
        </Routes>

    )
}
export default AppRoutes;
