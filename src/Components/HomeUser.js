import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { database, firestore } from "../firebase";
import Header from "../Components/Header";
import { collection, query as queryFS, where, onSnapshot, doc, getDocs, setDoc, } from "firebase/firestore";
import { ref, onValue, remove, get } from "firebase/database";
import { ref as refDB, update } from "firebase/database";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import useFollowers from "../hooks/useFollowers";



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
  const [results, setResults] = useState([]);

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
            eventTitle: doc.data().eventTitle,
          }));
          setNotifications(notificationsList);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
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



  const handleFollow = async (userId) => {
    if (!currentUser) return;   


    const userFollowingRef = refDB(database, `users/${currentUser.uid}/following/${userId}`);
    const userFollowersRef = refDB(database, `users/${userId}/followers/${currentUser.uid}`);

    await update(userFollowingRef, { active: true });
    await update(userFollowersRef, { active: true });

    setFollowing((prev) => [...prev, userId]);
    setFollowers((prev) => prev.includes(userId) ? prev : [...prev, currentUser.uid]);
  };

  const handleUnfollow = async (userId) => {
    if (!currentUser) return;

    const userFollowingRef = refDB(database, `users/${currentUser.uid}/following/${userId}`);
    const userFollowersRef = refDB(database, `users/${userId}/followers/${currentUser.uid}`);

    await remove(userFollowingRef);
    await remove(userFollowersRef);

    setFollowing((prev) => prev.filter((id) => id !== userId));
    setFollowers((prev) => prev.filter((id) => id !== currentUser.uid));
  };



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
      <Header />
      <div className="homeuser-navbar-actions">
        <form onSubmit={handleSearch}>
          <select className="Search-input" onChange={(e) => setFilterType(e.target.value)} value={filterType}>
            <option value="all">All</option>
            <option value="user">Users</option>
            <option value="location">Location</option>
            <option value="event">Event Name</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="Search-input" 
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

        <div className="followers-following">
          {/* <h3>Followers: {followers.length}</h3> */}
          <h3>Following: {following.length}</h3>
        </div>
      </div>

  

      <div className="search-results">
        {userResults.length > 0 ? (
          userResults.map((result) => (
            <div key={result.id} className="search-result">
              {result.type === "user" ? (
                <>
                  <span>{result.username} ({result.email})</span>
                  {following.includes(result.id) ? (
                    <button onClick={() => handleUnfollow(result.id)}>Unfollow</button>
                  ) : (
                    <button onClick={() => handleFollow(result.id)}>Follow</button>
                  )}
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
          <div className="notifications">
            <h3>Notifications</h3>
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li
                  key={notification.id}
                  onDoubleClick={() => handleMarkAsRead(notification.id)} 
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                >
                  {notification.type === "like" ? (
  <>
    <p>
      <strong>{notification.userEmail}</strong> liked event <strong>{notification.eventTitle}</strong>
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
                        <strong>{notification.userEmail}</strong> commented on <strong>{notification.eventTitle}</strong>
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
                          <strong>{notification.userEmail}</strong> is attending <strong>{notification.eventTitle}</strong>event.
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
