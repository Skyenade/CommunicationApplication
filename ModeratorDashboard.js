import React from "react";
import Navbar from "../Navbar";
import "./ModeratorDashboard.css"; 

const ModeratorDashboard = () => {
  const flaggedItems = [
    {
      user: "",
      email: "",
      date: "",
      type: "",
      content: "",
    }
  ];

  return (
    <div className="moderatorDashboard">
      <aside className="sidebar">
        <h2>EventsUp</h2>
      </aside>
      <div className="content">
        <Navbar />
        <h1>Moderator Dashboard</h1>
        <button className="requestAdminAssistanceButton">
          Request Admin Assistance
        </button>

        <h2>Flagged Posts and Content</h2>
        <table className="flaggedPostsTable">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Date</th>
              <th>Type</th>
              <th>Content (Report Issue)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flaggedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.user}</td>
                <td>{item.email}</td>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>{item.content}</td>
                <td>
                  <button className="actionButton" id="Warning">Warning</button>
                  <button className="actionButton" id="Remove">Remove</button>
                  <button className="actionButton" id="Suspend">Suspend Account</button>
                  <button className="actionButton" id="Dismiss"> Dismiss Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
