import { useEffect, useState } from "react";
import { ref as refDB, onValue, get } from "firebase/database";
import { database } from "../firebase";
import useAuth from "./useAuth";

const useFollowers = () => {
    const { currentUser } = useAuth();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const followersRef = refDB(database, `users/${currentUser.uid}/followers`);
        const followingRef = refDB(database, `users/${currentUser.uid}/following`);

        const unsubscribeFollowers = onValue(followersRef, (snapshot) => {
            const followersData = snapshot.val();
            if (followersData) {
                setFollowers(Object.keys(followersData));
            } else {
                setFollowers([]);
            }
        });

        const unsubscribeFollowing = onValue(followingRef, (snapshot) => {
            const followingData = snapshot.val();
            if (followingData) {
                setFollowing(Object.keys(followingData));
            } else {
                setFollowing([]);
            }
        });

        setLoading(false);

        return () => {
            unsubscribeFollowers();
            unsubscribeFollowing();
        };
    }, [currentUser]);

    return { followers, following, loading };
};

export default useFollowers;
