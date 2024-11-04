import React, { useState, useEffect } from 'react';
import '../Style.css';
import Header from './Header';
import { ref, update } from "firebase/database";
import { database } from '../firebase';

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//   }, []);

  const handleAccountTypeChange = (userId, newType) => {
    const userRef = ref(database, `users/${userId}`);
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
    const userRef = ref(database, `users/${userId}`);
    update(userRef, { status: 'suspended' })
      .then(() => {
        setAllUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: 'suspended' } : user
          )
        );
      })
      .catch(error => console.error("Error suspending user:", error));
  };

  return (
    <div>
      <Header />
      <div className="user-management-container">
        <h2>Manage Users</h2>
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
  );
};

export default UserManagement;
