import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import HeaderAdmin from "./HeaderAdmin";
import { Link } from "react-router-dom";
import "./UserManagement.css";

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const userList = [];

      for (let userId in data) {
        const user = { id: userId, ...data[userId] };

        if (user.status === "suspended" && user.suspensionDate) {
          const suspensionDate = new Date(user.suspensionDate);
          const currentDate = new Date();
          const differenceInDays = (currentDate - suspensionDate) / (1000 * 60 * 60 * 24);

          if (differenceInDays >= 7) {
            const userRef = ref(db, `users/${userId}`);
            update(userRef, { status: "active", suspensionDate: null })
              .then(() => {
                user.status = "active";
                user.suspensionDate = null;
              })
              .catch((error) => console.error("Error restoring user after suspension:", error));
          }
        }
        userList.push(user);
      }
      setAllUsers(userList);
    });
  }, [db]);

  const handleAccountTypeChange = (userId, newType) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, { accountType: newType })
      .then(() => {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, accountType: newType } : user
          )
        );
      })
      .catch((error) => console.error("Error updating account type:", error));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setBio(user.bio);
  };

  const handleSave = (userId) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, {
      username,
      bio,
    })
      .then(() => {
        setEditingUser(null);
        alert("User updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleSuspend = (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      const userRef = ref(db, `users/${userId}`);
      const suspensionDate = new Date().toISOString();

      update(userRef, { status: "suspended", suspensionDate })
        .then(() => {
          setAllUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, status: "suspended", suspensionDate } : user
            )
          );
        })
        .catch((error) => console.error("Error suspending user:", error));
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const userRef = ref(db, `users/${userId}`);
      update(userRef, { status: "deleted" })
        .then(() => {
          setAllUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, status: "deleted" } : user
            )
          );
        })
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  const handleRestore = (userId) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, { status: "active", suspensionDate: null })
      .then(() => {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: "active" } : user
          )
        );
      })
      .catch((error) => console.error("Error restoring user:", error));
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="user-management-container">
        <div className="admin-dashboard-button">
          <h1>Admin Dashboard</h1>
          <button className="create-account-button">
            <Link to="/CreateUser" className="linking">Create a User's Account</Link>
          </button>
        </div>

        <div className="user-table-container">
          <h2>User Management</h2>
          <table className="user-requests-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {editingUser?.id === user.id ? (
                        <>
                          <label>New username:</label>
                          <br></br>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="new-input"
                          />
                        </>

                      ) : (
                        user.username
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td className="account-type-cell">
                      <input
                        type="radio"
                        name={`accountType-${user.id}`}
                        value="User"
                        checked={user.accountType === "User"}
                        onChange={() => handleAccountTypeChange(user.id, "User")}
                      />{" "} User
                      <input
                        type="radio"
                        name={`accountType-${user.id}`}
                        value="Moderator"
                        checked={user.accountType === "Moderator"}
                        onChange={() => handleAccountTypeChange(user.id, "Moderator")}
                      />{" "} Moderator
                    </td>
                    <td>
                      {editingUser?.id === user.id ? (
                        <>
                          <label>New bio:</label>
                          <br></br>
                          <input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="new-input"
                          />
                          <button onClick={() => handleSave(user.id)} className="save-button">Save</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} className="edit-button">Edit profile</button>
                          <button onClick={() => handleSuspend(user.id)} className="suspend-button">Suspend Account</button>
                          <button onClick={() => handleDelete(user.id)} className="delete-button">Delete Account</button>
                          <button onClick={() => handleRestore(user.id)} className="restore-button">Restore Account</button>
                          <button className="delete-button">Delete Profile</button>
                          <button className="restore-button">Restore Profile</button>

                        </>
                      )}
                    </td>
                    <td>{user.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
