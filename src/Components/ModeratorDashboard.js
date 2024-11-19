import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { getDatabase, ref, update, get } from "firebase/database";
import Header from "./Header";
import "./ModeratorDashboard.css";
import { Navigate, useNavigate } from "react-router-dom";

const ModeratorDashboard = () => {
  const [reports, setReports] = useState([]);
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    const reportsQuery = query(
      collection(firestore, "reports"),
      where("status", "==", "flagged")
    );

    const unsubscribe = onSnapshot(reportsQuery, (querySnapshot) => {
      setReports(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })));
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
       
        await updateDoc(doc(firestore, "reports", reportId), {
          status: currentWarningStatus ? "flagged" : "warning_issued",
        });

        const userRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
          window.alert("User does not exist.");
          return;
        }

        
        await update(userRef, {
          warning: !currentWarningStatus,  
        });

        window.alert(currentWarningStatus ? "Warning removed from user." : "Warning issued to the user.");
      } catch {
        window.alert("Failed to issue or remove warning. Please try again.");
      }
    }
  };

  const handleDismissReport = async (reportId,) => {
    if (window.confirm("Are you sure you want to dismiss this report?")) {
      try {
        await updateDoc(doc(firestore, "reports", reportId), { status: "dismissed" });
        window.alert("Report dismissed.");
      } catch {
        window.alert("Failed to dismiss report. Please try again.");
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

  const handleAdminAssistance = () => {
    navigate("/RequestAssistance");
    console.log("Admin assistance requested");
  };

  return (
    <div>
      <Header />
      <div className="create-event">
        <div className="content">
          <h1>Moderator Dashboard</h1>
          <button className="requestAdminAssistanceButton" onClick={handleAdminAssistance}>
            Request Admin Assistance
          </button>
          <h2 className="table">Flagged Posts and Content</h2>
          {reports.length > 0 ? (
            <table className="flaggedPostsTable">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
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
                    <td>{report.username}</td>
                    <td>{report.email}</td>
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

export default ModeratorDashboard;