import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Authentication state changed:", user);
            setCurrentUser(user || null);
        });
        return unsubscribe;
    }, []);

    return { currentUser };
};

export default useAuth;
