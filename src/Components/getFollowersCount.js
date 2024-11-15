import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase"; 
const getFollowersCount = async (userId) => {
  try {
    if (!userId) {
      console.warn("User ID is undefined or invalid.");
      return 0;
    }

   
    const docRef = doc(firestore, `users/${userId}`);
    const docSnap = await getDoc(docRef);

    
    if (docSnap.exists()) {
      return docSnap.data()?.followersCount || 0; 
    } else {
      console.warn(`No document found for userId: ${userId}`);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching followers count:", error);
    return 0;r
  }
};

export default getFollowersCount;