import React from 'react';
import './AdminDashboard.css';
import { Link } from "react-router-dom"; 
import HeaderAdmin from './HeaderAdmin';

const AdminDashboard = () => {
  return (
    <div>
              <HeaderAdmin/>
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-sections">
        <div className="section"><a><Link to="/UserManagement">User Management</Link></a></div>
        <div className="section">Content Management</div>
        <div className="section">Database Management</div>
        <div className="section">History of Reported Users</div>
        <div className="section">History of Reported Content</div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
