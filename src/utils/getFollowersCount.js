// src/utils/getFollowersCount.js
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';  //

// Function to get the number of followers of a user
const getFollowersCount = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);  // Get the user's document reference
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const followers = userSnap.data().followers || [];  // Get the list of followers
            return followers.length;  // Returns the number of followers
        } else {
            console.log('El usuario no existe');
            return 0;  // If the user does not exist, we return 0 followers
        }
    } catch (error) {
        console.error('Error al obtener los seguidores:', error);
        return 0;
    }
};

export default getFollowersCount;
