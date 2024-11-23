import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, update, get,set } from "firebase/database";
import Header from "./Header";
import "./ContentManagement.css";
import { Navigate, useNavigate } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import { deleteDoc } from "firebase/firestore";

const ContentManagement = () => {
  const [reports, setReports] = useState([]);
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdditionalData = async (report) => {
      const updatedReport = { ...report };

      if (report.eventId) {
        try {
          const eventDoc = await getDoc(doc(firestore, "events", report.eventId));
          if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            updatedReport.eventCreator = eventData.createdBy || "Unknown";
            console.log(updatedReport.eventCreator);
          }
        } catch {
          console.error(`Failed to fetch event creator for eventId: ${report.eventId}`);
        }
      }

      updatedReport.reporterEmail = report.email || "Unknown";

      return updatedReport;
    };

    const reportsQuery = query(
      collection(firestore, "reports"),
      where("status", "==", "flagged")
    );

    const unsubscribe = onSnapshot(reportsQuery, async (querySnapshot) => {
      const reportsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const report = { id: doc.id, ...doc.data() };
          return await fetchAdditionalData(report);
        })
      );
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSuspendAccount = async (reportId, userId) => {
    if (!window.confirm("Are you sure you want to suspend this user?")) return;

    try {
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        window.alert("User does not exist.");
        return;
      }

      const userData = userSnapshot.val();
      if (userData.status === "suspended") {
        const suspensionDate = userData.suspensionDate
          ? new Date(userData.suspensionDate).toLocaleString()
          : "an unspecified date";
        window.alert(`User account is already suspended since ${suspensionDate}.`);
        return;
      }

      await update(userRef, {
        status: "suspended",
        suspensionDate: new Date().toISOString(),
      });

      await updateDoc(doc(firestore, "reports", reportId), { status: "account_suspended" });
      window.alert("User account suspended.");
    } catch (error) {
      window.alert("account suspended successfully.");
    }
  };

  const handleWarning = async (reportId, userId, currentWarningStatus) => {
    if (window.confirm(currentWarningStatus ? "Remove warning from this user?" : "Issue a warning to this user?")) {
      try {

        // Get the user's reference in Firebase Realtime Database
        const userRef = ref(db, `users/${userId}`);
  
        // Fetch the user's data from Firebase Realtime Database
        const userSnapshot = await get(userRef);
  
        if (!userSnapshot.exists()) {
          window.alert("User does not exist.");
          return;
        }
  
        // If the warning doesn't exist in the user's data, initialize it
        const userData = userSnapshot.val();
        const warningStatus = userData.warning === true ? false : true; // Toggle the warning status
  
        // Update the user's warning status in Firebase Realtime Database
        await update(userRef, {
          warning: warningStatus,  // Set the warning status to true or false
        });
  
        // Also update the user's warning status in Firestore
        const userDocRef = doc(firestore, "users", userId);  // Reference the user in Firestore
        await updateDoc(userDocRef, {
          warning: warningStatus,  // Set the warning status in Firestore
        });
  
        // Update the report's status in Firestore (optional)
        // await updateDoc(doc(firestore, "reports", reportId), {
        //   status: warningStatus ? "warning_issued" : "flagged",  // Update the report's status accordingly
        // });
        console.log(`User ID: ${userId}, Current Warning Status: ${currentWarningStatus}`);

        window.alert(warningStatus ? "Warning issued to the user." : "Warning removed from the user.");
      } catch (error) {
        console.error("Error handling warning:", error);
        window.alert("Failed to issue or remove warning. Please try again.");
      }
    }
  };
  
  
  
  

  const handleDismissReport = async (reportId) => {
    if (window.confirm("Are you sure you want to dismiss and delete this report?")) {
      try {
        const reportRef = doc(firestore, "reports", reportId);
  
        await deleteDoc(reportRef);
        
        window.alert("Report dismissed and deleted.");
      } catch (error) {
        console.error("Error dismissing the report:", error);
        window.alert("Failed to dismiss and delete report. Please try again.");
      }
    }
  };

  const handleRemoveUser = async (reportId, userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        window.alert("User does not exist.");
        return;
      }

      await update(userRef, { status: "removed" });
      await updateDoc(doc(firestore, "reports", reportId), { status: "user_removed" });
      window.alert("User removed.");
    } catch {
      window.alert("Failed to remove user. Please try again.");
    }
  };

  

  return (
    <div>
      <HeaderAdmin />
      <div className="create-event">
        <div className="content">
          <h1>Content Management</h1>
          
          <h2 className="table">Flagged Posts and Content</h2>
          {reports.length > 0 ? (
            <table className="flaggedPostsTable">
              <thead>
                <tr>
                  <th>Created the event</th>
                  <th>Email that reported</th>
                  <th>Event ID</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th id="action">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.eventCreator}</td>
                    <td>{report.reporterEmail}</td>
                    <td>{report.eventId}</td>
                    <td>{report.reason}</td>
                    <td>{report.status}</td>
                    <td>{new Date(report.timestamp.seconds * 1000).toLocaleString()}</td>
                    <td>
                      <button
                        className="actionButton"
                        id="Suspend"
                        onClick={() => handleSuspendAccount(report.id, report.userId)}
                      >
                        Suspend Account
                      </button>
                      <button
                        className="actionButton"
                        id="Warning"
                        onClick={() =>
                          handleWarning(report.id, report.userId, report.status === "warning_issued")
                        }
                      >
                        {report.status === "warning_issued" ? "Remove Warning" : "Issue Warning"}
                      </button>
                      <button
                        className="actionButton"
                        id="Dismiss"
                        onClick={() => handleDismissReport(report.id)}
                      >
                        Dismiss Report
                      </button>
                      <button
                        className="actionButton"
                        id="Remove"
                        onClick={() => handleRemoveUser(report.id, report.userId)}
                      >
                        Remove User
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
    </div>
  );
};

export default ContentManagement;