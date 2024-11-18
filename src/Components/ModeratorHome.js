import React, { useState, useEffect } from "react";
import { database, firestore } from "../firebase";
import { collection, query as queryFS, where, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";  // Renombrar query de firestore
import { ref, get, query as queryDB, orderByChild, startAt, endAt, update } from "firebase/database";  // Renombrar query de database
import { Link } from "react-router-dom";
import Header from "./Header";
import EventFeed from "./EventFeed";
import "../Style.css";

const ModeratorHome = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);

  // State for followers and following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchNotifications = () => {
      const notificationsRef = collection(firestore, "notifications");
      const notificationsQuery = queryFS(notificationsRef, where("isRead", "==", false));  // Usamos queryFS en lugar de query

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

  // Fetch followers and following when the moderator's data is loaded
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(database, "users/yourUserId"); // Replace with actual user ID
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const followingArray = data.following ? Object.keys(data.following) : [];
        setFollowing(followingArray);

        const followersArray = data.followers ? Object.keys(data.followers) : [];
        setFollowers(followersArray);
      }
    };
    fetchUserData();
  }, []);

  // Function to follow a user
  const handleFollow = async (userId) => {
    const userRef = ref(database, `users/yourUserId/following`);
    const userFollowersRef = ref(database, `users/${userId}/followers`);

    await update(userRef, {
      [userId]: true,
    });

    await update(userFollowersRef, {
      ["yourUserId"]: true,
    });

    // Actualizar el estado local
    setFollowing((prev) => [...prev, userId]);
  };

  // Function to unfollow a user
  const handleUnfollow = async (userId) => {
    const userRef = ref(database, `users/yourUserId/following`);
    const userFollowersRef = ref(database, `users/${userId}/followers`);

    await update(userRef, {
      [userId]: null,
    });

    await update(userFollowersRef, {
      ["yourUserId"]: null,
    });

    setFollowing((prev) => prev.filter((id) => id !== userId));

   
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);

    if (!searchTerm.trim()) {
      console.log("Search term is empty.");
      return;
    }

    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const filteredUsers = Object.keys(usersData)
          .map((key) => ({ id: key, ...usersData[key] }))
          .filter((user) =>
            user.username &&
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setUserResults(filteredUsers);

        if (filteredUsers.length > 0) {
          console.log("Users found:", filteredUsers);
        } else {
          console.log("No users found with that username.");
        }
      } else {
        console.log("No users found in the database.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
            <div className="followers-following">
        <h3>Followers: {followers.length}</h3>
        <h3>Following: {following.length}</h3>
      </div>
      </div>

        <div className="search-results">
          <h3> Results</h3>
          {userResults.length > 0 ? (
            <ul>
              {userResults.map((user) => (
                <li key={user.id}>
                  {user.username} ({user.email})
                  {following.includes(user.id) ? (
                    <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
                  ) : (
                    <button onClick={() => handleFollow(user.id)}>Follow</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
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
