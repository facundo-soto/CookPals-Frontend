import { db } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore"

export async function getUser(uid) {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData ?? null;
        }
        else {
            console.warn("No se encontró el documento del usuario");
            return null;
        }
    }
    catch (error) {
        console.error(error);
        throw error
    }
}

export async function createUser(user) {
    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                name: (user.displayName ?? user.email.split('@')[0]),
                image: user.photoURL ?? null,
                savedRecipes: []
            });
        }
        else{
            if(!userDoc.data().image && user.photoURL){
                await setDoc(userDocRef, {
                    name: userDoc.data().name,
                    image: user.photoURL ?? null,
                    savedRecipes: userDoc.data().savedRecipes
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateImage(uid, imageUrl){
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if(userDoc.exists()){
            await setDoc(userDocRef, {
                name: userDoc.data().name,
                image: imageUrl
            });
        }
        else{
            throw new Error("No se encontró al usuario");
        }
    } catch (error) {
        throw error;
    }
}