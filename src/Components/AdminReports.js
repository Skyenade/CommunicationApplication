import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import HeaderAdmin from "./HeaderAdmin";
import "../Style.css";

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "reports"));
                const reportsList = await Promise.all(
                    querySnapshot.docs.map(async (docSnapshot) => {
                        const reportData = docSnapshot.data();

                        // gets username who is reporting
                        
                        if (reportData.userId) {
                            const reporterDocRef = doc(firestore, "users", reportData.userId);
                            const reporterSnapshot = await getDoc(reporterDocRef);
                            reportData.reporterUsername = reporterSnapshot.exists()
                                ? reporterSnapshot.data().username
                                : "Unknown Reporter";
                        } else {
                            reportData.reporterUsername = "Unknown Reporter";
                        }

                        return { id: docSnapshot.id, ...reportData };
                    })
                );
                setReports(reportsList);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div>
            <HeaderAdmin />
            <div className="admin-reports-container">
                <h1>Reported Events and Comments</h1>
                {loading ? (
                    <p>Loading reports...</p>
                ) : reports.length > 0 ? (
                    <ul>
                        {reports.map((report, index) => (
                            <li key={index} className="report-card">
                                <p>
                                    <strong>Event ID:</strong> {report.eventId || "N/A"}
                                </p>
                                <p>
                                    <strong>Reported By:</strong> {report.reporterUsername || "Unknown"}
                                </p>
                                <p>
                                    <strong>Reason:</strong> {report.reason || "No reason provided"}
                                </p>
                                <small>
                                    Reported on:{" "}
                                    {report.timestamp
                                        ? new Date(report.timestamp.seconds * 1000).toLocaleString()
                                        : "No timestamp available"}
                                </small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reports available</p>
                )}
            </div>
        </div>
    );
};

export default AdminReports;