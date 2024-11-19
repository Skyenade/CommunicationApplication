import React, { useEffect, useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const HeaderAdmin = () => {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="header-container">
            <h1 className='home-heading'>EventUp</h1>

            <div className="nav-links">
                <a className='nav-item' onClick={() => navigate("/AdminHome")}>Home</a>

            </div>
            <label><strong>Admin Account</strong></label>


            <div className="auth-buttons">
                <button onClick={() => navigate("/Login")} className="btnSignOut">Sign Out</button>


            </div>
        </div>
    );
};

export default HeaderAdmin;

