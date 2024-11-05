import React, { useState } from "react";
import '../Style.css';
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = ({ userEmail, isSignedIn, setUserEmail, setIsSignedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Login function
    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const emailOfUser = userCredential.user.email;
            setUserEmail(emailOfUser);

            if (emailOfUser === "admin@gmail.com") {
                navigate('/homeadmin', { state: { email: emailOfUser } });
            } else if (emailOfUser === "moderator@gmail.com") {
                navigate('/ModeratorHome', { state: { email: emailOfUser } });
            } else {
                navigate('/homeuser', { state: { email: emailOfUser } });
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Registration function
    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUserEmail(userCredential.user.email);
            setIsSignedIn(true);
            navigate('/homeuser', { state: { email: userCredential.user.email } });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleReset = () => {
        navigate('/reset');
    };

    return (
        <div className="sign-up-pages">
            <Header />
            <div className="form-login">
                <h1 className="signin-title">Sign In</h1>
                <form className="logIn-form" onSubmit={handleLogIn}>
                    <label>Email:</label>
                    <input
                        type="email"
                        id="signinEmail"
                        className='input-client-form'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        id="signinPassword"
                        className='input-user-form'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <p className="Password" onClick={handleReset}>Forgot password?</p>

                    <button type="submit">Login</button><br /><br />
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="Sign-up-here">You don't have an account? Sign up here</p>
                <button onClick={registerUser} type="button">Sign Up</button>
            </div>
        </div>
    );
}

export default Login;
