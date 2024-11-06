import React from "react";
import { Link } from "react-router-dom"; 
import Header from "./Home";

const ModeraterHome = () => {
  return (
    <div>
      <Header/>
    {/* <div className=""> */}
        <div className="choose">
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

        <div className="navbar-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Search events"
          />
          <button className="create-event-button">
            <h4><Link to="/CreateEvent" className="links">Create An Event</Link></h4>
          </button>
        </div>
        <div className="content-area">
          <div className="content">
            <h1>Events!</h1>
            <Link to="AdminHome">click to check admin</Link>
          </div>

          <div className="right-sidebar">
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

    // </div>
  );
};

export default ModeraterHome;
