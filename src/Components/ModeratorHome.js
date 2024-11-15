import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import Header from "./Header";
import EventFeed from "./EventFeed";

const ModeratorHome = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    const fetchNotifications = () => {
      const notificationsRef = collection(firestore, "notifications");
      const notificationsQuery = query(notificationsRef, where("isRead", "==", false));

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const notificationsList = snapshot.docs.map((doc) => ({
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

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(firestore, "notifications", notificationId);
      await setDoc(notificationRef, { isRead: true }, { merge: true });
      console.log("Notification marked as read");
    } catch (err) {
      console.error("Error marking notification as read: ", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="homeuser-container">
      <Header />
      <div className="homeuser-navbar-actions">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="Search-button" onClick={handleSearch}>Search</button>
        <button className="create-event-button">
          <h4>
            <Link to="/CreateEvent" className="links">
              Create An Event
            </Link>
          </h4>
        </button>
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
            <label>Current Location:</label>
            <br />
            <input type="text" placeholder="Choose your location" />
          </div>
        </div>

        <div className="event-feed">
          <EventFeed />
        </div>

        <div className="Home_Notification">
          <div className="moderator-dashboard">
            <h4>
              <Link to="/ModeratorDashboard" className="links">
                Moderator Dashboard
              </Link>
            </h4>
          </div>

          <div className="notifications">
            <h3>Notifications</h3>
            <ul>
              {loading ? (
                <li>Loading notifications...</li>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>
                    {notification.type === "event_report" ? (
                      <>
                        <p>
                          <strong>You have a reported event</strong>
                        </p>
                        <p>
                          <strong>Reported by:</strong> {notification.userEmail}
                        </p>
                        <p>
                          <strong>Reason:</strong> {notification.reason || "No reason provided"}
                        </p>
                        <small>
                          {notification.timestamp
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : "No timestamp available"}
                        </small>
                      </>
                    ) : (
                      <span>{notification.message}</span>
                    )}
                    <button onClick={() => handleMarkAsRead(notification.id)} className="notif_viwedbtn">VIEWED</button>
                  </li>
                ))
              ) : (
                <li>No notifications</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorHome;
