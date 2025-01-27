import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react'
import './process.css'

export default function Process(props) {
    const [input, setInput] = useState("");

    const { showProcess, setShowProcess } = useAuth();

    const inputName = props.input;
    const callback = props.callback;
    
    return (
        <>
            {showProcess ? (<>
                <div className="absolute-bg">
                    <div className="absolute-box process">
                        <i className="bx bx-x color-sk exit-icon" onClick={() => setShowProcess(false)}></i>
                        <div className="title">Ingrese su {inputName}</div>
                        <input type="text" className="input" onChange={(e) => setInput(e.target.value)} />
                        <button className="button" onClick={async () => { await callback(input); setShowProcess(false)}}>Aceptar</button>
                    </div>
                </div>
            </>) : <></>}
        </>
    )
}
