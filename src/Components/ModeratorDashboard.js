import React, { useEffect, useState } from "react";
import "./ModeratorDashboard.css"; 
import Header from "./Header";
import { database } from "../firebase"; 
import { ref, onValue, remove } from "firebase/database";
import { Navigate} from "react-router-dom"; 
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {

  const navigate = useNavigate();

  const flaggedItems = [
    {
      user: "Kimi",
      email: "kimi@example.com",
      date: "2024-11-01",
      Content: "Comment",
      Reporttext: "Inappropriate language",
    } 
  ];

  // const [flaggedItems, setFlaggedItems] = useState([]);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const flaggedRef = ref(database, 'flaggedContent');
    
  //   onValue(flaggedRef, (snapshot) => {
  //     const data = snapshot.val();
  //     const itemsArray = [];
  //     if (data) {
  //       for (let id in data) {
  //         itemsArray.push({ id, ...data[id] });
  //       }
  //     }
  //     setFlaggedItems(itemsArray);
  //   });
  // }, []);

  const handleAction = (action, itemId) => {
    const itemRef = ref(database, `flaggedContent/${itemId}`);

    switch (action) {
      case 'Warning':
        alert("Warning issued to the user.");
        break;
      case 'Remove':
        if (window.confirm("Are you sure you want to remove the content?")) {
          remove(itemRef)
            .then(() => alert("Selected Content removed successfully."))
            .catch((error) => alert("Error removing content: " + error.message));
        }        break;
      case 'Suspend':
        alert("User suspended. Implement suspension logic here.");
        break;
      case 'Dismiss':
        remove(itemRef).then(() => alert("Report dismissed successfully."));
        break;
      default:
        break;
    }

    
  };

  const handleAdminAssistance = () => {
    navigate("/RequestAssistance"); 
  };


  return (
    <div >
    <Header/>
    <div className='create-event'>
      <div className="content">
        <h1>Moderator Dashboard</h1>
        <button className="requestAdminAssistanceButton"onClick={handleAdminAssistance}>
          Request Admin Assistance
        </button>

        <h2 className="table">Flagged Posts and Content</h2>
        <table className="flaggedPostsTable">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Date</th>
              <th>Content</th>
              <th>Reporttext (Report Issue)</th>
              <th id="action">Action</th>
            </tr>
          </thead>
          <tbody>
            {flaggedItems.length > 0 ? (
              flaggedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.user}</td>
                  <td>{item.email}</td>
                  <td>{item.date}</td>
                  <td>{item.Content}</td>
                  <td>{item.Reporttext}</td>
                  <td>
                    <button 
                      className="actionButton" id="Warning"
                      onClick={() => handleAction('Warning', item.id)}
                       >Warning
                    </button>
                    <button 
                      className="actionButton" id="Remove"
                      onClick={() => handleAction('Remove', item.id)}
                      >Remove
                    </button>
                    <button 
                      className="actionButton" id="Suspend"
                      onClick={() => handleAction('Suspend', item.id)}
                      >Suspend Account
                    </button>
                    <button 
                      className="actionButton"  id="Dismiss"
                      onClick={() => handleAction('Dismiss', item.id)}
                      >Dismiss Report
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>There is no flagged content here!</td>
                <td>
                  
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div></div>
    </div>
  );
};

export default ModeratorDashboard;
