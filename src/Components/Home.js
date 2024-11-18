import React, { useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import myImage from '../Images/home-page-image.jpeg';
import { auth, database } from '../firebase';
import { ref, get, child } from "firebase/database";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUserContext } from '../UserContext';

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { setUserUid, setUserEmail } = useUserContext();  

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const emailOfUser = userCredential.user.email;

            setUserUid(userCredential.user.uid);
            setUserEmail(userCredential.user.email);

            if (emailOfUser === "admin@gmail.com" && password === "admin1234") {
                navigate('/AdminHome');
            } else {
                const dbRef = ref(database);
                const snapshot = await get(child(dbRef, `users/${userCredential.user.uid}`));

                if (snapshot.exists()) {
                    const userData = snapshot.val();

                    if (userData.status === 'suspended') {
                        setError("Your account is suspended.");
                        return;
                    } else if (userData.status === 'deleted') {
                        setError("Your account has been deleted.");
                        return;
                    } else if (userData.status !== 'active') {
                        setError("Your account is not active.");
                        return;
                    }

                    if (userData.accountType === "Moderator") {
                        navigate('/ModeratorHome');
                    } else {
                        navigate('/homeUser');
                    }
                } else {
                    setError("No user data found");
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="main-container">
            <div className="home-container">
                <h1 className='home-heading'>EventUp</h1>
                <p>Create and find awesome events to attend with your friends</p>
                <img className="home-image" src={myImage} alt="event logo" />
            </div>
            <form className="home-form" onSubmit={handleLogIn}>
                <input
                    className='home-input'
                    type="email"
                    required
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='home-input'
                    type="password"
                    required
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='home-login-button'>Log in</button>
                <span
                    className='home-forgot-password'
                    onClick={() => navigate("/ForgotPassword")}>
                    Forgot Password?
                </span>
                <button
                    className='home-create-account-button'
                    onClick={() => navigate("/SignupUser")}
                    type="button">
                    Create new account
                </button>

                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default Home;
