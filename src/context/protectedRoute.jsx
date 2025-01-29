import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Loading from '../components/loading/loading'

export default function ProtectedRoute({element: Component, reqUser, reqVerification, ...rest}) {
    const { user, isLoading, handleAlert } = useAuth();

    if(isLoading){
        return <Loading />;
    }

    if (reqUser && !user) {
        handleAlert(false, "Se requiere iniciar sesión");
        return <Navigate to="/auth" />
    }

    if (reqVerification && user && !user.verified) {
        handleAlert(false, "Se necesita una cuenta verificada");
        return <Navigate to="/profile" />;
    }

    return Component;
}
