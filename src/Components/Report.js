import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import "../Style.css";

const ReportPage = () => {
    const [reports, setReports] = useState([]);

  
    useEffect(() => {
        const reportsRef = collection(firestore, "reports");

        const unsubscribe = onSnapshot(reportsRef, (snapshot) => {
            const reportsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="report-page">
            <h1>Reported Content</h1>
            <div className="reports-list">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <div key={report.id} className="report-item">
                            <h2>Report ID: {report.id}</h2>
                            <p><strong>Content ID:</strong> {report.eventId}</p>
                            <p><strong>Reported by:</strong> {report.userName} ({report.userId})</p>
                            <p><strong>Report Reason:</strong> {report.reason}</p>
                            <p><strong>Date:</strong> {new Date(report.timestamp.toDate()).toLocaleString()}</p>
                            <button>View Content</button>
                            <button>Verify Report</button>
                        </div>
                    ))
                ) : (
                    <p>No reports available.</p>
                )}
            </div>
        </div>
    );
};

export default ReportPage;