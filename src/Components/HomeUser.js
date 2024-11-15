import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ref, get, child, update } from "firebase/database";
import { database } from "../firebase";
import Header from "../Components/Header";
import useAuth from "../hooks/useAuth";
import EventFeed from "./EventFeed";
import useFollow from "../hooks/useFollow";
import getFollowersCount from "../utils/getFollowersCount";
import '../Style.css';
// ok?
const HomeUser = () => {

  const currentUser = useAuth();
  const location = useLocation();
  const { following, followers, followUser, unfollowUser } = useFollow(currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // Fetch following and followers lists
  useEffect(() => {
    // Check for query parameter to show followers list
    const queryParams = new URLSearchParams(location.search);
    setShowFollowers(queryParams.get("showFollowers") === "true");
  }, [location.search]);

 
  useEffect(() => {
    const fetchFollowersCount = async () => {
      if (currentUser) {
        const count = await getFollowersCount(currentUser.uid);  //Call the function
        setFollowersCount(count);  // Update the number of followers
      }
    };

    fetchFollowersCount();
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

  // Function to toggle the display of the followers list
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
        <button className="Search-button" onClick={handleSearch}>Search</button>
        <button className="create-event-button">
          <h4><Link to="/CreateEvent" className="links">Create An Event</Link></h4>
        </button>
        {/* Shows the number of followers*/}
        <div className="followers-count">
          <p>You have {followersCount} followers</p>
        </div>
      </div>

      {/* Show followers list */}
      {showFollowers && (
        <div className="followers-list">
          <h3>Followers</h3>
          {followers.length > 0 ? (
            followers.map((followerId) => (
              <p key={followerId}>{followerId}</p>
            ))
          ) : (
            <p>No followers found</p>
          )}
        </div>
      )}


      {/* Display search results */}
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
