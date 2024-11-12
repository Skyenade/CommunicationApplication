import React, { useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import myImage from '../Images/home-page-image.jpeg';
import { auth, database } from '../firebase';
import { ref, get, child } from "firebase/database";
import { signInWithEmailAndPassword } from 'firebase/auth';

const Home = () => {
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

                const snapshot = await get(child(dbRef, `users`));
                
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    let userData = null;

                    for (const username in users) {
                        if (users[username].email === emailOfUser) {
                            userData = users[username];
                            break;
                        }
                    }

                    if (userData) {
                        if (userData.accountType === "Moderator") {
                            navigate('/ModeratorHome', { state: { email: emailOfUser } });
                        } else {
                            navigate('/homeUser', { state: { email: emailOfUser } });
                        }
                    } else {
                        console.log("No user data found");
                    }
                } else {
                    console.log("No users found in the database");
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
                <button className='home-login-button' type="submit">Log in</button>
                <span className='home-forgot-password' onClick={() => navigate("/ForgotPassword")}>Forgot Password?</span>
                <button className='home-create-account-button' onClick={() => navigate("/SignUpUser")} type="button">Create new account</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Home;
