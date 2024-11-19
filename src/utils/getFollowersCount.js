// src/utils/getFollowersCount.js
import { ref, get } from "firebase/database";
import { database } from "../firebase"; // Asegúrate de que `database` esté correctamente configurado

// Función para obtener la cantidad de seguidores de un usuario
export const getFollowersCount = async (userId) => {
    try {
        // Referencia al nodo de "followers" del usuario en Realtime Database
        const followersRef = ref(database, `users/${userId}/followers`);
        const snapshot = await get(followersRef);

        if (snapshot.exists()) {
            const followersData = snapshot.val();
            return Object.keys(followersData).length; // Devuelve la cantidad de followers
        } else {
            console.log(`El usuario ${userId} no tiene seguidores.`);
            return 0; // Si no hay seguidores, retornamos 0
        }
    } catch (error) {
        console.error(`Error al obtener los seguidores del usuario ${userId}:`, error);
        return 0;
    }
};

// Función para obtener la cantidad de personas que sigue el usuario
export const getFollowingCount = async (userId) => {
    try {
        // Referencia al nodo de "following" del usuario en Realtime Database
        const followingRef = ref(database, `users/${userId}/following`);
        const snapshot = await get(followingRef);

        if (snapshot.exists()) {
            const followingData = snapshot.val();
            return Object.keys(followingData).length; // Devuelve la cantidad de following
        } else {
            console.log(`El usuario ${userId} no sigue a nadie.`);
            return 0; // Si no hay following, retornamos 0
        }
    } catch (error) {
        console.error(`Error al obtener los seguidos del usuario ${userId}:`, error);
        return 0;
    }
};
