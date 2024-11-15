import { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { database } from '../firebase';

const useFollow = (currentUser) => {
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        if (currentUser) {
            const fetchFollowingData = async () => {
                const userRef = ref(database, "users/" + currentUser.uid);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setFollowing(snapshot.val().following || []);
                    setFollowers(snapshot.val().followers || []);
                }
            };
            fetchFollowingData();
        }
    }, [currentUser]);

    const followUser = async (userId) => {
        const currentUserRef = ref(database, "users/" + currentUser.uid);
        const userToFollowRef = ref(database, "users/" + userId);
        await update(currentUserRef, { following: [...following, userId] });
        await update(userToFollowRef, { followers: [currentUser.uid] });
        setFollowing(prev => [...prev, userId]);
    };

    const unfollowUser = async (userId) => {
        const currentUserRef = ref(database, "users/" + currentUser.uid);
        const userToUnfollowRef = ref(database, "users/" + userId);
        await update(currentUserRef, { following: following.filter(id => id !== userId) });
        await update(userToUnfollowRef, { followers: followers.filter(id => id !== currentUser.uid) });
        setFollowing(prev => prev.filter(id => id !== userId));
    };

    return { following, followers, followUser, unfollowUser };
};

export default useFollow;
