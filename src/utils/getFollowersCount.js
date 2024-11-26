
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
            console.log(`El usuario ${userId} no tiene seguidores.`);
            return 0; // 
        }
    } catch (error) {
        console.error(`Error al obtener los seguidores del usuario ${userId}:`, error);
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
            console.log(`El usuario ${userId} no sigue a nadie.`);
            return 0; 
        }
    } catch (error) {
        console.error(`Error getting user's following ${userId}:`, error);
        return 0;
    }
};
