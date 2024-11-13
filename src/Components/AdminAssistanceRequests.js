import React, { useEffect, useState } from "react";
import "../Style.css";
import HeaderAdmin from "./HeaderAdmin";
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";

const AdminAssistanceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const snapshot = await get(ref(database, "assistanceRequests"));
                if (snapshot.exists()) {
                    const requestsData = snapshot.val();
                    const activeRequests = Object.entries(requestsData)
                        .map(([id, request]) => ({ id, ...request }))
                        .filter((request) => request.status === "active");

                    setRequests(activeRequests);
                } else {
                    setRequests([]);
                }
            } catch (error) {
                console.error("Error fetching assistance requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await update(ref(database, `assistanceRequests/${id}`), { status });
            setRequests((prevRequests) =>
                prevRequests.filter((request) => request.id !== id)
            );
        } catch (error) {
            console.error("Error updating request status:", error);
        }
    };

    return (
        <div>
            <HeaderAdmin />
            <h1>Assistance Requests</h1>
            {loading ? (
                <p>Loading...</p>
            ) : requests.length === 0 ? (
                <p>No active requests</p>
            ) : (
                <div className="table-container">
                    <table className="requests-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Request Date</th>
                                <th>Request Text</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.username}</td>
                                    <td>{request.email}</td>
                                    <td>{new Date(request.requestDate).toLocaleString()}</td>
                                    <td>{request.requestText}</td>
                                    <td>
                                        <button
                                            className="solved-button" onClick={() => handleStatusUpdate(request.id, "solved")}
                                        >
                                            Mark as Solved
                                        </button>
                                        <button
                                            className="dismiss-button" onClick={() => handleStatusUpdate(request.id, "dismissed")}
                                        >
                                            Dismiss
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAssistanceRequests;
