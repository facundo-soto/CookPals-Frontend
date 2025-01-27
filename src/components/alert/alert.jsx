import React from 'react'
import { useAuth } from '../../context/AuthContext'
import "./alert.css"

export default function Alert() {
  const { alert, handleAlert } = useAuth();
  const reload = alert?.reload ?? false;
  return (
    <>
      {alert ? (
        <div className="absolute-bg">
          <div className={alert ? "absolute-box alert" : ""}>
            <i className={`bx color-sk ${alert.ok ? "bxs-check-circle" : "bx-x-circle"}`}></i>
            <div className="title">{alert.message}</div>
            <button className='button' onClick={() => reload ? window.location.reload() : handleAlert()}>Continuar</button>
          </div>
        </div>
      ) : <></>}
    </>
  )
}
