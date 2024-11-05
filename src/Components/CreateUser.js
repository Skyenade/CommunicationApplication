import React, { useState } from "react";
import '../Style.css';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateUser = (e) => {
    e.preventDefault();
    setMessage("User created successfully!");
    setEmail('');
    setPassword('');
  };

  return (
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
  );
};

export default CreateUser;