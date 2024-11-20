import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { database, firestore } from "../firebase";
import Header from "../Components/Header";
import { ref } from "firebase/database";


import {
  collection,
  query as queryFS,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref as refDB, get, update, query } from "firebase/database";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import "../Style.css";
import useFollow from "../hooks/useFollow";
import getFollowersCount from "../utils/getFollowersCount";



const HomeUser = () => {
  const currentUser = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);


  const [showFollowers, setShowFollowers] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = refDB(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFollowing(Object.keys(data.following || {}));
          setFollowers(Object.keys(data.followers || {}));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
// =======
//       const userRef = refDB(database, "users/yourUserId");
//       const snapshot = await get(userRef);
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const followingArray = data.following ? Object.keys(data.following) : [];
//         setFollowing(followingArray);

//         const followersArray = data.followers ? Object.keys(data.followers) : [];
//         setFollowers(followersArray);
// >>>>>>> dev
      }
    };

    if (currentUser?.uid) fetchUserData();
  }, [currentUser]);

  // Load notifications
  useEffect(() => {
    const fetchNotifications = () => {
      try {
        const notificationsRef = collection(firestore, "notifications");
        const notificationsQuery = queryFS(
          notificationsRef,
          where("isRead", "==", false)
        );

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          const notificationsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(notificationsList);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    return fetchNotifications();
  }, []);
  const handleFollow = async (userId) => {
    try {
      // Update the following list of the current user
      const userRef = refDB(database, `users/${currentUser.uid}/following`);
      const userFollowersRef = refDB(database, `users/${userId}/followers`);
  
      await update(userRef, {
        [userId]: true,
      });
  
      await update(userFollowersRef, {
        [currentUser.uid]: true,
      });
  
      setFollowing((prev) => [...prev, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  
  // Fetch notifications on mount
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
  
      return unsubscribe;
    };
  
    fetchNotifications();
  }, []);
  const handleUnfollow = async (userId) => {
    try {
//       const userRef = refDB(database, `users/${currentUser.uid}/following`);
//       const userFollowersRef = refDB(database, `users/${userId}/followers`);
// =======
    const userRef = refDB(database, `users/yourUserId/following`);
    const userFollowersRef = refDB(database, `users/${userId}/followers`);

      await update(userRef, {
        [userId]: null,
      });

      await update(userFollowersRef, {
        [currentUser.uid]: null,
      });

      setFollowing((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
        console.log("Search term is empty.");
        return;
    }

    try {
        
        const usersRef = ref(database, "users");
        const userSnapshot = await get(usersRef);

        let filteredUsers = [];
        if (userSnapshot.exists()) {
            const usersData = userSnapshot.val();
            filteredUsers = Object.keys(usersData)
                .map((key) => ({ id: key, ...usersData[key] }))
                .filter((user) =>
                    user.username &&
                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
                );
        } else {
            console.log("No users found in the Realtime Database.");
        }

       
        const eventsRef = collection(firestore, "events");
        const eventsSnapshot = await getDocs(eventsRef);

        let filteredEvents = [];
        if (!eventsSnapshot.empty) {
            const allEvents = eventsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

           
            filteredEvents = allEvents.filter((event) =>
                event.title &&
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            console.log("No events found in Firestore.");
        }

        
        const combinedResults = [
            ...filteredUsers.map((user) => ({ ...user, type: "user" })),
            ...filteredEvents.map((event) => ({ ...event, type: "event" })),
        ];

        setUserResults(combinedResults);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

  


  if (!currentUser) {
    return <div>Loading...</div>;
  }



  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(firestore, "notifications", notificationId);
      await setDoc(notificationRef, { isRead: true }, { merge: true });
    } catch (err) {
      console.error("Error marking notification as read: ", err);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

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
        <button className="Search-button" onClick={handleSearch}>
          Search
        </button>
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
    userResults.map((result) => (
      <div key={result.id} className="search-result">
        {result.type === "user" ? (
          
          <>
            <span>
              {result.username} ({result.email})
            </span>
            {following.includes(result.id) ? (
              <button onClick={() => handleUnfollow(result.id)}>Unfollow</button>
            ) : (
              <button onClick={() => handleFollow(result.id)}>Follow</button>
            )}
          </>
        ) : (
          
          <Link to={`/event/${result.id}`} className="event-link">
            <span>
              <strong>Title:</strong> {result.title}
            </span>
            <span>
              <strong>Created By:</strong> {result.createdBy}
            </span>
          </Link>
        )}
      </div>
    ))
  ) : (
    <p>username and events</p>
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
      <div className="notifications">
          <h3>Notifications</h3>
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    {notification.type === "like" ? (
 `${notification.userEmail} liked your event`           
        
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

export default HomeUser;