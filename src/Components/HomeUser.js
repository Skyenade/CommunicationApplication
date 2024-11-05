import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";

const HomeUser = () => {
  return (
    <div className="user-home-container">
      <Header />

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

      <div className="main-content-container">
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
              <input type="text" placeholder="Choose your location" />  {/* Maps API in iteration 2 */}
            </div>
          </div>
        </aside>

        <div className="content-area">        
          <aside className="right-sidebar">            
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

      </div>


    </div>
  );
};

export default HomeUser;
