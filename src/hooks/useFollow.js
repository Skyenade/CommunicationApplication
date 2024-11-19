import { ref, set, remove } from "firebase/database";
import { database } from "../firebase";

export const followUser = async (currentUserId, userIdToFollow) => {
    const followingRef = ref(database, `users/${currentUserId}/following/${userIdToFollow}`);
    const followersRef = ref(database, `users/${userIdToFollow}/followers/${currentUserId}`);

    try {
        await set(followingRef, true);
        await set(followersRef, true);
    } catch (error) {
        console.error("Error following the user:", error);
        throw error;
    }
};

export const unfollowUser = async (currentUserId, userIdToUnfollow) => {
    const followingRef = ref(database, `users/${currentUserId}/following/${userIdToUnfollow}`);
    const followersRef = ref(database, `users/${userIdToUnfollow}/followers/${currentUserId}`);

    try {
        await remove(followingRef);
        await remove(followersRef);
    } catch (error) {
        console.error("Error unfollowing the user:", error);
        throw error;
    }
};
