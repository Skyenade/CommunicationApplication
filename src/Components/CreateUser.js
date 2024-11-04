import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            //  the user with email and password in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //  the user profile in Firebase Realtime Database
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                displayName: displayName,
                role: 'standard_user', //role, can be changed 
                createdAt: new Date()
            });

            setSuccess(`User ${displayName} created successfully!`);
            setEmail('');
            setPassword('');
            setDisplayName('');
        } catch (err) {
            setError(`Failed to create user: ${err.message}`);
        }
    };

    return (
        <div>
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Display Name:</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                <button type="submit">Create User</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default CreateUser;