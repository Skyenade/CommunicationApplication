import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Home";
import HeaderAdmin from "./HeaderAdmin";
import '../Style.css';
import { ref, onValue, remove, get } from "firebase/database";
import EventFeed from "./EventFeed";
import { collection, query, where, onSnapshot, doc, setDoc,getDocs } from "firebase/firestore";
import {database, firestore } from "../firebase";

const AdminHome = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);

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

  const [filterType, setFilterType] = useState("all");

  const handleSearch = async (e) => {
    e.preventDefault();
  
    if (!searchTerm.trim()) {
      console.log("Search term is empty.");
      return;
    }
  
    const lowercasedSearchTerm = searchTerm.toLowerCase();
  
    try {
      const results = [];
  
      if (filterType === "user" || filterType === "all") {
        const usersRef = ref(database, "users");
        const userSnapshot = await get(usersRef);
  
        if (userSnapshot.exists()) {
          const users = Object.keys(userSnapshot.val())
            .map((id) => ({ id, ...userSnapshot.val()[id] }))
            .filter((user) =>
              user.username?.toLowerCase().includes(lowercasedSearchTerm)
            );
          results.push(...users.map((user) => ({ ...user, type: "user" })));
        }
      }
  
      if (filterType === "location" || filterType === "event" || filterType === "all") {
        const eventsSnapshot = await getDocs(collection(firestore, "events"));
  
        if (!eventsSnapshot.empty) {
          const events = eventsSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((event) => {
              if (filterType === "location") {
                return event.location?.toLowerCase().includes(lowercasedSearchTerm);
              } else if (filterType === "event") {
                return event.title?.toLowerCase().includes(lowercasedSearchTerm);
              } else {
                return (
                  event.location?.toLowerCase().includes(lowercasedSearchTerm) ||
                  event.title?.toLowerCase().includes(lowercasedSearchTerm)
                );
              }
            });
          results.push(...events.map((event) => ({ ...event, type: "event" })));
        }
      }
  
      setUserResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
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

  return (
    <div className="homeuser-container">
      <HeaderAdmin />
      <div className="homeuser-navbar-actions">
      <form onSubmit={handleSearch}>
          <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
            <option value="all">All</option>
            <option value="user">Users</option>
            <option value="location">Location</option>
            <option value="event">Event Name</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="Search-button">Search</button>
        </form>
    <button className="create-event-button">
            <h4>
              <Link to="/CreateEvent" className="links">
                Create An Event
              </Link>
            </h4>
          </button>

          </div>
          <div className="search-results">
  {userResults.length > 0 ? (
    userResults.map((result) => (
      <div key={result.id} className="search-result">
        {result.type === "user" ? (
          <>
            <span>{result.username} ({result.email})</span>
          </>
        ) : (
          <Link to={`/event/${result.id}`} className="event-link">
            <span><strong>Title:</strong> {result.title}</span>
            <span><strong>Location:</strong> {result.location}</span>
            <span><strong>Created By:</strong> {result.createdBy}</span>
          </Link>
        )}
      </div>
    ))
  ) : (
    <p>No results found for the selected filter.</p>
  )}
</div>


      

      <div className="homeuser-content">
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
                    {notification.type === "comment_flag" ? (
                      <>
                        <p><strong>You have a Flagged Comment</strong></p>
                        <p>Flagged by: {notification.userEmail}</p>
                        <p>Reason: {notification.reason || "No reason provided"}</p>
                        <small>
                          {notification.timestamp
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : "No timestamp available"}
                        </small>
                      </>
                    ) : notification.type === "event_report" ? (
                      <>
                        <p><strong>You have a reported Event</strong></p>
                        <p><strong>Reported by:</strong> {notification.userEmail}</p>
                        <small>
                          {notification.timestamp
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : "No timestamp available"}
                        </small>
                      </>
                    ) : notification.type === "assistance_request" ? (
                      <>
                        <p><strong>Moderator Requested For Assistance </strong></p>
                        <p>Requested by: {notification.userEmail}</p>
                        <p>Message: {notification.requestText || "No message provided"}</p>
                        <small>
                          {notification.timestamp
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : "No timestamp available"}
                        </small>
                      </>
                    ) : (
                      <span>{notification.message}</span>
                    )}
                    <button onClick={() => handleMarkAsRead(notification.id)} className="notif_viwedbtn">READ</button>
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

export default AdminHome;
