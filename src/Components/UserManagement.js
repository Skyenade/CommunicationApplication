import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import './UserManagement.css';

import { ref, get, set, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

const UserManagement = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const storage = getStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = 'USER_ID'; //team we need to fetch the user id from firebase
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUser(data);
        setBio(data.bio || '');
        setProfileImageUrl(data.profileImageUrl || '');
      } else {
        console.log("No user data available");
      }
    };
    
    fetchUserData();
  }, []);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      if (profileImageUrl) {
        const profileImageRef = storageRef(storage, profileImageUrl);
        await deleteObject(profileImageRef).catch((error) => console.error('Error deleting image:', error));
      }
      const userId = 'USER_ID'; // Replace with actual user ID
      await remove(ref(database, `users/${userId}`))
        .then(() => {
          alert('Account deleted successfully.');
          
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    }
  };

  const handleSaveChanges = async () => {
    const userId = 'USER_ID'; 
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      ...user,
      bio: bio,
      profileImageUrl: profileImageUrl, 
    })
    .then(() => {
      alert('Profile updated successfully!');
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
    });
  };

  return (
    <div className="user-profile">
      <div className="user-details">
        {user ? (
          <>
            <h1>Hello, {user.username}</h1>
            <p>Your email: {user.email} | Your password: ******</p>
            <p>Your bio:</p>
            <textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="Update your bio"
              className="create-event-textarea"
            />
            <h2>Your Previous Events:</h2>
            <ul>
              {user.previousEvents ? user.previousEvents.map((event, index) => (
                <li key={index}>{event.title} on {event.dateTime}</li>
              )) : <p>No previous events found.</p>}
            </ul>
            <button className="save-changes-btn" onClick={handleSaveChanges}>Save Changes</button>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
  
      <div className="user-profile-actions">
        {profileImageUrl && <img src={profileImageUrl} alt="Profile" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button>Delete Your Picture</button>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Your Account</button>
      </div>
    </div>
  );
  
};

export default UserManagement;
