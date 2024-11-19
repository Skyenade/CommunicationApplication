import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import Header from "./Header";

const MyFollowers = ({ userId }) => {
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const followersRef = ref(database, `users/${userId}/followers`);
                const snapshot = await get(followersRef);
                if (snapshot.exists()) {
                    const followersData = snapshot.val();

                    // followers details
                    const followersArray = await Promise.all(
                        Object.keys(followersData).map(async (followerId) => {
                            const userRef = ref(database, `users/${followerId}`);
                            const userSnapshot = await get(userRef);
                            return userSnapshot.exists()
                                ? { id: followerId, ...userSnapshot.val() }
                                : null;
                        })
                    );

                    setFollowers(followersArray.filter((follower) => follower !== null));
                } else {
                    setFollowers([]); // No followers
                }
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };

        fetchFollowers();
    }, [userId]);

    return (
        <div>
            <Header/>
            <h1>My Followers</h1>
            {followers.length > 0 ? (
                <ul>
              
                    {followers.map((follower) => (
                        <li key={follower.id}>
                            {follower.username} ({follower.email})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no followers.</p>
            )}
        </div>
    );
};

export default MyFollowers;
