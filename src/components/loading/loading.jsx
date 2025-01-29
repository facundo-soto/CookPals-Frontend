import React from 'react'
import { useAuth } from '../../context/AuthContext'
import "./loading.css"

export default function Loading() {

    const { isLoading } = useAuth();
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
