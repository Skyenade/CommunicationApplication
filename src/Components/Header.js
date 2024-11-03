import React, { useEffect, useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const Header = ({ handleSignOut, isSignedIn, userEmail }) => {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const determineUserType = async () => {
    //         if (!userEmail) return;

    //         try {
    //             if (userEmail === 'admin@gmail.com') {
    //                 setUserType('admin');
    //                 return;
    //             }

    //             const moderatorsSnapshot = await get(ref(database, 'moderator'));
    //             if (moderatorSnapshot.exists()) {
    //                 const moderator = Object.keys(moderatorsSnapshot.val());
    //                 if (moderator.includes(userEmail)) {
    //                     setUserType('moderator');
    //                     return;
    //                 }
    //             }

    //             const usersSnapshot = await get(ref(database, 'users'));
    //             if (usersSnapshot.exists()) {
    //                 const users = Object.values(usersSnapshot.val());
    //                 const user = users.find(user => user.email === userEmail);
    //                 if (user) {
    //                     setUserType('client');
    //                     return;
    //                 }
    //             }

    //             setUserType(null); 
    //         } catch (error) {
    //             console.error('Error determining user type:', error.message);
    //             setUserType(null);
    //         }
    //     };

    //     determineUserType();
    // }, [userEmail]);

    // const handleHome = () => {
    //     if (!isSignedIn) {
    //         navigate("/");
    //     } else if (userType === 'admin') {
    //         navigate("/homeadmin");
    //     } else if (userType === 'moderator') {
    //         navigate("/homemoderator");
    //     } else if (userType === 'client') {
    //         navigate("/homeuser");
    //     } else {
    //         navigate("/");
    //     }
    // };

    return (
        <div className="header-container">
            <h1 className='home-heading'>EventUp</h1>

            <div className="nav-links">
                <a className='nav-item' onClick={() => navigate("/services")}>Events Feed</a>
                <a className='nav-item' onClick={() => navigate("/aboutus")}>My Events</a>
                <a className='nav-item' onClick={() => navigate("/contact")}>My Followers</a>
            </div>

            <div className="auth-buttons">
                <button onClick={handleSignOut} className="btnSignIn">Sign Out</button>
            </div>
        </div>
    );
};

export default Header;
