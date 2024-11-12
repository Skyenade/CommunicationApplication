import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";

import Header from "../Components/Header";
import useAuth from "../hooks/useAuth";  // Importar el hook de autenticación
import EventFeed from "./EventFeed";
import '../Style.css';

const HomeUser = () => {

  const currentUser = useAuth();  // Hook para obtener el usuario autenticado
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [following, setFollowing] = useState([]); // Estado para almacenar usuarios seguidos

  useEffect(() => {
    if (currentUser) {
      const fetchFollowing = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
          if (userDoc.exists()) {
            setFollowing(userDoc.data().following || []); // Cargar usuarios seguidos del usuario actual
          }
        } catch (error) {
          console.error("Error fetching following list:", error);
        }
      };
      fetchFollowing();
    }
  }, [currentUser]);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("username", "==", searchTerm));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No users found with that username.");
      } else {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setUserResults(results);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const followUser = async (userId) => {
    if (!currentUser) return;

    try {
      const currentUserRef = doc(firestore, "users", currentUser.uid);
      const userToFollowRef = doc(firestore, "users", userId);

      // Agrega el ID del usuario seguido a ambos usuarios
      await updateDoc(currentUserRef, { following: arrayUnion(userId) });
      await updateDoc(userToFollowRef, { followers: arrayUnion(currentUser.uid) });

      setFollowing((prev) => [...prev, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async (userId) => {
    if (!currentUser) return;

    try {
      const currentUserRef = doc(firestore, "users", currentUser.uid);
      const userToUnfollowRef = doc(firestore, "users", userId);

      // Elimina el ID del usuario de ambos arrays
      await updateDoc(currentUserRef, { following: arrayRemove(userId) });
      await updateDoc(userToUnfollowRef, { followers: arrayRemove(currentUser.uid) });

      setFollowing((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  // Muestra mensaje de carga si currentUser es null
  if (!currentUser) {
    return <div>Loading...</div>;  // Esto se muestra si currentUser es null
  }

  return (
    <div className="homeuser-container">
      <Header />
      <div className="homeuser-navbar-actions">
     
        {/* Mostrar información del usuario autenticado */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search for users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="Search-button" onClick={handleSearch}>Search</button>
        <button className="create-event-button">
          <h4><Link to="/CreateEvent" className="links">Create An Event</Link></h4>
        </button>
      </div>

      <div className="search-results">
        {userResults.length > 0 ? (
          userResults.map((user) => (
            <div key={user.id} className="user-result">
              <span>{user.username}</span>
              {following.includes(user.id) ? (
                <button onClick={() => unfollowUser(user.id)}>Unfollow</button>
              ) : (
                <button onClick={() => followUser(user.id)}>Follow</button>
              )}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      <div className="homeuser-content">
        <div className="homeuser-choose-options">
          <label>
            <input type="radio" name="options" value="Option 1" />
            Events by followers
          </label>
          <br />
          <label>
            <input type="radio" name="options" value="Option 2" />
            Events by Location
          </label>
          <br />
          <div className="location">
            <label>Current Location:</label><br />
            <input type="text" placeholder="Choose your location" />
          </div>
        </div>

        <div className="event-feed">
          <EventFeed />
        </div>

        <div className="Home_Notification">
          <div className="notifications">
            <h3>Notifications</h3>
            <ul>
              <li>You have a new follower</li>
              <li>You have a new like</li>
              <li>New flagged content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
