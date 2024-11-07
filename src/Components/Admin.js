import React from "react";
import { Link } from "react-router-dom"; 
import Header from "./Home";
import HeaderAdmin from "./HeaderAdmin";
import '../Style.css';
import EventFeed from "./EventFeed";


const AdminHome = () => {
  return (
    <div className="homeuser-container">
      <HeaderAdmin />
      <div className="homeuser-navbar-actions">
        <input
          type="text"
          className="search-bar"
          id="search"
          placeholder="Search events"
        />
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
          <h1><Link to="/AdminDashboard" className="links">Admin Dashboard</Link></h1>
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

export default AdminHome;
