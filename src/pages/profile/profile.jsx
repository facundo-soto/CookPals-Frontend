import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Process from '../../components/process/process';
import Loading from '../../components/loading/loading';
import './profile.css'
import { useNavigate } from 'react-router-dom';
import Recipes from '../../components/recipes/recipes';


export default function Profile() {
    const { user, logOut, resendEmailVerification, setShowProcess, changeUsername, changeImage, getUserRecipes, getUserSavedRecipes } = useAuth();
    const [show, setShow] = useState(1);
    const [userRecipes, setUserRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const navigate = useNavigate();

    const handleImageChange = async (e) => {
        await changeImage(e.target.files[0]);
    }

    useEffect(() => {
        const getRecipes = async () => {
            return setUserRecipes(await getUserRecipes());
        }
        const getSavedRecipes = async (uid) => {
            return setSavedRecipes(await getUserSavedRecipes(uid));
        }
        user?.uid && getRecipes();
        user?.uid && getSavedRecipes(user.uid);
    }, [user, show])

    return (
        <>
            <Loading reqUser={true} />
            <Process input={"nombre de usuario"} callback={changeUsername} />
            {user && (<>
                <div className="profile main-box">
                    <div className="profile-data">
                        <input type="file" id="profile-image" name="profile-image" className="vanish" onChange={handleImageChange}></input>
                        <label htmlFor="profile-image" className="profile-image-container">
                            {user.image ? (<>
                                <img className="profile-image" src={user.image} alt="Foto de perfil" />
                                <i className="bx bxs-edit-alt overlay-icon"></i>
                                <div className="overlay"></div>
                            </>) : <i className="bx bx-user-circle color-sk profile-icon"></i>}
                        </label>
                        <div className="data">
                            <p className="user-data"><b>Usuario: </b><span>{user.name}</span><i className="bx bxs-edit-alt color-sk" onClick={() => setShowProcess(true)}></i></p>
                            <p className="user-data"><b>Email: </b><span>{user.email}</span></p>
                        </div>
                    </div>
                </div>
                <div className="profile profile-options-container main-box">
                    <div className="profile-options">
                        <div className={`option ${show === 1 ? "option-selected" : ""}`} onClick={() => setShow(1)}>Ajustes</div>
                        <div className={`option ${show === 2 ? "option-selected" : ""}`} onClick={() => setShow(2)}>Guardadas</div>
                        <div className={`option ${show === 3 ? "option-selected" : ""}`} onClick={() => setShow(3)}>Recetas</div>
                    </div>
                </div>
                {show === 1 && (<>
                    <div className="profile main-box">
                        <div className="profile-settings">
                            {!user.verified ? (
                                <div className="setting">
                                    <div className="setting-text">
                                        <div className="setting-title">Verificar Cuenta</div>
                                        <div className="setting-desc">Envía un correo a su email para verificar su cuenta</div>
                                    </div>
                                    <button className="button" onClick={resendEmailVerification}>Enviar Correo</button>
                                </div>
                            ) : (
                                <div className="setting">
                                    <div className="setting-text">
                                        <div className="setting-title">Crear Receta</div>
                                        <div className="setting-desc">Crea y sube tu propia receta</div>
                                    </div>
                                    <button className="button" onClick={() => navigate("/create-recipe")}>Crear Receta</button>
                                </div>
                            )}
                            <div className="setting">
                                <div className="setting-text">
                                    <div className="setting-title">Cerrar Sesión</div>
                                    <div className="setting-desc">Cierra la sesión de la cuenta abierta</div>
                                </div>
                                <button className="button" onClick={logOut}>Cerrar Sesion</button>
                            </div>
                        </div>
                    </div>
                </>)}
                {show === 2 && (<>
                    <div className="recipes-container">
                        {savedRecipes?.length > 0 ? (<Recipes recipes={savedRecipes} />) : (<div className="no-content">No tienes recetas guardadas</div>)}
                    </div>
                </>)}
                {show === 3 && (<>
                    <div className="recipes-container">
                        {userRecipes?.length > 0 ? (<Recipes recipes={userRecipes} />) : (<div className="no-content">No tienes recetas</div>)}
                    </div>
                </>)}
            </>)}
        </>
    )
}
