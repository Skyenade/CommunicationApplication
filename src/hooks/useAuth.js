// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(undefined); // Initial state as undefined

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Estado de autenticación cambiado:", user); // More descriptive message
            setCurrentUser(user || null); // Set null if there is no user
        });
        return unsubscribe;
    }, []);

    return { currentUser }; // Returns the authenticated user
};

export default useAuth;
