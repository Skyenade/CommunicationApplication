// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Make sure this reference is correct

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(undefined); // Change to undefined

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
