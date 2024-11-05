
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, set } from "firebase/database";
import HeaderAdmin from "./HeaderAdmin";
import "./UserManagement.css";

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const userList = [];
      for (let userId in data) {
        userList.push({ id: userId, ...data[userId] });
      }
      setAllUsers(userList);
    });
  }, [db]);

  const handleAccountTypeChange = (userId, newType) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, { accountType: newType })
      .then(() => {
        setAllUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, accountType: newType } : user
          )
        );
      })
      .catch(error => console.error("Error updating account type:", error));
  };

  const handleEdit = (userId) => {
    alert(`Edit user with ID: ${userId}`);
  };

  const handleSuspend = (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      const userRef = ref(db, `users/${userId}`);
      update(userRef, { status: 'suspended' })
        .then(() => {
          setAllUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === userId ? { ...user, status: 'suspended' } : user
            )
          );
        })
        .catch(error => console.error("Error suspending user:", error));
    }
  };

  return (
    <div>
      <div className="user-management-container">
        <div className='admin-dashboard-button'>
          <h1>Admin Dashboard</h1>
          <button className='create-account-button'>Create a User's Account</button>
        </div>

        <div>
          <h2>User Management</h2>
          <table className="user-management-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length > 0 ? (
                allUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <input
                        type="radio"
                        name={`accountType-${user.id}`}
                        value="User"
                        checked={user.accountType === 'User'}
                        onChange={() => handleAccountTypeChange(user.id, 'User')}
                      /> User
                      <input
                        type="radio"
                        name={`accountType-${user.id}`}
                        value="Moderator"
                        checked={user.accountType === 'Moderator'}
                        onChange={() => handleAccountTypeChange(user.id, 'Moderator')}
                      /> Moderator
                    </td>
                    <td>
                      <button onClick={() => handleEdit(user.id)}>Edit</button>
                      <button onClick={() => handleSuspend(user.id)}>Suspend</button>
                    </td>
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
