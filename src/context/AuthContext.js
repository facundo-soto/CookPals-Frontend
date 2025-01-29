import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { getUser, createUser, updateImage } from '../firebase/users';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { REACT_APP_API_URL } from '../config/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showProcess, setShowProcess] = useState(false);

    useEffect(() => {
        console.log(user);

        // Escuchar cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setIsLoading(true);
            if (currentUser) {
                try {
                    const storageUser = await getUser(currentUser.uid) ?? null;
                    const userName = storageUser?.name ?? null;
                    const userImage = storageUser?.image ?? null;

                    // Guardar información básica del usuario
                    setUser({
                        uid: currentUser.uid,
                        name: userName ?? (currentUser.displayName ?? currentUser.email.split('@')[0]),
                        image: userImage ?? (currentUser.photoURL ?? null),
                        email: currentUser.email,
                        verified: currentUser.emailVerified
                    });
                }
                catch (error) {
                    console.error(error);
                }
            } else {
                setUser(null); // No hay usuario autenticado
            }
            setIsLoading(false);
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    const handleAlert = (ok, message, reload) => {
        if (message) {
            setAlert({
                ok: ok,
                message: message,
                reload: reload ?? false
            });
        }
        else {
            setAlert(null);
        }
    }

    const registerWithEmailAndPass = async (email, pass) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await createUser(userCredential.user);
            await sendEmailVerification(userCredential.user);
            handleAlert(true, "Registro exitoso, revise su correo para verificar su email");
        }
        catch (error) {
            handleAlert(false, "Registro fallido")
        }
        setIsLoading(false);
    }

    const logInWithEmailAndPass = async (email, pass) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            console.log(userCredential);
            handleAlert(true, "Ingreso exitoso");
        }
        catch (error) {
            handleAlert(false, "Ingreso fallido")
        }
        setIsLoading(false);
    }

    const logInWithGoogle = async () => {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            console.log(userCredential);

            await createUser(userCredential.user);
            navigate("/profile");
            handleAlert(true, "Ingreso exitoso");
        } catch (error) {
            handleAlert(false, "Ingreso fallido");
        }
        setIsLoading(false);
    }

    const logOut = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            navigate("/auth");
            handleAlert(true, "Sesión cerrada con éxito");
        }
        catch (error) {
            handleAlert(false, "No se pudo cerrar sesión");
        }
        setIsLoading(false);
    }

    const changeUsername = async (newName) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${REACT_APP_API_URL}/profile/update-username`, {
                uid: user.uid,
                newName: newName
            });
            console.log(response.data);
            handleAlert(true, "Cambio realizado con éxito", true)
        }
        catch (error) {
            console.error(error.response?.data ?? error.message);
            handleAlert(false, "No se pudo cambiar su nombre");
        }
        setIsLoading(false)
    }

    const resendEmailVerification = async () => {
        setIsLoading(true);

        try {
            await sendEmailVerification(auth.currentUser);
            handleAlert(true, "Correo enviado con éxito, revise su buzón");
        } catch (error) {
            console.error(error);
            handleAlert(false, "Error al enviar el correo");
        }
        setIsLoading(false);
    }

    const sendChangePassEmail = async (email) => {
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            handleAlert(true, "Correo de reestablecimiento enviado, revise su email");
        }
        catch (error) {
            console.error(error);
            handleAlert(false, "Error al enviar el correo de reestablecimiento")
        }
        setIsLoading(false);
    }

    const uploadImage = async (image) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post(`${REACT_APP_API_URL}/profile/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = response.data;

            handleAlert(true, "Imagen subida con exito");
            console.log(data);
            console.log(data.link);
        }
        catch (error) {
            console.error(error);
            handleAlert(false, "Error al subir la imagen");
        }
        setIsLoading(false);
    }

    const submitRecipe = async (recipe, image) => {
        setIsLoading(true);
        try {
            if (!image || !recipe.title || !recipe.description || !recipe.ingredients || !recipe.steps || !recipe.filters) {
                throw new Error("Faltan datos en la receta");
            }
            const formData = new FormData();
            formData.append("recipe", JSON.stringify(recipe));
            formData.append("uid", user.uid);
            formData.append("image", image);
            const response = await axios.post(`${REACT_APP_API_URL}/recipes/submit-recipe`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            handleAlert(true, "Receta subida con éxito");
            navigate("/profile");
        } catch (error) {
            console.error(error);
            handleAlert(false, "Error al subir la receta");
        }
        setIsLoading(false);
    }

    const changeImage = async (image) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", image);

            const response = await axios.post(`${REACT_APP_API_URL}/profile/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = response.data;
            const imageUrl = data.link;
            await updateImage(user.uid, imageUrl);
            handleAlert(true, "Cambio ralizado con éxito", true);
        } catch (error) {
            console.error(error);
            handleAlert(false, "No se pudo actualizar su foto de perfil");
        }
        setIsLoading(false);
    }

    const getRecipes = async () => {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/recipes/get-recipes`, {
                params: {
                    uid: user.uid
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const getUserRecipes = async () => {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/recipes/get-user-recipes`, {
                params: {
                    uid: user.uid
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/recipes/get-recipe-by-id`, {
                params: {
                    id: id,
                    userId: user.uid
                }
            });
            console.log(response.data);

            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const submitComment = async (recipeId, comment) => {
        setIsLoading(true);
        comment.userId = user.uid;
        console.log(recipeId, comment);
        
        try {
            const formData = new FormData();
            formData.append("recipeId", recipeId);
            formData.append("comment", JSON.stringify(comment));

            await axios.post(`${REACT_APP_API_URL}/recipes/submit-comment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleAlert(true, "Comentario enviado con éxito", true);
        } catch (error) {
            console.error(error);
            handleAlert(false, "Error al enviar el comentario")
        }
        setIsLoading(false);
    }

    const getUserSavedRecipes = async (uid) => {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/recipes/get-saved-recipes`, {
                params: {
                    uid: uid
                }
            });
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const saveRecipe = async (recipeId) => {
        setIsLoading(true);
        try {
            await axios.post(`${REACT_APP_API_URL}/recipes/save-recipe`, {
                uid: user.uid,
                recipeId: recipeId
            });
            handleAlert(true, "Receta guardada con éxito", true);
        } catch (error) {
            console.error(error);
            handleAlert(false, "Error al guardar la receta");
        }
        setIsLoading(false);
    }

    const unsaveRecipe = async (recipeId) => {
        setIsLoading(true);
        try {
            await axios.post(`${REACT_APP_API_URL}/recipes/unsave-recipe`, {
                uid: user.uid,
                recipeId: recipeId
            });
            handleAlert(true, "Receta desguardada con éxito", true);
        } catch (error) {
            console.error(error);
            handleAlert(false, "Error al desguardar la receta");
        }
        setIsLoading(false);
    }

    return (
        <AuthContext.Provider value={{ user, registerWithEmailAndPass, logInWithEmailAndPass, logInWithGoogle, logOut, alert, handleAlert, isLoading, setIsLoading, showProcess, setShowProcess, changeUsername, resendEmailVerification, sendChangePassEmail, uploadImage, changeImage, submitRecipe, getRecipes, getUserRecipes, getRecipeById, submitComment, getUserSavedRecipes, saveRecipe, unsaveRecipe }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}