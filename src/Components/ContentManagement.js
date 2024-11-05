// src/components/ContentManagement.js
import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; 
import { ref, get, update, remove } from 'firebase/database'; 
import './ContentManagement.css'; 

const ContentManagement = () => {
    const [flaggedPosts, setFlaggedPosts] = useState([]);

    useEffect(() => {
        const fetchFlaggedPosts = async () => {
            const flaggedPostsRef = ref(database, 'flaggedPosts');
            const snapshot = await get(flaggedPostsRef);
            if (snapshot.exists()) {
                const posts = [];
                snapshot.forEach((childSnapshot) => {
                    posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
                });
                setFlaggedPosts(posts);
            } else {
                console.log("No flagged posts found.");
            }
        };

        fetchFlaggedPosts();
    }, []);

    const handleWarning = async (id) => {
        try {
            const postRef = ref(database, `flaggedPosts/${id}`);
            await update(postRef, { warningIssued: true });
            console.log(`Warning issued to post ID: ${id}`);
        } catch (error) {
            console.error('Error issuing warning:', error);
        }
    };

    const handleRemove = async (id) => {
        try {
            await remove(ref(database, `flaggedPosts/${id}`));
            setFlaggedPosts(flaggedPosts.filter(post => post.id !== id)); 
            console.log(`Post ID ${id} removed`);
        } catch (error) {
            console.error('Error removing post:', error);
        }
    };

    const handleSuspend = async (userId) => {
        try {
            const userRef = ref(database, `users/${userId}`);
            await update(userRef, { status: 'suspended' });
            console.log(`User ID ${userId} suspended`);
        } catch (error) {
            console.error('Error suspending user:', error);
        }
    };

    const handleDismissReport = async (id) => {
        try {
            const postRef = ref(database, `flaggedPosts/${id}`);
            await update(postRef, { reportDismissed: true });
            console.log(`Report dismissed for post ID: ${id}`);
        } catch (error) {
            console.error('Error dismissing report:', error);
        }
    };

    return (
        <div className="content-management"> {}
            <h1>Admin Dashboard</h1> {}
            <h3>Flagged Posts and Comments</h3>
            <table className="flagged-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flaggedPosts.length > 0 ? (
                        flaggedPosts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.user}</td>
                                <td>{post.email}</td>
                                <td>{post.date}</td>
                                <td>{post.type}</td>
                                <td>{post.content}</td>
                                <td>
                                    <button className="action-btn warning-btn" onClick={() => handleWarning(post.id)}>Warning</button>
                                    <button className="action-btn remove-btn" onClick={() => handleRemove(post.id)}>Remove</button>
                                    <button className="action-btn suspend-btn" onClick={() => handleSuspend(post.userId)}>Suspend Account</button>
                                    <button className="action-btn dismiss-btn" onClick={() => handleDismissReport(post.id)}>Dismiss Report</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic' }}>No flagged posts available</td>
                            <td>
                                <button className="action-btn warning-btn" onClick={() => console.log('Placeholder Warning')}>Warning</button>
                                <button className="action-btn remove-btn" onClick={() => console.log('Placeholder Remove')}>Remove</button>
                                <button className="action-btn suspend-btn" onClick={() => console.log('Placeholder Suspend')}>Suspend Account</button>
                                <button className="action-btn dismiss-btn" onClick={() => console.log('Placeholder Dismiss')}>Dismiss Report</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ContentManagement; 

//file not uploaded