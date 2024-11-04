import React, { useEffect, useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const HeaderAdmin = ({ handleSignOut, isSignedIn, userEmail }) => {

    const navigate = useNavigate();

    return (
        <div className="header-container">
            <h1 className='home-heading'>EventUp</h1>

            <div className="nav-links">
                <a className='nav-item' >Events Feed</a>
                <a className='nav-item' >My Events</a>
                <a className='nav-item' >My Followers</a>
            </div>

            <div className="auth-buttons">
                <button className="btn-user-profile">User Profile</button>
                <button onClick={handleSignOut} className="btnSignOut">Sign Out</button>
            </div>
        </div>
    );
};

export default HeaderAdmin;
