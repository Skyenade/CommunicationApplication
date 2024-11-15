import React, { useEffect, useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const Header = ({ handleSignOut, isSignedIn, userEmail }) => {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserType = async () => {
            if (userEmail) {
                try {
                    const snapshot = await get(ref(database, `users/${userEmail.replace('.', '_')}`));
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
    }, [userEmail]);

    const handleHomeNavigation = () => {
        if (userType === "moderator") {
            navigate("/ModeratorHome");
        } else {
            navigate("/HomeUser");
        }
    };

    const handleFollowersNavigation = () => {
        if (userType === "moderator") {
            navigate("/ModeratorHome?showFollowers=true");
        } else {
            navigate("/HomeUser?showFollowers=true");
        }
    };
    return (
        <div className="header-container">
            <h1 className="home-heading">EventUp</h1>

            <div className="nav-links">
                <a className="nav-item" onClick={handleHomeNavigation}>Home</a>
                <a className="nav-item">My Events</a>
                <a className="nav-item" onClick={handleFollowersNavigation}>My Followers</a>
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
