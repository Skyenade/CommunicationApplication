import React from 'react';
import '../Style.css';
import Header from './Header';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {

    return (
        <div className='container'>
            <Header

            />
            <h1 className="Forgot-Password"  >Forgot Password</h1>
            <form className="Forgot-Password" >
                <input className="enter-mail" name="email" type="email" placeholder="Enter your email" required /><br></br><br></br>
                <button type="submit">Reset</button>
            </form>


        </div>

    );
}

export default ForgotPassword

