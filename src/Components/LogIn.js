
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../Components/Header";
// import { auth, database } from '../firebase';
// import { ref, get, child } from "firebase/database";
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import myImage from '../Images/home-page-image.jpeg';



// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();
//     const [error, setError] = useState(null);

//     const handleLogIn = async (e) => {
//         e.preventDefault();
//         try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const emailOfUser = userCredential.user.email;

            

//             if (emailOfUser === "admin@gmail.com" && password === "admin1234") {
//                 navigate('/AdminHome', { state: { email: emailOfUser } });
//             } else {
                
//                 const dbRef = ref(database);
//                 const snapshot = await get(child(dbRef, `users/${userCredential.user.uid}`));

//             if (snapshot.exists()) {
//                 const userData = snapshot.val();
//                 // if (userData.accountType === "admin@gmail.com") {
//                 //     navigate('/AdminHome', { state: { email: emailOfUser } });
//              if (userData.accountType === "Moderator") {
//                     navigate('/ModeraterHome', { state: { email: emailOfUser } });
//                 } else {
//                     navigate('/homeUser', { state: { email: emailOfUser } });
//                 }
//             } else {
//                 console.log("No user data found");
//             }}
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     return (
//         <div className="sign-up-pages">
//             {/* <Header /> */}
//             <div className="form-login">
//                 <h1 className="signin-title">Login In</h1>
//                 <form className="logIn-form" onSubmit={handleLogIn}>
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         id="signinEmail"
//                         required
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />

//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         id="signinPassword"
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />

//                         <br /><br />
//                     <button type="submit">Login</button><br /><br />
//                     <button type="submit" onClick={() => navigate("/ForgotPassword")}>Forgot password</button>
//                     <p className='home-create-account-button2' >Don't have an account!</p>
//                     <button type="submit" onClick={() => navigate("/SignUpUser")}>Sign Up here</button><br /><br />
//                 </form>
//                 {error && <p className="error-message">{error}</p>}

//             </div>
//         </div>
//     );
// };

// export default Login;