import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../UserContext';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import "../Style.css";

const HeaderModerator = ({ handleSignOut }) => {
    const { userEmail, userUid } = useUserContext();
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserType = async () => {
            if (userUid) {
                try {
                    const snapshot = await get(ref(database, `users/${userUid}`));
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setUserType(userData.accountType);
                    } else {
                        console.warn("No user data found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserType();
    }, [userUid]);

    const handleHomeNavigation = () => {
        if (!userType) {
            console.warn("User type not yet loaded");
            return;
        }
        if (userType === "Moderator") {
            navigate("/ModeratorHome");
        } else if (userType === "User") {
            navigate("/HomeUser");
        } else {
            console.warn("User type is not valid, no navigation");
        }
    };

    // const handleHomeNavigation = () => {
    //     navigate("/ModeratorHome");
    // }

    return (
        <div className="header-container">
            <h1 className="home-heading">EventUp</h1>

            <div className="nav-links">
                <button className="nav-item"     onClick={() => {
        console.log("Navigating to ModeratorHome");
        navigate("/ModeratorHome");
    }}
>Home</button>

                <button className="nav-item" onClick={() => navigate("/MyEvents")}>My Events</button>
                <button className="nav-item" onClick={() => navigate("/MyFollowers")}>My Followers</button>
            </div>

            <div className="auth-buttons">
                <button
                    id="userprofile-button"
                    className="btn-user-profile"
                    onClick={() => navigate("/UserProfile")}
                >
                    User Profile
                </button>
                <button onClick={() => navigate("/")} className="btnSignOut">Sign Out</button>
            </div>
        </div>
    );
};

export default HeaderModerator;
