import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export const useRealTimeCounts = (userId) => {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const followersRef = ref(database, `users/${userId}/followers`);
        const followingRef = ref(database, `users/${userId}/following`);

        const followersListener = onValue(followersRef, (snapshot) => {
            setFollowersCount(snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
        });

        const followingListener = onValue(followingRef, (snapshot) => {
            setFollowingCount(snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
        });

        return () => {
            followersListener();
            followingListener();
        };
    }, [userId]);

    return { followersCount, followingCount };
};
