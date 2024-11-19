import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export const useRealTimeFollowing = (userId) => {
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const followingRef = ref(database, `users/${userId}/following`);

        const listener = onValue(followingRef, (snapshot) => {
            if (snapshot.exists()) {
                setFollowing(Object.keys(snapshot.val()));
            } else {
                setFollowing([]);
            }
        });

        return () => listener();
    }, [userId]);

    return following;
};
