import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; 
import { ref, get, update, remove } from 'firebase/database'; 
import './ModeratorDashboard.css'; 

const ContentManagement = () => {
    // Dummy data to display initially
    const flaggedItems = [
        {
            id: "1",
            userId: "jassi",
            username: "Jaspreet",
            email: "jaspreet@gmailcom",
            date: "2024-11-01",
            type: "Post",
            content: "Inappropriate content example"
        }
    ];

    // const [flaggedItems, setFlaggedItems] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    // Uncomment this section for real data from Firebase
    // useEffect(() => {
    //     const fetchFlaggedPosts = async () => {
    //         const flaggedPostsRef = ref(database, 'flaggedPosts');
    //         const snapshot = await get(flaggedPostsRef);
    //         if (snapshot.exists()) {
    //             const posts = [];
    //             snapshot.forEach((childSnapshot) => {
    //                 posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
    //             });
    //             setFlaggedItems(posts);
    //         } else {
    //             console.log("No flagged posts found.");
    //         }
    //     };

    //     const fetchUserDetails = async () => {
    //         const usersRef = ref(database, 'users');
    //         const snapshot = await get(usersRef);
    //         if (snapshot.exists()) {
    //             const users = {};
    //             snapshot.forEach((userSnapshot) => {
    //                 const { username, email } = userSnapshot.val();
    //                 users[userSnapshot.key] = { username, email };
    //             });
    //             setUserDetails(users);
    //         } else {
    //             console.log("No users found.");
    //         }
    //     };

    //     fetchFlaggedPosts();
    //     fetchUserDetails();
    // }, []);

    const handleAction = (action, id, userId) => {
        const postRef = ref(database, `flaggedPosts/${id}`);

        switch (action) {
            case 'Warning':
                update(postRef, { warningIssued: true });
                alert("Warning issued to the user.");
                break;
            case 'Remove':
                if (window.confirm("Are you sure you want to remove the content?")) {
                    remove(postRef)
                        .then(() => {
                            // Uncomment this line to update state when real data is fetched from Firebase
                            // setFlaggedItems(flaggedItems.filter(post => post.id !== id));
                            alert("Selected Content removed successfully.");
                        });
                }
                break;
            case 'Suspend':
                const userRef = ref(database, `users/${userId}`);
                update(userRef, { status: 'suspended' });
                alert("User suspended.");
                break;
            case 'Dismiss':
                update(postRef, { reportDismissed: true });
                alert("Report dismissed successfully.");
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
                                    <td>{post.username || "N/A"}</td>
                                    <td>{post.email || "N/A"}</td>
                                    <td>{post.date}</td>
                                    <td>{post.type}</td>
                                    <td>{post.content}</td>
                                    <td>
            <button className="actionButton warning-btn" onClick={() => handleAction('Warning', post.id)}>Warning</button>
            <button className="actionButton remove-btn" onClick={() => handleAction('Remove', post.id)}>Remove</button>
            <button className="actionButton suspend-btn" onClick={() => handleAction('Suspend', post.id, post.userId)}>Suspend Account</button>
             <button className="actionButton dismiss-btn" onClick={() => handleAction('Dismiss', post.id)}>Dismiss Report</button>
            </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No flagged posts available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentManagement;
