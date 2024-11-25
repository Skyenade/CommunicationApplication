import React, { useState, useEffect } from "react";
import { database, firestore,  } from "../firebase";
import { collection, query as queryFS, where, onSnapshot, doc, setDoc,  } from "firebase/firestore";
import { ref, onValue,  remove, get } from "firebase/database";
import useAuth from "../hooks/useAuth";
import { ref as refDB, update } from "firebase/database";
import { Link } from "react-router-dom";
import Header from "./Header";
import EventFeed from "./EventFeed";
import "../Style.css";
import HeaderModerator from "./HeaderModerator";
import useFollowers from "../hooks/useFollowers";

const ModeratorHome = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const userRef = refDB(database, "users/yourUserId");
  //     const snapshot = await get(userRef);
  //     if (snapshot.exists()) {
  //       const data = snapshot.val();
  //       const followingArray = data.following ? Object.keys(data.following) : [];
  //       setFollowing(followingArray);

  //       const followersArray = data.followers ? Object.keys(data.followers) : [];
  //       setFollowers(followersArray);
  //     }
  //   };



    const fetchNotifications = () => {
      const notificationsRef = collection(firestore, "notifications");
      const notificationsQuery = queryFS(notificationsRef, where("isRead", "==", false));

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
 

  useEffect(() => {
    if (!currentUser) return;

    const userRef = ref(database, `users/${currentUser.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setFollowers(data?.followers ? Object.keys(data.followers) : []);
      setFollowing(data?.following ? Object.keys(data.following) : []);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle tracking
  const handleFollow = async (userId) => {
    if (!currentUser) return;

    const userFollowingRef = refDB(database, `users/${currentUser.uid}/following/${userId}`);
    const userFollowersRef = refDB(database, `users/${userId}/followers/${currentUser.uid}`);

    await update(userFollowingRef, { active: true });
    await update(userFollowersRef, { active: true });

    setFollowing((prev) => [...prev, userId]);
    setFollowers((prev) => prev.includes(userId) ? prev : [...prev, currentUser.uid]); // Ensure consistency
  };

  const handleUnfollow = async (userId) => {
    if (!currentUser) return;

    const userFollowingRef = refDB(database, `users/${currentUser.uid}/following/${userId}`);
    const userFollowersRef = refDB(database, `users/${userId}/followers/${currentUser.uid}`);

    await remove(userFollowingRef);
    await remove(userFollowersRef);

    setFollowing((prev) => prev.filter((id) => id !== userId));
    setFollowers((prev) => prev.filter((id) => id !== currentUser.uid)); // Ensure consistency
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
      <HeaderModerator />
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
        {userResults.length > 0 ? (
          userResults.map((user) => (
            <div key={user.id} className="user-result">
              <span>{user.username}</span>
              {following.includes(user.id) ? (
                <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
              ) : (
                <button onClick={() => handleFollow(user.id)}>Follow</button>
              )}
            </div>
          ))
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
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    { notification.type === "event_report" ? (

                      <>
                        <p>
                          <strong>there is a reported event</strong>
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
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="notif_viwedbtn"
                    >
                      VIEWED
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorHome;