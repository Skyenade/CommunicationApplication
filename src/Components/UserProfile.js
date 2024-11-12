import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth';
import Header from './Header';
import { database } from '../firebase';
import { ref, onValue, set, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = ref(database, `users/${userId}`);
        const eventsRef = ref(database, 'events');
        const attendanceRef = ref(database, `users/${userId}/attendanceHistory`);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUser(data);
            setUsername(data.username || '');
            setBio(data.bio || '');
            setProfileImageUrl(data.profileImageUrl || '');
          }
        });

        onValue(eventsRef, (snapshot) => {
          const allEvents = snapshot.val();
          const userEvents = Object.values(allEvents || {}).filter(event => event.userId === userId);
          setEvents(userEvents);
        });

        onValue(attendanceRef, (snapshot) => {
          const history = snapshot.val();
          setAttendanceHistory(history ? Object.values(history) : []);
        });
      } else {
        console.error('No user is logged in.');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userRef = ref(database, `users/${userId}`);
      const attendanceRef = ref(database, `users/${userId}/attendanceHistory`);

      let imageUrl = profileImageUrl;
      if (newProfileImage) {
        if (profileImageUrl) {
          const oldImageRef = storageRef(storage, profileImageUrl);
          await deleteObject(oldImageRef).catch(error => console.error('Error deleting old image:', error));
        }

        const newImageRef = storageRef(storage, `profileImages/${userId}`);
        await uploadBytes(newImageRef, newProfileImage);
        imageUrl = await getDownloadURL(newImageRef);
        setProfileImageUrl(imageUrl);
      }

      await set(userRef, {
        ...user,
        username,
        bio,
        profileImageUrl: imageUrl,
      }).then(() => {
        alert('Profile updated successfully!');
        setNewProfileImage(null);
      }).catch(error => {
        console.error('Error updating profile:', error);
      });

      // Update attendance history if needed (modify logic as per requirements)
      await set(attendanceRef, attendanceHistory).catch(error => console.error('Error updating attendance history:', error));
    }
  };

  const handleDeleteProfileImage = async () => {
    if (profileImageUrl) {
      const profileImageRef = storageRef(storage, profileImageUrl);
      await deleteObject(profileImageRef).then(() => {
        setProfileImageUrl(null);
        alert('Profile picture deleted successfully.');
      }).catch(error => console.error('Error deleting profile picture:', error));
    }
  };

  const handleDeleteAccount = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      try {
        if (profileImageUrl) {
          const profileImageRef = storageRef(storage, profileImageUrl);
          await deleteObject(profileImageRef);
        }

        await remove(ref(database, `users/${userId}`));
        await deleteUser(auth.currentUser);
        alert('Account deleted successfully.');
      } catch (error) {
        console.error("Error deleting account:", error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  return (

    <div>
      <Header />
      <div className="user-profile">
        <div className="user-details">
          {user ? (
            <>
              <h1>Hello, {username || 'User'}</h1>
              <p>Your email: {user.email}</p>

              <p>Update your username:</p>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Update your username"
              />

              <p>Your bio:</p>
              <textarea
                value={bio}
                onChange={handleBioChange}
                placeholder="Update your bio"
                className="create-event-textarea"
              />

              <h2>Your Previous Events:</h2>
              <ul>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <li key={index}>
                      <strong>{event.title}</strong> on {event.dateTime}
                    </li>
                  ))
                ) : (
                  <p>No previous events found.</p>
                )}
              </ul>

              <h2>Attendance History:</h2>
              <ul>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))
                ) : (
                  <p>No attendance history available.</p>
                )}
              </ul>

              <button className="save-changes-btn" onClick={handleSaveChanges}>Save Changes</button>
            </>
          ) : (
            <p>Loading user data...</p>

            //     <div> 
            //       <Header/>
            //     <div className="user-profile">
            //       <div className="user-details">
            //         {user ? (
            //           <>
            //             <h1>Hello, {user.username || 'User'}</h1>
            //             <p>Your email: {user.email}</p>

            //             <p>Your bio:</p>
            //             <textarea
            //               value={bio}
            //               onChange={handleBioChange}
            //               placeholder="Update your bio"
            //               className="create-event-textarea"
            //             />
            //             <h2>Your Previous Events:</h2>
            //             <ul>
            //               {events.length > 0 ? (
            //                 events.map((event, index) => (
            //                   <li key={index}>
            //                     <strong>{event.title}</strong> on {event.dateTime}
            //                   </li>
            //                 ))
            //               ) : (
            //                 <p>No previous events found.</p>
            //               )}

            //             </ul>
            //             {/* <button onClick={handleAddEvent}>Add Event</button> */}
            //             <button className="save-changes-btn" onClick={handleSaveChanges}>Save Changes</button>
            //           </>
            //         ) : (
            //           <p>Loading user data...</p>
            //         )}
            //       </div>

            //       <div className="user-profile-actions">
            //         {profileImageUrl ? (
            //           <img src={profileImageUrl} alt="Profile" className="profile-image" />
            //         ) : (
            //           <p>No profile picture set.</p>
            //         )}

            //         <div className="profile-image-actions">
            //           <label htmlFor="profileImageUpload" className="choose-file-label">
            //             Change Profile Picture
            //           </label>
            //           <input
            //             type="file"
            //             accept="image/*"
            //             id="profileImageUpload"
            //             onChange={handleProfileImageChange}
            //             style={{ display: 'none' }}
            //           />
            //           <button onClick={handleDeleteProfileImage} className="delete-picture-btn">Delete Picture</button>
          )}
        </div>

        <div className="user-profile-actions">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" className="profile-image" />
          ) : (
            <p>No profile picture set.</p>
          )}

          <div className="profile-image-actions">
            <label htmlFor="profileImageUpload" className="choose-file-label">
              Change Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              id="profileImageUpload"
              onChange={handleProfileImageChange}
              style={{ display: 'none' }}
            />
            <button onClick={handleDeleteProfileImage} className="delete-picture-btn">Delete Picture</button>
          </div>

          <button onClick={handleDeleteAccount} className="delete-account-btn">Delete Your Account</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;