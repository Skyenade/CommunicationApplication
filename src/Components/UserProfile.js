import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import './UserProfile.css';
import { ref, get, set, update, remove } from "firebase/database";
import { getAuth, updateEmail } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "Maspreet Singh",
    email: "jaspreet@example.com",
    previousEvents: [
      { title: "Sample Event 1", dateTime: "2024-01-01 10:00 AM" },
      { title: "Sample Event 2", dateTime: "2024-02-15 3:00 PM" },
    ],
  });
  const [bio, setBio] = useState('This is a sample bio.');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = 'USER_ID';
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

  const handleBioChange = (e) => setBio(e.target.value);
  const handleUsernameChange = (e) => setUser({ ...user, username: e.target.value });
  const handleEmailChange = (e) => setUser({ ...user, email: e.target.value });
  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...user.previousEvents];
    updatedEvents[index][field] = value;
    setUser({ ...user, previousEvents: updatedEvents });
  };

  const handleAddEvent = () => {
    const newEvent = { title: "New Event", dateTime: new Date().toISOString() };
    setUser({ ...user, previousEvents: [...user.previousEvents, newEvent] });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    const userId = 'USER_ID';
    const userRef = ref(database, `users/${userId}`);

    // Update profile image if there's a new one
    let updatedProfileImageUrl = profileImageUrl;
    if (profileImage) {
      const imageRef = storageRef(storage, `profileImages/${userId}`);
      await uploadBytes(imageRef, profileImage);
      updatedProfileImageUrl = await getDownloadURL(imageRef);
      setProfileImageUrl(updatedProfileImageUrl);
    }

    // Update email in Firebase Authentication
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email !== user.email) {
      try {
        await updateEmail(currentUser, user.email);
        console.log("Email updated in Firebase Auth");
      } catch (error) {
        console.error("Error updating email in Firebase Auth:", error);
        return; // Stop further updates if there's an error
      }
    }

    // Update profile in Firebase Database
    await update(userRef, {
      ...user,
      bio: bio,
      profileImageUrl: updatedProfileImageUrl,
    })
      .then(() => {
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  const handleDeleteAccount = async () => {
    const userId = 'USER_ID';
    if (profileImageUrl) {
      const profileImageRef = storageRef(storage, profileImageUrl);
      await deleteObject(profileImageRef).catch((error) => console.error('Error deleting image:', error));
    }
    await remove(ref(database, `users/${userId}`))
      .then(() => {
        alert('Account deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
      });
  };

  return (
    <div className="user-profile">
      <div className="user-details">
        {user ? (
          <>
            <h1>Hello,</h1>
            <input
              type="text"
              value={user.username}
              onChange={handleUsernameChange}
              placeholder="Update your name"
            />
            <input
              type="email"
              value={user.email}
              onChange={handleEmailChange}
              placeholder="Update your email"
            />
            <p>Your password: ******</p>
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
                <li key={index}>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                    placeholder="Event Title"
                  />
                  <input
                    type="text"
                    value={event.dateTime}
                    onChange={(e) => handleEventChange(index, 'dateTime', e.target.value)}
                    placeholder="Event Date & Time"
                  />
                </li>
              )) : <p>No previous events found.</p>}
            </ul>
            <button onClick={handleAddEvent}>Add Event</button>
            <button className="save-changes-btn" onClick={handleSaveChanges}>Save Changes</button>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="user-profile-actions">
        {profileImageUrl && <img src={profileImageUrl} alt="Profile" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={() => setProfileImage(null)}>Delete Your Picture</button>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Your Account</button>
      </div>
    </div>
  );
};

export default UserProfile;
