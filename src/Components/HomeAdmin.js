import React, { useState, useEffect } from 'react';
import '../Style.css';
import Header from './Header';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from "react-router-dom";


const HomeAdmin = ({ userEmail, isSignedIn, setUserEmail, setIsSignedIn }) => {
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);
    const navigate = useNavigate();


    const UserManagement = () => {
        navigate('/usermanagement');
    };

    const ContentManagement = () => {
        navigate('/ContentManagement');
    };

    const DatabaseManagement = () => {
        navigate('/DatabaseManagement');
    };

    const HistoryReportsUsers = () => {
        navigate('/HistoryReportsUsers');
    };
    const HistoryReportsComntent = () => {
        navigate('/HistoryReportsComntent');
    };


    const handleSignOut = () => {
        setUserEmail("");
        setIsSignedIn(false);
        navigate('/');
    };
    return (
        <div className='home-admin-page'>
            <Header
                userEmail={userEmail}
                handleSignOut={handleSignOut}
                isSignedIn={isSignedIn}
            />

            <h1 className="Admin-info">Admin Account </h1>

            <h2 className="Admin-info">Admin Dashboard </h2>

            <button className='user-management-button' onClick={UserManagement}> User Management</button>

            <button className='user-management-button' onClick={ContentManagement}> Content Management</button>

            <button className='user-management-button' onClick={DatabaseManagement}> Database Management</button>

            <button className='user-management-button' onClick={HistoryReportsUsers}> History of reported users</button>

            <button className='user-management-button' onClick={HistoryReportsComntent}>  History of reported content</button>
        </div>
    );

}

export default HomeAdmin;