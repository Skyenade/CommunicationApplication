import React from 'react';
import '../Style.css';
import Header from './Header';
import { auth, database } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;

        console.log("Email:", emailVal);
        try {
            await sendPasswordResetEmail(auth, emailVal);
            console.log("Email sent");
            alert("If you have an account, you will receive an email with instructions to change the password.");
            navigate('/');
        } catch (err) {
            console.log("Error:", err);
            alert(err.code);
        }
    };
    return (
        <div>
            <h1 className='home-heading' onClick={() => navigate("/")}>EventUp</h1>
            <div className='forgot-password-container'>

                <h1 className="Forgot-Password">Forgot Password</h1>
                <form onSubmit={handleSubmit} >
                    <input className="enter-mail" name="email" type="email" placeholder="Enter your email" required /><br></br><br></br>
                    <button className='forgot-button' type="submit">Reset</button>
                </form>

            </div>
        </div>

    );

}

export default ForgotPassword

