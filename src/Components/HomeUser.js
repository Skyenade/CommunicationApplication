import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import Header from "../Components/Header";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import { followUser, unfollowUser } from "../hooks/useFollow";
import { useRealTimeCounts } from "../hooks/useRealTimeCounts";
import "../Style.css";

const HomeUser = () => {
  const currentUser = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [following, setFollowing] = useState([]);

  // Declare status for counters
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Call the useRealTimeCounts hook every time, and handle the values ​​with defaults
  const { followersCount: realTimeFollowersCount = 0, followingCount: realTimeFollowingCount = 0 } =
    useRealTimeCounts(currentUser ? currentUser.uid : null) || {};

  // Use the values ​​from the useRealTimeCounts hook for initial loading
  useEffect(() => {
    if (currentUser) {
      setFollowersCount(realTimeFollowersCount);
      setFollowingCount(realTimeFollowingCount);
    }
  }, [currentUser, realTimeFollowersCount, realTimeFollowingCount]);

  // Load the list of followed users for the current user
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        console.error("Usuario no autenticado");
        return;
      }

      try {
        // Get the list of users that the current user follows
        const followingRef = ref(database, `users/${currentUser.uid}/following`);
        const snapshot = await get(followingRef);
        if (snapshot.exists()) {
          setFollowing(Object.keys(snapshot.val())); // List of tracked user IDs
        }
      } catch (error) {
        console.error("Error al cargar datos de seguidores o seguidos:", error);
      }
    };

    fetchData();
  }, [currentUser]); // Only executed when the currentUser changes

  // Handle user search
  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const filteredUsers = Object.keys(usersData)
          .map((key) => ({ id: key, ...usersData[key] }))
          .filter((user) =>
            user.username && // Make sure the `username` property exists
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          );
        setUserResults(filteredUsers);
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  // Handle the action of following a user
  const handleFollow = async (userId) => {
    if (!currentUser) return;

    try {
      await followUser(currentUser.uid, userId);
      setFollowing([...following, userId]); // Update the list of followed users

      // Update counters locally
      setFollowingCount(followingCount + 1); // Increment the following counter
    } catch (error) {
      console.error("Error al seguir al usuario:", error);
    }
  };

  // Handle the action of unfollowing a user
  const handleUnfollow = async (userId) => {
    if (!currentUser) return;

    try {
      await unfollowUser(currentUser.uid, userId);
      setFollowing(following.filter((id) => id !== userId)); // Remove from list of followed users

      // Update counters locally
      setFollowingCount(followingCount - 1); // Decrement the following counter
    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
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
        <div className="followers-count">
          <p>You have {followersCount} followers</p>
        </div>
        <div className="following-count">
          <p>You are following {followingCount} users</p>
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
