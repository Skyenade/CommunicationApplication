// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Asegúrate de que esta referencia sea correcta

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(undefined); // Cambia a undefined

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("User authentication state changed:", user);
            setCurrentUser(user || null);
        });
        return unsubscribe;
    }, []);

    return { currentUser };
};

export default useAuth;
