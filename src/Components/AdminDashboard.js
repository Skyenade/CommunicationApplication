import React from "react";
import '../Style.css';
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate("/createUser"); // Create User page
  };

  const handleUserManagement = () => {
    navigate("/userManagement"); //User Management page
  };

  return (
    <div className="adminDashboard">
      <Header />

      <aside className="sidebar">
        <h2>EventsUp</h2>
      </aside>

      <div className="content">
        <h1>Admin Dashboard</h1>

        <button className="createUserButton" onClick={handleCreateUser}>
          Create an Account
        </button>

        <h2>User Management</h2>
        <button onClick={handleUserManagement} className="manageUsersButton">
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;