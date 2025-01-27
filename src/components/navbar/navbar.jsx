import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css"
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth();

  return (
    <>
      <nav className="navbar">
        <Link to={"/"} className="logo"><img src={"/cookpals-logo.png"} alt="Logo" width={200} height={200} className='logo' /></Link>
        <div className="links">
          <Link className="link color-hover" to={"/"}><i className="bx bx-home bx-sm"></i><span>Inicio</span></Link>
          <Link className="link color-hover" to={"/explore"}><i className="bx bx-food-menu bx-sm"></i><span>Explorar</span></Link>
          {user ? (
            <Link className="link color-hover" to={"/profile"}><i className="bx bxs-user-circle bx-sm"></i><span>Perfil</span></Link>
          ) : (
            <Link className="link color-hover" to={"/auth"}><i className="bx bx-user-circle bx-sm"></i><span>Login</span></Link>
          )}
        </div>
      </nav>
      <div className="mayonesa">mayonesa</div>
    </>
  )
}