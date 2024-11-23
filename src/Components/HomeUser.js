import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { database, firestore } from "../firebase";
import Header from "../Components/Header";
import {
  collection,
  query as queryFS,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc, getDocs
} from "firebase/firestore";
import { ref, onValue, remove, get } from "firebase/database";
import { ref as refDB, update } from "firebase/database";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import useFollowers from "../hooks/useFollowers";
import getFollowersCount from "../utils/getFollowersCount";
import { query, } from "firebase/firestore";


import '../Style.css';


const HomeUser = () => {

  const currentUser = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);


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

      }
    };

    if (currentUser?.uid) fetchUserData();
  }, [currentUser]);

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

  const handleFollow = async (userId) => {
    if (!currentUser) return;

    if (!searchTerm.trim()) {
      console.log("Search term is empty.");
      return;
    }


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
          const usersRef = refDB(database, "users");
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





    // if (!currentUser) {
    //   return <div>Loading...</div>;
    // }



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
          <button className="Search-button" onClick={handleSearch}>Search </button>
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
          <p>no username or events found</p>
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
                    ) : notification.type === "like" ? (
                      <>
                        <p>
                          <strong>{notification.userEmail}</strong> liked your event.
                        </p>
                        <small>
                          {notification.timestamp
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : "No timestamp available"}
                        </small>
                      </>
                    ) : notification.type === "comment" ? (
                      <>
                        <p>
                          <strong>{notification.userEmail}</strong> commented on your event:{" "}
                          <em>"{notification.commentText}"</em>
                        </p>
                        <small>
                          {notification.timestamp
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : "No timestamp available"}
                        </small>
                      </>
                    ) : notification.type === "attendance" ? (
                      <>
                        <p>
                          <strong>{notification.userEmail}</strong> is attending your event.
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
                      className="notif_viwedbtn">
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
