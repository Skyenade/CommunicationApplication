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
               
                const reportsCollection = collection(firestore, "reports");
                const querySnapshot = await getDocs(reportsCollection);

                const reportsList = await Promise.all(
                    querySnapshot.docs.map(async (docSnapshot) => {
                        const reportData = docSnapshot.data();
                        const reportDetails = { id: docSnapshot.id, ...reportData };

                       
                        if (reportData.reportedBy) {
                            const reporterDocRef = doc(firestore, "users", reportData.reportedBy);
                            const reporterSnapshot = await getDoc(reporterDocRef);
                            if (reporterSnapshot.exists()) {
                                const reporterData = reporterSnapshot.data();
                                reportDetails.reporterUsername = reporterData.username || "Unknown";
                                reportDetails.reporterEmail = reporterData.email || "Unknown";
                            } else {
                                reportDetails.reporterUsername = "Unknown User";
                                reportDetails.reporterEmail = "Unknown Email";
                            }
                        }

                        
                        if (reportData.contentId) {
                            const contentCollection = reportData.type === "post" ? "posts" : "comments";
                            const contentDocRef = doc(firestore, contentCollection, reportData.contentId);
                            const contentSnapshot = await getDoc(contentDocRef);
                            if (contentSnapshot.exists()) {
                                const contentData = contentSnapshot.data();
                                reportDetails.contentDetails = contentData.text || "No content available";
                            } else {
                                reportDetails.contentDetails = "Content not found";
                            }
                        }

                        return reportDetails;
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
                        {reports.map((report) => (
                            <li key={report.id} className="report-card">
                                <p>
                                    <strong>Type:</strong> {report.type || "Unknown"}
                                </p>
                                <p>
                                    <strong>Content ID:</strong> {report.contentId || "N/A"}
                                </p>
                                <p>
                                    <strong>Content Details:</strong> {report.contentDetails || "Not available"}
                                </p>
                                <p>
                                    <strong>Reported By:</strong> {report.reporterUsername || "Unknown"} (
                                    {report.reporterEmail || "Unknown"})
                                </p>
                                <p>
                                    <strong>Reason:</strong> {report.reportReason || "No reason provided"}
                                </p>
                                <p>
                                    <strong>Status:</strong> {report.status || "Unknown"}
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