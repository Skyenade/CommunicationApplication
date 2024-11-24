import React, { useState, useEffect } from "react";
import { ref as refDB, onValue, get } from "firebase/database";
import { database } from "../firebase";
import useAuth from "../hooks/useAuth";
import "../Style.css";
import Header from "./Header";
import useFollowers from "../hooks/useFollowers"

const MyFollowers = () => {
    const { currentUser } = useAuth();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const followersRef = refDB(database, `users/${currentUser.uid}/followers`);
        const unsubscribe = onValue(followersRef, async (snapshot) => {
            const followersData = snapshot.val();

            if (followersData) {
                const followerIds = Object.keys(followersData);
                const details = await Promise.all(
                    followerIds.map(async (userId) => {
                        try {
                            const userRef = refDB(database, `users/${userId}`);
                            const userSnapshot = await get(userRef);
                            if (userSnapshot.exists()) {
                                const userData = userSnapshot.val();
                                return {
                                    id: userId,
                                    name: userData.username || "Unknown",
                                };
                            }
                            return { id: userId, name: "Unknown" };
                        } catch (error) {
                            console.error(`Error fetching data for user ${userId}:`, error);
                            return { id: userId, name: "Unknown" };
                        }
                    })
                );
                setFollowers(details);
            } else {
                setFollowers([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <Header />

            <div className="myfollowers-container">

                <h2 className="title">My Followers</h2>
                <div className="followers-summary">
                    <p>Total Followers: {followers.length}</p>
                    <ul className="followers-list">
                        {followers.length > 0 ? (
                            followers.map((follower) => (
                                <li key={follower.id} className="follower-item">
                                    <span>{follower.name}</span> {/* Access the follower's name */}
                                </li>
                            ))
                        ) : (
                            <li>No followers yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyFollowers;
