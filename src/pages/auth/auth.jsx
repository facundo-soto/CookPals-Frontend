import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Process from '../../components/process/process';
import Loading from '../../components/loading/loading'
import './auth.css';

export default function Auth() {
  const { registerWithEmailAndPass, logInWithEmailAndPass, logInWithGoogle, setShowProcess, sendChangePassEmail } = useAuth();

  const [isLoging, setIsLoging] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (email, pass) => {
    if (!email || !pass) {
      alert("no");
      return;
    }
    if (!isLoging) {
      await registerWithEmailAndPass(email, pass);
    }
    else {
      await logInWithEmailAndPass(email, pass);
    }
  }

  return (
    <>
      <Loading reqUser={false} />
      <Process input={"email"} callback={sendChangePassEmail} />
      <div className="form">
        <div className="title">{isLoging ? "Inicio de sesión" : "Registro"}</div>
        <input type="text" className="input" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input" placeholder='Contraseña' onChange={(e) => setPass(e.target.value)} />
        {isLoging ? <div className="change-form color-hover" onClick={() => setShowProcess(true)}>Olvidé mi contraseña</div> : <></>}
        <button className="button" onClick={async () => await handleSubmit(email, pass)}>{isLoging ? "Iniciar sesión" : "Registrarse"}</button>
        <div className="change-form color-hover" onClick={() => setIsLoging(!isLoging)}>{isLoging ? "¿No tienes una cuenta? Registrate" : "¿Ya tienes una cuenta? Inicia sesión"}</div>
        <button className="button google-btn" onClick={async () => await logInWithGoogle()}><i className="bx bxl-google"></i>Ingresar con Google</button>
      </div>
    </>
  )
}
