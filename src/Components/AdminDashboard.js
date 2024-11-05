import React from "react";
import '../Style.css';
import './AdminDashboard.css';
import { useNavigate, Link } from "react-router-dom";
import Header from "../Components/Header";
import HeaderAdmin from './HeaderAdmin';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate("/createUser"); 
  };

  const handleUserManagement = () => {
    navigate("/userManagement"); 
  };

  return (
    <div>
    
      <HeaderAdmin />

      <div className="admin-dashboard">
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

          <div className="dashboard-sections">
            <div className="section">
              <Link to="/UserManagement">User Management</Link>
            </div>
            <div className="section">Content Management</div>
            <div className="section">Database Management</div>
            <div className="section">History of Reported Users</div>
            <div className="section">History of Reported Content</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;