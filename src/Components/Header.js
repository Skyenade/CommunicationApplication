import React, { useEffect, useState } from "react";
import '../Style.css';
import { Link, useNavigate } from "react-router-dom";
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const Header = ({ handleSignOut, isSignedIn, userEmail }) => {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    

    

    return (
        <div className="header-container">
            <h1 className='home-heading'>EventUp</h1>

            <div className="nav-links">
            {/* <a className='nav-item' >My Events</a>
            <a className='nav-item' >My Followers</a>                            */}
                {/* <a className='nav-item' onClick={() => navigate("/EventFeed")}>My Events</a>
                <a className='nav-item' onClick={() => navigate("/Followers")}>My Followers</a> */}
                <a className='nav-item' onClick={() => navigate("/HomeUser")}>Events Feed</a>
                <a className='nav-item' >My Events</a>
                <a className='nav-item' >My Followers</a>
            </div>

            <div className="auth-buttons">
                <button className="btn-user-profile" onClick={() => navigate("/UserProfile")}>User Profile</button>
                <button onClick={handleSignOut} className="btnSignOut">Sign Out</button>
            </div>
        </div>
    );
};

export default Header;
