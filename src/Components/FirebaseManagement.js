import React, { useState, useEffect } from "react";
import './FirebaseManagement.css';
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../UserContext';
import HeaderAdmin from "./HeaderAdmin";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const FirebaseManagement = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { setUserUid, setUserEmail } = useUserContext();

    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const consoleRealtimeUrl = "https://console.firebase.google.com/u/0/project/communityapplication-14c16/database/communityapplication-14c16-default-rtdb/rules";
    const consoleFirestoreUrl = "https://console.firebase.google.com/u/0/project/communityapplication-14c16/firestore/databases/-default-/rules"

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user));
        return unsubscribe;
    }, [auth]);

    const handleLoginRealtimeDatabase = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            window.open(consoleRealtimeUrl, "_blank");
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const handleLoginFirestore = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            window.open(consoleFirestoreUrl, "_blank");
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="firebase-management-container">
            <HeaderAdmin />
            <h1 className="firebase-management-title">Manage Firebase</h1>
            <div className="firebase-management-container-sections">
                <div className="firebase-management-sections">
                    <button onClick={() => handleLoginRealtimeDatabase()} className="firebase-management-buttons">Realtime Database Rules</button>
                </div>
                <div className="firebase-management-sections">
                    <button onClick={() => handleLoginFirestore()} className="firebase-management-buttons">Firestore Database Rules</button>
                </div>
            </div>

        </div>
    );

};
export default FirebaseManagement;