import { ref, set, remove } from "firebase/database";
import { database } from "../firebase";

// Función para seguir a un usuario
export const followUser = async (currentUserId, userIdToFollow) => {
    const followingRef = ref(database, `users/${currentUserId}/following/${userIdToFollow}`);
    const followersRef = ref(database, `users/${userIdToFollow}/followers/${currentUserId}`);

    try {
        // Agregar usuario a las listas de siguiendo y seguidores
        await set(followingRef, true);
        await set(followersRef, true);
    } catch (error) {
        console.error("Error al seguir al usuario:", error);
        throw error; // Permite manejar errores donde se llame esta función
    }
};

// Función para dejar de seguir a un usuario
export const unfollowUser = async (currentUserId, userIdToUnfollow) => {
    const followingRef = ref(database, `users/${currentUserId}/following/${userIdToUnfollow}`);
    const followersRef = ref(database, `users/${userIdToUnfollow}/followers/${currentUserId}`);

    try {
        // Eliminar usuario de las listas de siguiendo y seguidores
        await remove(followingRef);
        await remove(followersRef);
    } catch (error) {
        console.error("Error al dejar de seguir al usuario:", error);
        throw error; // Permite manejar errores donde se llame esta función
    }
};
