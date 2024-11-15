import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { getDatabase, ref, update, get } from "firebase/database"; // Added imports for Realtime Database
import "../Style.css";

const ModeratorDashboard = () => {
  const [reports, setReports] = useState([]);
  const db = getDatabase(); // Firebase Realtime Database instance

  useEffect(() => {
    // Fetch all reports with "flagged" status from Firestore
    const reportsRef = collection(firestore, "reports");
    const reportsQuery = query(reportsRef, where("status", "==", "flagged"));
    const unsubscribe = onSnapshot(reportsQuery, (querySnapshot) => {
      const reportData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportData);
    });

    return () => unsubscribe();
  }, []);

  // Handle suspending user account from Realtime Database and updating Firestore
  const handleSuspendAccount = async (reportId, userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      try {
        console.log(`Attempting to suspend account for user: ${userId} with report ID: ${reportId}`);

        // Get a reference to the user in the Realtime Database
        const userRef = ref(db, `users/${userId}`);

        // Check if the user exists
        const userSnapshot = await get(userRef);
        if (!userSnapshot.exists()) {
          console.error("User does not exist in the database.");
          window.alert("User does not exist.");
          return;
        }

        // Update the user's status to "suspended" in Realtime Database
        const suspensionDate = new Date().toISOString(); // Store the suspension date
        await update(userRef, { status: "suspended", suspensionDate });

        console.log(`User ${userId} suspended successfully.`);

        // Update the report status in Firestore
        const reportRef = doc(firestore, "reports", reportId);
        await updateDoc(reportRef, { status: "account_suspended" });

        console.log(`Report ${reportId} marked as "account_suspended".`);
        window.alert("User account suspended.");
      } catch (error) {
        console.error("Error suspending account:", error);
        window.alert("Failed to suspend account. Please try again.");
      }
    }
  };

  // Handle issuing a warning to the user
  const handleWarning = async (reportId) => {
    if (window.confirm("Are you sure you want to issue a warning to this user?")) {
      try {
        // Update the report status in Firestore to "warning_issued"
        const reportRef = doc(firestore, "reports", reportId);
        await updateDoc(reportRef, { status: "warning_issued" });

        console.log(`Report ${reportId} marked as "warning_issued".`);
        window.alert("Warning issued to the user.");
      } catch (error) {
        console.error("Error issuing warning:", error);
        window.alert("Failed to issue warning. Please try again.");
      }
    }
  };

  // Handle dismissing a report
  const handleDismissReport = async (reportId) => {
    if (window.confirm("Are you sure you want to dismiss this report?")) {
      try {
        // Update the report status in Firestore to "dismissed"
        const reportRef = doc(firestore, "reports", reportId);
        await updateDoc(reportRef, { status: "dismissed" });

        console.log(`Report ${reportId} dismissed.`);
        window.alert("Report dismissed.");
      } catch (error) {
        console.error("Error dismissing report:", error);
        window.alert("Failed to dismiss report. Please try again.");
      }
    }
  };

  // Handle removing a user
  const handleRemoveUser = async (reportId, userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        // Get a reference to the user in the Realtime Database
        const userRef = ref(db, `users/${userId}`);

        // Check if the user exists
        const userSnapshot = await get(userRef);
        if (!userSnapshot.exists()) {
          console.error("User does not exist in the database.");
          window.alert("User does not exist.");
          return;
        }

        // Update the user's status to "removed" in Realtime Database
        await update(userRef, { status: "removed" });

        console.log(`User ${userId} removed successfully.`);

        // Update the report status in Firestore
        const reportRef = doc(firestore, "reports", reportId);
        await updateDoc(reportRef, { status: "user_removed" });

        console.log(`Report ${reportId} marked as "user_removed".`);
        window.alert("User removed.");
      } catch (error) {
        console.error("Error removing user:", error);
        window.alert("Failed to remove user. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Moderator Dashboard</h1>
      <div className="reports-container">
        <h3>Flagged Reports</h3>
        {reports.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Reported By</th>
                <th>Email</th>
                <th>Event ID</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.userName}</td>
                  <td>{report.email}</td>
                  <td>{report.eventId}</td>
                  <td>{report.reason}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.timestamp.seconds * 1000).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleSuspendAccount(report.id, report.userId)}>
                      Suspend Account
                    </button>
                    <button onClick={() => handleWarning(report.id)}>
                      Warning
                    </button>
                    <button onClick={() => handleDismissReport(report.id)}>
                      Dismiss Report
                    </button>
                    <button onClick={() => handleRemoveUser(report.id, report.userId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No flagged reports at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;
