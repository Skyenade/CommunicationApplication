import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import { database } from '../firebase';
import { ref, onValue, set, remove, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import getFollowersCount from '../utils/getFollowersCount';
import useAuth from '../hooks/useAuth';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = getAuth();
  const storage = getStorage();
  // const currentUser = useAuth();


  const fetchFollowersCount = async (userId) => {
    const currentUserId = auth.currentUser.uid;
    const userRef = doc(db, "users", currentUserId);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFollowers(userData.followers || []);
        setFollowersCount(userData.followers.length);
      }
    } catch (error) {
      console.error("Error fetching followers: ", error);
    }


  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = ref(database, `users/${userId}`);
        const eventsRef = ref(database, 'events');

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

        // onValue(attendanceRef, (snapshot) => {
        //   const history = snapshot.val();
        //   setAttendanceHistory(history ? Object.values(history) : []);
        // });

        // onValue(followersRef, (snapshot) => {
        //   const followers = snapshot.val() || {};
        //   setFollowersCount(Object.keys(followers).length);
        // });
        // const fetchFollowersCount = async () => {
        //   const count = await getFollowersCount(userId);
        //   setFollowersCount(count);




        fetchFollowersCount(userId);
      } else {
        console.error('No user is logged in.');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const checkIfFollowing = (userId, followers) => {
    const currentUserId = auth.currentUser.uid;
    setIsFollowing(followers && followers.includes(currentUserId));
  };

  const handleFollow = async () => {
    if (auth.currentUser) {
      const currentUserId = auth.currentUser.uid;
      const userId = user.uid;

      try {
        await update(ref(database, `users/${userId}`), {
          followers: [...(user.followers || []), currentUserId]
        });

        await update(ref(database, `users/${currentUserId}`), {
          following: [...(user.following || []), userId]
        });

        setFollowersCount(prevCount => prevCount + 1);
        setIsFollowing(true);
        alert("You are now following this user!");
      } catch (error) {
        console.error("Error following user: ", error);
      }
    }
  };

  const handleUnfollow = async () => {
    if (auth.currentUser) {
      const currentUserId = auth.currentUser.uid;
      const userId = user.uid;

      try {
        await update(ref(database, `users/${userId}`), {
          followers: (user.followers || []).filter(id => id !== currentUserId)
        });

        await update(ref(database, `users/${currentUserId}`), {
          following: (user.following || []).filter(id => id !== userId)
        });

        setFollowersCount(prevCount => prevCount - 1);
        setIsFollowing(false);
        alert("You have unfollowed this user.");
      } catch (error) {
        console.error("Error unfollowing user: ", error);
      }
    }
  };

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
              
              {/* <button onClick={isFollowing ? handleUnfollow : handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button> */}

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