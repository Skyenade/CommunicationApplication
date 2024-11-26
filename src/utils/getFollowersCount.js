
import { ref, get } from "firebase/database";
import { database } from "../firebase"; 


export const getFollowersCount = async (userId) => {
    try {
       
        const followersRef = ref(database, `users/${userId}/followers`);
        const snapshot = await get(followersRef);

        if (snapshot.exists()) {
            const followersData = snapshot.val();
            return Object.keys(followersData).length;
        } else {
            console.log(`User ${userId} has no followers.`);
            return 0; 
        }
    } catch (error) {
        console.error(`Error getting followers for user ${userId}:`, error);
        return 0;
    }
};


export const getFollowingCount = async (userId) => {
    try {

        const followingRef = ref(database, `users/${userId}/following`);
        const snapshot = await get(followingRef);

        if (snapshot.exists()) {
            const followingData = snapshot.val();
            return Object.keys(followingData).length; 
        } else {
            console.log(`User ${userId} is not following anyone.`);
            return 0; 
        }
    } catch (error) {
        console.error(`Error getting followings for user ${userId}:`, error);
        return 0;
    }
};
