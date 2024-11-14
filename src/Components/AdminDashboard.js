import React from 'react';
import '../Style.css';
import './AdminDashboard.css';
import { Link } from "react-router-dom";
import HeaderAdmin from './HeaderAdmin';

const AdminDashboard = () => {
  return (
    <div>
      <HeaderAdmin />
      <div className="admin-dashboard">
        
        <h1>Admin Dashboard</h1>

        <div className="dashboard-sections">
          <div className="section">
            <Link to="/UserManagement" className='linking'>User Management</Link>
          </div>
          <div className="section">
            <Link to="/ContentManagement" className='linking'>Content Management</Link>
          </div>
          <div className="section">
            <Link to="/" className='linking'>Database Management</Link>
          </div>
          <div className="section">
            <Link to="/" className='linking'>History of Reported Users</Link>
          </div>
          <div className="section">
            <Link to="/" className='linking'>History of Reported Content</Link>
          </div>
          <div className="section">
            <Link to="/AdminAssistanceRequests" className='linking'>Assistance Requests</Link>
          </div>
          {/* Section to access reports */}
          <div className="section">
            <Link to="/AdminReports" className='linking'>Reports Management</Link> {/* Added link */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;