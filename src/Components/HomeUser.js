import React, { useState, useEffect } from "react"; // Eliminado `ref`
import { useLocation, Link } from "react-router-dom";
import { database } from "../firebase";
import Header from "../Components/Header";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import { collection, query as queryFS, where, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore"; // Renombrar query de Firestore
import { ref as refDB, get, query as queryDB, orderByChild, startAt, endAt, update } from "firebase/database"; // Renombrar ref de Database
import "../Style.css";

const HomeUser = () => {
  const currentUser = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);

  // Declare status for counters
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // Load the list of followed users for the current user
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = refDB(database, "users/yourUserId"); // Usar refDB
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
    const userRef = refDB(database, `users/yourUserId/following`); // Usar refDB
    const userFollowersRef = refDB(database, `users/${userId}/followers`); // Usar refDB

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
    const userRef = refDB(database, `users/yourUserId/following`); // Usar refDB
    const userFollowersRef = refDB(database, `users/${userId}/followers`); // Usar refDB

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
      const usersRef = refDB(database, "users"); // Usar refDB
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

  // If there is no authenticated user
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
          <p>No users found</p>
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
            <ul>
              <li>You have a new follower</li>
              <li>You have a new like</li>
              <li>New flagged content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
