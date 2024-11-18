// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Asegúrate de que esta importación sea correcta

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(undefined); // Estado inicial como undefined

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Estado de autenticación cambiado:", user); // Mensaje más descriptivo
            setCurrentUser(user || null); // Asignar null si no hay usuario
        });
        return unsubscribe;
    }, []);

    return { currentUser }; // Devuelve el usuario autenticado
};

export default useAuth; // Exportación por defecto
