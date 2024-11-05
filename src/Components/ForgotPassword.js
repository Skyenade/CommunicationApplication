import React from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import '../Style.css';
import Header from './Header';




function ForgotPassword({ userEmail, isSignedIn, setUserEmail, setIsSignedIn }) {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;

        console.log("Email:", emailVal);
        try {
            await sendPasswordResetEmail(auth, emailVal);
            console.log("Email sent");
            alert("If you have an account, you will receive an email with instructions to change the password.");
            navigate('/logIn');
        } catch (err) {
            console.log("Error:", err);
            alert(err.code);
        }
    };

    const handleSignOut = () => {
        setUserEmail("");
        setIsSignedIn(false);
        navigate('/');
    };

    return (
        <div className='container'>
            <Header

            />
            <h1 className="Forgot-Password"  >Forgot Password</h1>
            <form className="Forgot-Password" onSubmit={handleSubmit}>
                <input className="enter-mail" name="email" type="email" placeholder="Enter your email" required /><br></br><br></br>
                <button type="submit">Reset</button>
            </form>



        </div>
    );
}

export default ForgotPassword;