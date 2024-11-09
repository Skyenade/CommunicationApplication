import React from 'react';
import '../Style.css';
import Header from './Header';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from "react-router-dom";

const SignUpUser = () => {

    const handleSignUpUser = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[0].value;
        const password = e.target[1].value;
        console.log(username, email, password);

        return (
            <div >


                <h2> Crate your account</h2>
                <form className="user-form" onSubmit={handleSignUpUser}>
                    <label>Username</label>
                    <input
                        type="text"
                        id="username"
                        className='input-User-form'
                        required
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        id="uEmail"
                        className='input-User-form'
                        required

                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        id="uPassword"
                        className='input-User-form'
                        required
                    />
                    <button type='submit'>SignUp</button>

                </form>
                <p className="Sign-up-here">Already have an account?</p>


            </div>


        )
    }
};

export default SignUpUser