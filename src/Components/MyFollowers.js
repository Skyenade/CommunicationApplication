import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";

const MyFollowers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
          const userId = "yourUserId"; //Change this to the ID of the authenticated user
        const followersRef = ref(database, `users/${userId}/followers`);
        const snapshot = await get(followersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
            // We convert the object into an array of followers
          const followersList = Object.keys(data).filter((key) => data[key]);
          setFollowers(followersList);
        } else {
          console.log("No followers found.");
          setFollowers([]);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  return (
    <div>
      <h2>My Followers</h2>
      {loading ? (
        <p>Loading followers...</p>
      ) : followers.length > 0 ? (
        <ul>
          {followers.map((followerId) => (
            <li key={followerId}>{followerId}</li>
          ))}
        </ul>
      ) : (
        <p>No followers yet.</p>
      )}
    </div>
  );
};

export default MyFollowers;
