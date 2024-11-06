import React, { useEffect, useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import myImage from '../Images/home-page-image.jpeg';


const Home = ({ handleSignOut, isSignedIn, userEmail }) => {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        console.log(email, password);
    }

 
    return (
        <div className="header-container">
            <h1 className='home-heading'>EventUp</h1>

            <div className="nav-links">
                <a className='nav-item' onClick={() => navigate("/EventFeed")}>Events Feed</a>
                <a className='nav-item' onClick={() => navigate("/aboutus")}>My Events</a>
                <a className='nav-item' onClick={() => navigate("/contact")}>My Followers</a>
            </div>

            <div className="auth-buttons">
                <button className="btn-user-profile">User Profile</button>
                <button onClick={handleSignOut} className="btnSignOut">Sign Out</button>
            </div>
            {/* <form className="home-form" onSubmit={handleSignin}>
                <input className='home-input' type="email" placeholder="Email" />
                <input className='home-input' type="password" placeholder="Password" />
                <button className='home-login-button'>Log in</button>
                <span className='home-forgot-password'>Forgot Password?</span>
                <button className='home-create-account-button' onClick={() => navigate("/SignUpUser")}>Create new account</button>
            </form> */}


        {/* <div className="main-container">
            <div className="home-container">
                <h1 className='home-heading'>EventUp</h1>
                <p>Create and find awesome events to attend with your friends</p>
                <img className="home-image" src={myImage} alt="event logo" />
            </div>
            <form className="home-form" onSubmit={handleSignin}>
                <input className='home-input' type="email" placeholder="Email" />
                <input className='home-input' type="password" placeholder="Password" />
                <button className='home-login-button'>Log in</button>
                <span className='home-forgot-password' onClick={() => navigate("/reset")}>Forgot Password?</span>
                <button className='home-create-account-button' onClick={() => navigate("/SignupUser")}>Create new account</button>
            </form> */}
        </div>
    );
};

export default Home;