import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import "./loading.css"

export default function Loading(props) {

    const { user, isLoading, handleAlert } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (props.reqUser !== undefined && !isLoading) {
            if (!user && props.reqUser) {
                navigate("/auth");
                handleAlert(false, "Se requiere iniciar sesión")
            }
            if(user && props.reqVerification && !user.verified){
                navigate("/profile");
                handleAlert(false, "Se necesita una cuenta verificada");
            }
            if (user && !props.reqUser) {
                navigate("/profile");
            }
        }
    }, [user, isLoading, navigate]);
    if (isLoading) {
        return (
            <>
                <div className="loading">
                    <i className='bx bx-loader-alt bx-spin'></i>
                </div>
            </>
        )
    }
}
