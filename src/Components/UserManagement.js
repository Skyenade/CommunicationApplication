import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./UserManagement.css"; 
import HeaderAdmin from "./HeaderAdmin";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const userList = [];
      for (let userId in data) {
        userList.push({ id: userId, ...data[userId] });
      }
      setUsers(userList);
    });
  }, [db]);

  const handleRoleChange = (userId, accountType) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, { accountType });
  };

  const handleEditUser = (userId) => {
    alert(`Edit user : ${userId}`);
  };

  const handleSuspendUser = (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      const userRef = ref(db, `users/${userId}`);
      set(userRef, null);
    }
  };

  return (
    <div>
        <HeaderAdmin/>
        <div className="content">
        <h1>Moderator Dashboard</h1>
        <button className="requestAdminAssistanceButton">
          Create an Account
        </button>
    <div className="user-management">
        
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Account Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`accountType-${user.id}`}
                      checked={user.accountType === "user"}
                      onChange={() => handleRoleChange(user.id, "user")}
                    />
                    User
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`accountType-${user.id}`}
                      checked={user.accountType === "moderator"}
                      onChange={() => handleRoleChange(user.id, "moderator")}
                    />
                    Moderator
                  </label>
                </div>
              </td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditUser(user.id)}
                >
                  Edit
                </button>
                <button
                  className="suspend-button"
                  onClick={() => handleSuspendUser(user.id)}
                >
                  Suspend
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default UserManagement;
