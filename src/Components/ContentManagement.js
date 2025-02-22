import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { getDatabase, ref, update, get } from "firebase/database";
import "./ContentManagement.css";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";

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

  const handleSuspendAccount = async (reportId, eventCreatorEmail) => {
    if (!window.confirm("Are you sure you want to suspend this user?")) return;

    try {
      const usersQuery = query(
        collection(firestore, "users"),
        where("email", "==", eventCreatorEmail)
      );
      const userSnapshot = await getDocs(usersQuery);

      if (userSnapshot.empty) {
        window.alert("User not found.");
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;

      const userRef = ref(db, `users/${userId}`);
      const userSnapshotFromDb = await get(userRef);

      if (!userSnapshotFromDb.exists()) {
        window.alert("User does not exist in Realtime Database.");
        return;
      }

      const userData = userSnapshotFromDb.val();

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
      console.error("Error suspending account:", error);
      window.alert("Failed to suspend account. Please try again.");
    }
  };


  const handleWarning = async (reportId, currentWarningStatus, eventCreatorEmail) => {
    if (window.confirm("Issue a warning to this user?")) {
      try {
        const usersQuery = query(
          collection(firestore, "users"),
          where("email", "==", eventCreatorEmail)
        );
        const userSnapshot = await getDocs(usersQuery);

        if (userSnapshot.empty) {
          window.alert("User not found.");
          return;
        }


        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        const userRef = ref(db, `users/${userId}`);
        const userSnapshotFromDb = await get(userRef);

        if (!userSnapshotFromDb.exists()) {
          window.alert("User does not exist.");
          return;
        }


        const userData = userSnapshotFromDb.val();

        await update(userRef, {
          warning: true,
        });

        const userDocRef = doc(firestore, "users", userId);
        await updateDoc(userDocRef, {
          warning: true,
        });

        await updateDoc(doc(firestore, "reports", reportId), {
          status: "warning_issued",
        });

        window.alert("Warning issued to the user.");
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

  const handleRemoveContent = async (reportId, eventId) => {
    if (!window.confirm("Are you sure you want to remove this event?")) return;
  
    try {
      const eventDocRef = doc(firestore, "events", eventId);
  
      await deleteDoc(eventDocRef);
  
      await updateDoc(doc(firestore, "reports", reportId), { status: "event_removed" });
  
      window.alert("Event removed successfully.");
    } catch (error) {
      console.error("Error removing event:", error);
      window.alert("Failed to remove event. Please try again.");
    }
  };



  return (
    <div>
      <HeaderAdmin />
      <div  className="user-management-container">
        
        <h1>Content Management</h1>

        <div className="user-table-container">
          <h2 className="table">Flagged Posts and Content</h2>
          {reports.length > 0 ? (
            <table className="user-requests-table">
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
                        className="suspend-button"
                        onClick={() => handleSuspendAccount(report.id, report.eventCreator)}
                      >
                        Suspend Account
                      </button>
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleWarning(report.id, report.status === "warning_issued", report.eventCreator)
                        }
                      >Issue Warning
                        {report.status === "warning_issued"}
                      </button>
                      <button
                        className="restore-button"
                        onClick={() => handleDismissReport(report.id)}
                      >
                        Dismiss Report
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleRemoveContent(report.id, report.eventId)}
                      >
                        Remove Content
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