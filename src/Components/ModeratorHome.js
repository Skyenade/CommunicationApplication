import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate,  } from "react-router-dom";
import Header from "../Components/Header";
import EventFeed from "./EventFeed";
import useFollow from "../hooks/useFollow"; // Import useFollow hook
import useAuth from "../hooks/useAuth"; // Import useAuth hook
import '../Style.css';

const ModeratorHome = () => {

  const currentUser = useAuth(); // Get the current user
  const { following, followers, followUser, unfollowUser } = useFollow(currentUser); // Destructure follow-related functions
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false); // Control followers list visibility
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for query parameter to show followers list
    const queryParams = new URLSearchParams(location.search);
    setShowFollowers(queryParams.get("showFollowers") === "true");
  }, [location.search]);

  // Handle navigation based on user type
  const handleFollowersNavigation = () => {
    navigate("/ModeratorHome?showFollowers=true"); // Always stays on ModeratorHome
  };

  // Handle user search
  const handleSearch = async () => {
    if (!searchTerm) return;

    // Replace with actual search logic to fetch users
    const mockSearchResults = [
      { id: "user123", username: "JohnDoe" },
      { id: "user456", username: "JaneSmith" },
    ];
    setUserResults(mockSearchResults);
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

      {/* Display search results with follow/unfollow buttons */}
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
          <div className="moderator-dashboard">
              <h4><Link to="/ModeratorDashboard" className="links">Moderator Dashboard</Link></h4>
            </div>
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

export default ModeratorHome;
