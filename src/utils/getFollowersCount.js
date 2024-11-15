// src/utils/getFollowersCount.js
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';  // Asegúrate de tener correctamente importada tu configuración de Firestore

// Función para obtener el número de seguidores de un usuario
const getFollowersCount = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);  // Obtén la referencia del documento del usuario
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const followers = userSnap.data().followers || [];  // Obtén la lista de seguidores
            return followers.length;  // Devuelve la cantidad de seguidores
        } else {
            console.log('El usuario no existe');
            return 0;  // Si el usuario no existe, retornamos 0 seguidores
        }
    } catch (error) {
        console.error('Error al obtener los seguidores:', error);
        return 0;
    }
};

export default getFollowersCount;
