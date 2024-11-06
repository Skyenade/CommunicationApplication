import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";

const HomeUser = () => {
  return (
    
    <div className="">
      <Header />

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
            </div><h3 className="feeds">View Events feeds here</h3><div>


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
