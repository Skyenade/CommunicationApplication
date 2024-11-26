import React, { useEffect, useState } from "react";
import "../Style.css";
import "./RequestAssistance.css"
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { ref, get, push, set } from "firebase/database";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, database, firestore } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const RequestAssistance = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [requestText, setRequestText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async (userId) => {
            try {
                const userRef = ref(database, `users/${userId}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log("Fetched user data:", userData);
                    setUsername(userData.username);
                    setEmail(userData.email);
                } else {
                    console.log("User data not found in the database");
                }
                
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
            } else {
                console.log("No user is signed in");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!auth.currentUser) {
            console.error("No authenticated user found");
            return;
        }

        try {
            console.log("Submitting assistance request...");
            const requestRef = push(ref(database, "assistanceRequests"));
            console.log("Generated request ref:", requestRef.key);
            await set(requestRef, {
                username,
                email,
                requestDate: new Date().toISOString(),
                requestText,
                status: "active",
            });
            console.log("Assistance request submitted successfully");

            const notificationData = {
                type: "assistance_request",
                userId: auth.currentUser.uid,
                userEmail: email,
                requestText,
                timestamp: new Date(),
                isRead: false,
            };
            const notificationRef = doc(collection(firestore, "notifications"), `${auth.currentUser.uid}_assistance_request`);

            await setDoc(notificationRef, notificationData);
            console.log("Notification submitted to Firestore");
            
            alert("Request submitted successfully!");
            navigate("/ModeratorDashboard");
        } catch (error) {
            console.error("Error submitting request:", error);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="request-assistance-heading">Request Assistance</h1>
            
            <form className="request-assistance-container" onSubmit={handleSubmit}>
                <label>Please write the request</label>
                <textarea
                    className="request-textarea"
                    placeholder="Write your request here"
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    required
                ></textarea>
                <button className="request-button" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RequestAssistance;
