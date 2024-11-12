// src/Components/FollowButton.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';  // Asegúrate de importar tu configuración de Firebase
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const FollowButton = ({ userToFollowID }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const currentUserID = auth.currentUser.uid;  // ID del usuario actual (el que quiere seguir a otro)

    // Verificar si ya sigues al usuario al cargar el componente
    useEffect(() => {
        const checkFollowStatus = async () => {
            const userDoc = doc(db, 'users', userToFollowID);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                if (userData.followers && userData.followers.includes(currentUserID)) {
                    setIsFollowing(true);  // Ya estás siguiendo a este usuario
                }
            }
        };
        checkFollowStatus();
    }, [userToFollowID, currentUserID]);

    // Función para seguir al usuario
    const followUser = async () => {
        const userDoc = doc(db, 'users', userToFollowID);
        await updateDoc(userDoc, {
            followers: arrayUnion(currentUserID)  // Agrega el ID del usuario actual a la lista de seguidores
        });
        setIsFollowing(true);
    };

    // Función para dejar de seguir al usuario
    const unfollowUser = async () => {
        const userDoc = doc(db, 'users', userToFollowID);
        await updateDoc(userDoc, {
            followers: arrayRemove(currentUserID)  // Elimina el ID del usuario actual de la lista de seguidores
        });
        setIsFollowing(false);
    };

    return (
        <button onClick={isFollowing ? unfollowUser : followUser}>
            {isFollowing ? 'Dejar de seguir' : 'Seguir'}
        </button>
    );
};

export default FollowButton;
