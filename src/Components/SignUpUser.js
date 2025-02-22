import React, { useState } from 'react';
import '../Style.css';
import { useNavigate } from "react-router-dom";
import { ref, set } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpUser = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUpUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            await set(ref(database, `users/${userId}`), {
                email,
                username,
                status: 'active',
                accountType: 'User',
                followers: [],
                following: [],
                warning: false,
                likeCount: 0,
                followerCount: 0,
                followingCount: 0,
            });

            await setDoc(doc(firestore, "users", userId), {
                email,
                username,
                status: 'active',
                accountType: 'User',
                followers: [],
                following: [],
                warning: false,
                likeCount: 0,
                followerCount: 0,
            });

            setEmail(email);
            alert('Account created successfully!');
            navigate('/');
        } catch (error) {
            setError(error.message);
            console.error("Sign-up error:", error.message);
        }
    };
        return (
            <div >
                

                <h2> Crate your account</h2>
                <form className="home-form2" onSubmit={handleSignUpUser}>
                    <label>Username</label>
                    <input
                        className='home-input'
                        type="text"
                        id="username"
                       
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        
                    />
                    <label>Email</label>
                    <input 
                        className='home-input'
                        type="email"
                        id="uEmail"
                        
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />
                    <label>Password</label>
                    <input className='home-input'
                        type="password"
                        id="uPassword"
                        
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='home-create-account-button2' type='submit'>SignUp</button>

                    {error && <p className="error-message">{error}</p>}

                        <p className='home-create-account-button2' onClick={() => navigate("/")}>Already have an account?</p>

                </form>
                


            </div>
        

        );
    }


export default SignUpUser;