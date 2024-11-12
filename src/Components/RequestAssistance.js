import React, { useEffect, useState } from "react";
import "./ModeratorDashboard.css";
import Header from "./Header";
import { database } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import { Navigate, useNavigate } from "react-router-dom";

const RequestAssistance = () => {

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/moderator-dashboard");
    };

    return (
        <div>
            <Header />
            <h1>Request Assistance</h1>
            <form className="request-assistance-container" onSubmit={handleSubmit}>
                <label>Please write the request</label>
                <textarea placeholder="Write your request here"></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RequestAssistance;
