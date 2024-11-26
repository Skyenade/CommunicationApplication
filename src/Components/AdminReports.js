import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { getDatabase, ref, get } from "firebase/database";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import HeaderAdmin from "./HeaderAdmin";


const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsCollection = collection(firestore, "reports");
                const querySnapshot = await getDocs(reportsCollection);

                if (querySnapshot.empty) {
                    console.log("No reports found.");
                    setReports([]);
                    setLoading(false);
                    return;
                }

                const reportsList = await Promise.all(
                    querySnapshot.docs.map(async (docSnapshot) => {
                        const reportData = docSnapshot.data();
                        const reportDetails = { id: docSnapshot.id, ...reportData };

                        if (reportData.reportedBy) {
                            try {
                                const database = getDatabase();
                                const reporterRef = ref(database, `users/${reportData.reportedBy}`);
                                const reporterSnapshot = await get(reporterRef);

                                if (reporterSnapshot.exists()) {
                                    const reporterData = reporterSnapshot.val();
                                    reportDetails.reporterUsername = reporterData.username || "No username available";
                                } else {
                                    reportDetails.reporterUsername = "Unknown User";
                                }
                            } catch (error) {
                                console.error("Error fetching reporter username from Realtime DB:", error);
                                reportDetails.reporterUsername = "Unknown User";
                            }
                        }

                        if (reportData.reportedBy) {
                            try {
                                const userDocRef = doc(firestore, "users", reportData.reportedBy);
                                const userSnapshot = await getDoc(userDocRef);

                                if (userSnapshot.exists()) {
                                    const userData = userSnapshot.data();
                                    reportDetails.reporterEmail = userData.email || "No email available";
                                } else {
                                    reportDetails.reporterEmail = "Unknown Email";
                                }
                            } catch (error) {
                                console.error("Error fetching reporter email from Firestore:", error);
                                reportDetails.reporterEmail = "Unknown Email";
                            }
                        }

                        if (reportData.contentId && reportData.type) {
                            try {
                                const contentCollection =
                                    reportData.type === "event"
                                        ? "events"
                                        : reportData.type === "comment"
                                        ? "comments"
                                        : null;

                                if (contentCollection) {
                                    const contentDocRef = doc(firestore, contentCollection, reportData.contentId);
                                    const contentSnapshot = await getDoc(contentDocRef);

                                    if (contentSnapshot.exists()) {
                                        const contentData = contentSnapshot.data();
                                        reportDetails.contentDetails = contentData.text || "No content details available";
                                    } else {
                                        reportDetails.contentDetails = "Content not found";
                                    }
                                } else {
                                    reportDetails.contentDetails = "Invalid content type";
                                }
                            } catch (error) {
                                console.error("Error fetching content details:", error);
                                reportDetails.contentDetails = "Error fetching content";
                            }
                        } else {
                            reportDetails.contentDetails = "No content ID or type provided";
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
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Content ID</th>
                                <th>Content Details</th>
                                <th>Reported By</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Reported On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td>{report.type || "Unknown"}</td>
                                    <td>{report.contentId || "N/A"}</td>
                                    <td>{report.contentDetails || "Not available"}</td>
                                    <td>
                                        {report.reporterUsername || "Unknown"} (
                                        {report.reporterEmail || "Unknown"})
                                    </td>
                                    <td>{report.reportReason || "No reason provided"}</td>
                                    <td>{report.status || "Unknown"}</td>
                                    <td>
                                        {report.timestamp
                                            ? new Date(report.timestamp.seconds * 1000).toLocaleString()
                                            : "No timestamp available"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No reports available</p>
                )}
            </div>
        </div>
    );
};

export default AdminReports;