import React, { useState, useEffect } from "react";
import { ref as refDB, onValue, get } from "firebase/database";
import { database } from "../firebase";
import useAuth from "../hooks/useAuth";
import "../Style.css";
import Header from "./Header";

const MyFollowers = () => {
    const currentUser = useAuth(); // Current user
    const [followers, setFollowers] = useState([]); // List of followers with details
    const [loading, setLoading] = useState(true); // State of charge

    useEffect(() => {
        if (!currentUser) return;

        // Reference to the follower node
        const followersRef = refDB(database, `users/${currentUser.uid}/followers`);

        // Listen for changes on the follower node
        const unsubscribe = onValue(followersRef, (snapshot) => {
            const followersData = snapshot.val();
            if (followersData) {
                const followerIds = Object.keys(followersData);

                Promise.all(
                    followerIds.map(async (userId) => {
                        const userRef = refDB(database, `users/${userId}`);
                        const userSnapshot = await get(userRef);
                        const userData = userSnapshot.val();
                        return {
                            id: userId,
                            name: userData?.name || "Unknown",
                        };
                    })
                ).then((details) => {
                    setFollowers(details);
                    setLoading(false);
                });
            } else {
                setFollowers([]); // No followers
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Clean Listening
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="myfollowers-container">
            <Header />
            <h2>My Followers</h2>
            <p>Total followers: {followers.length}</p> {/* Show total number */}
            {followers.length > 0 ? (
                <ul>
                    {followers.map((follower) => (
                        <li key={follower.id} className="follower-item">
                            <span>{follower.name}</span> {/* show name*/}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no followers yet.</p>
            )}
        </div>
    );
};

export default MyFollowers;
