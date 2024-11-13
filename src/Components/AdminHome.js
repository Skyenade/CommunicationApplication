import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Header from "./Home";
import HeaderAdmin from "./HeaderAdmin";
import '../Style.css';
import EventFeed from "./EventFeed";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";


const AdminHome = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchNotifications = () => {
        const notificationsRef = collection(firestore, "notifications");
        const notificationsQuery = query(notificationsRef, where("isRead", "==", false));
  
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          const notificationsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(notificationsList);
          setLoading(false);
        });
  
        return () => unsubscribe();
      };
  
      fetchNotifications();
    }, []);
  
    const handleMarkAsRead = async (notificationId) => {
      try {
        const notificationRef = doc(firestore, "notifications", notificationId);
        await setDoc(notificationRef, { isRead: true }, { merge: true });
        console.log("Notification marked as read");
      } catch (err) {
        console.error("Error marking notification as read: ", err);
      }
    };
  

  return (
    <div className="homeuser-container">
      <HeaderAdmin />
      <div className="homeuser-navbar-actions">
        <input
          type="text"
          className="search-bar"
          id="search"
          placeholder="Search events"
        />
      </div>
      
      <div className="homeuser-content">
        <div className="homeuser-choose-options">
          <label>
            <input type="radio" name="options" value="Option 1" />
            Events by followers
          </label>
          <br />
          <label>
            <input type="radio" name="options" value="Option 2" />
            Events by Location
          </label>
          <br />
          <div className="location">
            <label>Current Location:</label><br />
            <input type="text" placeholder="Choose your location" />
          </div>
        </div>

        <div className="event-feed">
          <EventFeed />
        </div>
        <div className="Home_Notification">
          <div className="moderator-dashboard">
              <h4><Link to="/AdminDashboard" className="links">Admin Dashboard</Link></h4>
          </div>
          
          <div className="notifications">
            <h3>Notifications</h3>
            <ul>
              {loading ? (
                <li>Loading notifications...</li>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>
                    {notification.type === 'comment_flag' ? (
                      <div>
                        <p><strong>You have a Flagged Comment</strong></p>
                        {/* <p>Comment ID: {notification.commentId}</p>
                        <p>Event ID: {notification.eventId}</p> */}
                        <p>Flagged by: {notification.userEmail}</p>
                        <p>Reason: {notification.reason}</p>
                        <small>
                          {notification.timestamp 
                            ? new Date(notification.timestamp).toLocaleString() 
                            : "No timestamp available"}
                        </small>
                        <button onClick={() => handleMarkAsRead(notification.id)}>Received</button>
                      </div>
                    ) : notification.type === 'event_report' ? (
                      <div>
                        <p><strong> You have a Reported Event</strong></p>
                        {/* <p>Event ID: {notification.eventId}</p> */}
                        <p>Reported by: {notification.userEmail}</p>
                        <small>
                          {notification.timestamp 
                            ? new Date(notification.timestamp).toLocaleString() 
                            : "No timestamp available"}
                        </small>
                        <button onClick={() => handleMarkAsRead(notification.id)}>Received</button>
                      </div>
                    ) : (
                      <p>{notification.message}</p>
                    )}
                  </li>
                ))
              ) : (
                <li>No new notifications</li>
              )}
            </ul>
          </div> </div>
      </div>
    </div>
  );
};

export default AdminHome;
