import React, { useState } from "react";
import './CreateUser.css';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import HeaderAdmin from "./HeaderAdmin";

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });

      setMessage("User created successfully!");
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Failed to create user: " + error.message);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="createUser">
        <h1>Create New User</h1>
        <form onSubmit={handleCreateUser}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Create User</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>

  );
};

export default CreateUser;