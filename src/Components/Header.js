import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../UserContext';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const Header = ({ handleSignOut }) => {
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
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserType();
    }, [userUid]);

    const handleHomeNavigation = () => {
        if (userType === "Moderator") {
            navigate("/ModeratorHome");
        } else if (userType === "User") {
            navigate("/HomeUser");
        } else {
            console.log("User type is not valid, no navigation");
        }
    };

    return (
        <div className="header-container">
            <h1 className="home-heading">EventUp</h1>

            <div className="nav-links">
                <a className="nav-item" onClick={handleHomeNavigation}>Home</a>
                <a className="nav-item" onClick={() => navigate("/MyEvents")}>My Events</a>
                <a className="nav-item">My Followers</a>
            </div>

            <div className="auth-buttons">
                <button
                    id="userprofile-button"
                    className="btn-user-profile"
                    onClick={() => navigate("/UserProfile")}
                >
                    User Profile
                </button>
                <button onClick={handleSignOut} className="btnSignOut">Sign Out</button>
            </div>
        </div>
    );
};

export default Header;
