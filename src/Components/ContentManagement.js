import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import "./ContentManagement.css";

const ContentManagement = () => {
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  
  useEffect(() => {
    const flaggedPostsRef = ref(database, "flaggedPosts");
    const usersRef = ref(database, "users");

    
    const unsubscribeFlaggedPosts = onValue(flaggedPostsRef, (snapshot) => {
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach((childSnapshot) => {
          posts.push({ id: childSnapshot.key, ...childSnapshot.val() }); // Include Firebase ID
        });
        setFlaggedItems(posts);
      } else {
        setFlaggedItems([]); 
        console.log("No flagged posts found.");
      }
    });

    const fetchUserDetails = () => {
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const users = {};
          snapshot.forEach((userSnapshot) => {
            const { username, email, warning } = userSnapshot.val();
            users[userSnapshot.key] = { username, email, warning };
          });
          setUserDetails(users);
        } else {
          console.log("No users found.");
        }
      });
    };

    fetchUserDetails();


    return () => unsubscribeFlaggedPosts();
  }, []);

  const handleAction = (action, id, userId) => {
    const postRef = ref(database, `flaggedPosts/${id}`);
    const userRef = ref(database, `users/${userId}`);

    switch (action) {
      case "Warning":
        update(userRef, { warning: true })
          .then(() => alert("Warning issued to the user."))
          .catch((error) => console.error("Error issuing warning:", error));
        break;
      case "Remove":
        if (window.confirm("Are you sure you want to remove the content?")) {
          remove(postRef)
            .then(() => {
              setFlaggedItems(flaggedItems.filter((post) => post.id !== id));
              alert("Selected content removed successfully.");
            })
            .catch((error) => console.error("Error removing content:", error));
        }
        break;
      case "Suspend":
        update(userRef, { status: "suspended" })
          .then(() => alert("User suspended."))
          .catch((error) => console.error("Error suspending user:", error));
        break;
      case "Dismiss":
        update(postRef, { reportDismissed: true })
          .then(() => alert("Report dismissed successfully."))
          .catch((error) => console.error("Error dismissing report:", error));
        break;
      default:
        break;
    }
  };

  return (
    <div className="moderatorDashboard">
      <div className="content">
        <h1>Admin Dashboard</h1>
        <h2 className="table">Flagged Posts and Content</h2>
        <table className="flaggedPostsTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Date</th>
              <th>Type</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flaggedItems.length > 0 ? (
              flaggedItems.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{userDetails[post.userId]?.username || "Unknown User"}</td>
                  <td>{userDetails[post.userId]?.email || "No Email Available"}</td>
                  <td>{post.date || "No Date Provided"}</td>
                  <td>{post.type || "Unknown Type"}</td>
                  <td>{post.content || "No Content Available"}</td>
                  <td>
                    <button
                      className="actionButton warning-btn"
                      onClick={() => handleAction("Warning", post.id, post.userId)}
                    >
                      Warning
                    </button>
                    <button
                      className="actionButton remove-btn"
                      onClick={() => handleAction("Remove", post.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="actionButton suspend-btn"
                      onClick={() => handleAction("Suspend", post.id, post.userId)}
                    >
                      Suspend Account
                    </button>
                    <button
                      className="actionButton dismiss-btn"
                      onClick={() => handleAction("Dismiss", post.id)}
                    >
                      Dismiss Report
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No flagged posts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentManagement;