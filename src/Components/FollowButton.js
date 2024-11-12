import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const FollowButton = ({ userToFollowID }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const currentUserID = auth.currentUser.uid;

    useEffect(() => {
        const checkFollowStatus = async () => {
            const userDoc = doc(db, 'users', userToFollowID);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                if (userData.followers && userData.followers.includes(currentUserID)) {
                    setIsFollowing(true);
                }
            }
        };
        checkFollowStatus();
    }, [userToFollowID, currentUserID]);

    const followUser = async () => {
        const userDoc = doc(db, 'users', userToFollowID);
        await updateDoc(userDoc, {
            followers: arrayUnion(currentUserID)
        });
        setIsFollowing(true);
    };

    const unfollowUser = async () => {
        const userDoc = doc(db, 'users', userToFollowID);
        await updateDoc(userDoc, {
            followers: arrayRemove(currentUserID)
        });
        setIsFollowing(false);
    };

    return (
        <button onClick={isFollowing ? unfollowUser : followUser}>
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
};

export default FollowButton;
