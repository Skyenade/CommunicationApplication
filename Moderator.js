import React from "react";
import { Link } from "react-router-dom"; 

const ModeraterHome = () => {
  return (
    <div className="container">
      <aside className="sidebar">
        <h2>EventsUp</h2>
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
      </aside>

      <main className="main_area">
        <nav className="navbar">
          <ul className="navbar-menu">
            <li>
              <Link to="/eventfeed">Event Feed</Link> 
            </li>
            <li><Link to="/">My Events</Link></li>
            <li><Link to="/">My followers</Link></li>
          </ul>
          <ul className="navbar-profile">
            <li><Link to="/">User profile</Link></li>
            <li><Link to="/">Sign Out</Link></li>
          </ul>
        </nav>
        <div className="navbar-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Search events"
          />
          <button className="create-event-button">
            <h4>Create An Event</h4>
          </button>
        </div>
        <div className="content-area">
          <div className="content">
            <h1>This is home</h1>
          </div>

          <aside className="right-sidebar">
            <div className="moderator-dashboard">
              <h4><Link to="/ModeratorDashboard">Moderator Dashboard</Link></h4>
            </div>
            <div className="notifications">
              <h3>Notifications</h3>
              <ul>
                <li>You have a new follower</li>
                <li>You have a new like</li>
                <li>New flagged content</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ModeraterHome;
