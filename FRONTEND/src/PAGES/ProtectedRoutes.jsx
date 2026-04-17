import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// For protected pages — user must be logged in
export const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("user") !== null;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/auth");  // 👈 not logged in → go to auth
        }
    }, [isLoggedIn]);

    return isLoggedIn ? children : null;
};

// For auth page — logged in user can not visit
export const AuthRoute = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("user") !== null;

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");      // 👈 logged in → go to home
        }
    }, [isLoggedIn]);

    return !isLoggedIn ? children : null;
};