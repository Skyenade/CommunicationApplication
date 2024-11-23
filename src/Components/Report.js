import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "../Style.css";

const Report = () => {
    const [reports, setReports] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [eventDetails, setEventDetails] = useState({});

    const fetchUserDetails = async (userId) => {
        if (!userId || userDetails[userId]) return;
        const userDoc = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            setUserDetails((prev) => ({
                ...prev,
                [userId]: userSnapshot.data(),
            }));
        }
    };

    const fetchEventDetails = async (eventId) => {
        if (!eventId || eventDetails[eventId]) return;
        const eventDoc = doc(firestore, "events", eventId);
        const eventSnapshot = await getDoc(eventDoc);
        if (eventSnapshot.exists()) {
            setEventDetails((prev) => ({
                ...prev,
                [eventId]: eventSnapshot.data(),
            }));
        }
    };

    useEffect(() => {
        const reportsRef = collection(firestore, "reports");

        const unsubscribe = onSnapshot(reportsRef, (snapshot) => {
            const reportsData = snapshot.docs.map((doc) => {
                const report = {
                    id: doc.id,
                    ...doc.data(),
                };

                fetchUserDetails(report.userId);
                fetchEventDetails(report.eventId);

                return report;
            });

            setReports(reportsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="report-page">
            <h1>Reported Content</h1>
            <div className="reports-list">
                {reports.length > 0 ? (
                    reports.map((report) => {
                        const reporter = userDetails[report.userId] || {};
                        const eventCreator = eventDetails[report.eventId]?.creator || {};
                        return (
                            <div key={report.id} className="report-item">
                                <h2>Report ID: {report.id}</h2>
                                <p>
                                    <strong>Content ID:</strong> {report.eventId}
                                </p>
                                <p>
                                    <strong>Reported by:</strong> {reporter.username} ({reporter.email})
                                </p>
                                <p>
                                    <strong>Event Creator:</strong> {eventCreator.username} ({eventCreator.email})
                                </p>
                                <p>
                                    <strong>Report Reason:</strong> {report.reason}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(report.timestamp.toDate()).toLocaleString()}
                                </p>
                                <button>View Content</button>
                                <button>Verify Report</button>
                            </div>
                        );
                    })
                ) : (
                    <p>No reports available.</p>
                )}
            </div>
        </div>
    );
};

export default Report;
