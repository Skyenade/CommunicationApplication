import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, get, child, update } from "firebase/database";
import { database } from "../firebase";

import Header from "../Components/Header";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import '../Style.css';

const HomeUser = () => {

  const currentUser = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchFollowing = async () => {
        try {
          const userRef = ref(database, "users/" + currentUser.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setFollowing(snapshot.val().following || []);
          }
        } catch (error) {
          console.error("Error fetching following list:", error);
        }
      };
      fetchFollowing();
    }
  }, [currentUser]);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const filteredUsers = Object.keys(usersData)
          .map((key) => ({ id: key, ...usersData[key] }))
          .filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filteredUsers.length > 0) {
          setUserResults(filteredUsers);
        } else {
          console.log("No users found with that username.");
        }
      } else {
        console.log("No users found.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const followUser = async (userId) => {
    if (!currentUser) return;

    try {
      const currentUserRef = ref(database, "users/" + currentUser.uid);
      const userToFollowRef = ref(database, "users/" + userId);

      await update(currentUserRef, { following: [...following, userId] });
      await update(userToFollowRef, { followers: [currentUser.uid] });

      setFollowing((prev) => [...prev, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async (userId) => {
    if (!currentUser) return;

    try {
      const currentUserRef = ref(database, "users/" + currentUser.uid);
      const userToUnfollowRef = ref(database, "users/" + userId);

      await update(currentUserRef, { following: following.filter(id => id !== userId) });
      await update(userToUnfollowRef, { followers: [currentUser.uid] });

      setFollowing((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
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
        <button className="Search-button" onClick={handleSearch}>Search</button>
        <button className="create-event-button">
          <h4><Link to="/CreateEvent" className="links">Create An Event</Link></h4>
        </button>
      </div>

      <div className="search-results">
        {userResults.length > 0 ? (
          userResults.map((user) => (
            <div key={user.id} className="user-result">
              <span>{user.username}</span>
              {following.includes(user.id) ? (
                <button onClick={() => unfollowUser(user.id)}>Unfollow</button>
              ) : (
                <button onClick={() => followUser(user.id)}>Follow</button>
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
            <label>Current Location:</label><br />
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
