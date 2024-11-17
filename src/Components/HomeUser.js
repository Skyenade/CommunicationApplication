import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import Header from "../Components/Header";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import useFollow from "../hooks/useFollow";
import getFollowersCount from "../utils/getFollowersCount";
import "../Style.css";

const HomeUser = () => {
  const currentUser = useAuth();
  const location = useLocation();
  const { following, followers, followUser, unfollowUser } = useFollow(currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [userWarning, setUserWarning] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setShowFollowers(queryParams.get("showFollowers") === "true");
  }, [location.search]);

  useEffect(() => {
    const fetchFollowersCount = async () => {
      if (currentUser) {
        const count = await getFollowersCount(currentUser.uid);
        setFollowersCount(count);
      }
    };

    fetchFollowersCount();
  }, [currentUser]);

 
  useEffect(() => {
    const fetchUserWarning = async () => {
      if (currentUser) {
        try {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserWarning(userData.warning || false);
          }
        } catch (error) {
          console.error("Error fetching user warning:", error);
        }
      }
    };

    fetchUserWarning();
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
          .filter((user) => user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

        setUserResults(filteredUsers.length > 0 ? filteredUsers : []);
      } else {
        console.log("No users found.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleFollowersList = () => {
    setShowFollowers(!showFollowers);
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
        <button className="followers-button" onClick={toggleFollowersList}>
          {showFollowers ? "Hide Followers" : "Show Followers"}
        </button>
      </div>

      <div className="followers-count">Followers: {followersCount}</div>

      {userWarning && (
        <div className="user-warning">
          <p className="warning-message">This account has a warning. Please review your activity.</p>
        </div>
      )}

      <EventFeed following={following} />

      {showFollowers && (
        <div className="followers-list">
          <h3>Followers List</h3>
          <ul>
            {followers.map((follower) => (
              <li key={follower.id}>
                <Link to={`/user/${follower.id}`}>{follower.username}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="user-results">
        {userResults.length > 0 && (
          <div className="user-results">
            <ul>
              {userResults.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeUser;