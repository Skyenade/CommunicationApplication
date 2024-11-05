import React from 'react';
import '../Style.css';
import Header from "../Components/Header";


const Login = () => {

    const handleLogIn = async (e) => {
        e.preventDefault();
        
        const email = e.target[0].value;
        const password = e.target[1].value;
        console.log( email, password);


        return (
            <div>
                <div className="form-login">
                    <h1 className="signin-title">Sign In</h1>
                    <form className="logIn-form" onSubmit={handleLogIn}>
                        <label>Email:</label>
                        <input
                            type="email"
                            id="signinEmail"
                            className='input-client-form'
                            required
                            // value={email}
                            // onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Password:</label>
                        <input
                            type="password"
                            id="signinPassword"
                            className='input-user-form'
                            required
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* <p className="Password" onClick={handleReset} >Forgot password?</p> */}

                        <button type="submit">Login</button><br /><br />
                    </form>
                    <p className="Sign-up-here">You don't have an account? Sign up here</p>
                    {/* <button onClick={() => navigate("/SignupUser")} type="submit">Sign Up</button> */}
                </div>
            </div>
        )
    }
};

export default Login;