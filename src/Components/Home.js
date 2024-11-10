import React, { useEffect, useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import myImage from '../Images/home-page-image.jpeg';
import { auth, database } from '../firebase';
import { ref, get, child } from "firebase/database";
import { signInWithEmailAndPassword } from 'firebase/auth';


const Home = ({ handleSignOut, isSignedIn, userEmail }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const emailOfUser = userCredential.user.email;

            

            if (emailOfUser === "admin@gmail.com" && password === "admin1234") {
                navigate('/AdminHome', { state: { email: emailOfUser } });
            } else {
                
                const dbRef = ref(database);
                const snapshot = await get(child(dbRef, `users/${userCredential.user.uid}`));

            if (snapshot.exists()) {
                const userData = snapshot.val();
                // if (userData.accountType === "admin@gmail.com") {
                //     navigate('/AdminHome', { state: { email: emailOfUser } });
             if (userData.accountType === "Moderator") {
                    navigate('/ModeratorHome', { state: { email: emailOfUser } });
                } else {
                    navigate('/homeUser', { state: { email: emailOfUser } });
                }
            } else {
                console.log("No user data found");
            }}
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        // <div className="header-container">
        //     <h1 className='home-heading'>EventUp</h1>

        //     <div className="nav-links">
        //         <a className='nav-item' onClick={() => navigate("/EventFeed")}>Events Feed</a>
        //         <a className='nav-item' onClick={() => navigate("/aboutus")}>My Events</a>
        //         <a className='nav-item' onClick={() => navigate("/contact")}>My Followers</a>
        //     </div>

        //     <div className="auth-buttons">
        //         <button className="btn-user-profile">User Profile</button>
        //         <button onClick={handleSignOut} className="btnSignOut">Sign Out</button>
        //     </div>
        //     {/* <form className="home-form" onSubmit={handleSignin}>
        //         <input className='home-input' type="email" placeholder="Email" />
        //         <input className='home-input' type="password" placeholder="Password" />
        //         <button className='home-login-button'>Log in</button>
        //         <span className='home-forgot-password'>Forgot Password?</span>
        //         <button className='home-create-account-button' onClick={() => navigate("/SignUpUser")}>Create new account</button>
        //     </form> */}
        // </div>


        <div className="main-container">
            <div className="home-container">
                <h1 className='home-heading'>EventUp</h1>
                <p>Create and find awesome events to attend with your friends</p>
                <img className="home-image" src={myImage} alt="event logo" />
            </div>
            <form className="home-form" onSubmit={handleLogIn}>
                <input className='home-input'
                        type="email"
                        required
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                <input className='home-input'
                        type="password"
                        required
                        value={password}
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                <button className='home-login-button'>Log in</button>
                <span className='home-forgot-password' onClick={() => navigate("/ForgotPassword")}>Forgot Password?</span>
                <button className='home-create-account-button' onClick={() => navigate("/SignupUser")} type="submit" >Create new account</button>
            </form>
        </div>

    );
};

export default Home;