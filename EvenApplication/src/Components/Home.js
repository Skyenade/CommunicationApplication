import React from 'react';
import '../Style.css';
import myImage from '../Images/home-page-image.jpeg';

const Home = () => {
    return (
        <div className="container">

            <div className="home-container">
                <h1 className='home-heading'>EventUp</h1>
                <p>Create and find awesome events to attend with your friends</p>
                <img className="home-image" src={myImage} alt="event logo" />
            </div>

            <div className="home-form">
                <input className='home-input' type="email" placeholder="Email" />
                <input className='home-input' type="password" placeholder="Password" />
                <button className='home-login-button'>Log in</button>
                <span className='home-forgot-password'>Forgot Password?</span>
                <button className='home-create-account-button'>Create new account</button>
            </div>

        </div>
    );
};

export default Home;
