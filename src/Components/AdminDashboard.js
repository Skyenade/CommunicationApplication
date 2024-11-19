import React, { useEffect, useState } from 'react';
import '../Style.css';
import './AdminDashboard.css';
import { Link } from "react-router-dom";
import HeaderAdmin from './HeaderAdmin';
import { firestore } from '../firebase'; 

const AdminDashboard = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);

  useEffect(() => {
    const fetchReportedData = async () => {
      try {
        const usersRef = firestore.collection('reports').where('type', '==', 'user');
        const userSnapshot = await usersRef.get();
        const userReports = userSnapshot.docs.map(doc => doc.data());
        setReportedUsers(userReports);

        const contentRef = firestore.collection('reports').where('type', '==', 'content');
        const contentSnapshot = await contentRef.get();
        const contentReports = contentSnapshot.docs.map(doc => doc.data());
        setReportedContent(contentReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReportedData();
  }, []);

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
            <Link to="/FirebaseManagement" className='linking'>Firebase Management</Link>
          </div>
          <div className="section">
            <Link to="/HistoryOfReportedUsers" className='linking'>
              History of Reported Users ({reportedUsers.length})
            </Link>
          </div>
          <div className="section">
            <Link to="/HistoryOfReportedContent" className='linking'>
              History of Reported Content ({reportedContent.length})
            </Link>
          </div>
          <div className="section">
            <Link to="/AdminAssistanceRequests" className='linking'>Assistance Requests</Link>
          </div>
          <div className="section">
            <Link to="/AdminReports" className='linking'>Reports Management</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;