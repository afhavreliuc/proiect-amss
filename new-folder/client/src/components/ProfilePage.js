import React, { useEffect, useState } from 'react';
import API from '../api'; // Ensure this is correctly configured
import './ProfilePage.css';

export default function ProfilePage() {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    rating: 0,
    balance: 0,
    ratingsGiven: []
  });

  const [editMode, setEditMode] = useState(false);
  const [addBalanceAmount, setAddBalanceAmount] = useState(0); // Amount to add to balance

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get('/profile'); // Ensure the endpoint is correct
      setUser(res.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      alert('Failed to fetch profile. Please try again.');
    }
  };

  const handleAddBalance = async () => {
    if (!addBalanceAmount || addBalanceAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const res = await API.post('/profile/add-balance', { amount: addBalanceAmount }); // Ensure the endpoint is correct
      alert(res.data.message);
      setUser((prevUser) => ({ ...prevUser, balance: res.data.balance }));
      setAddBalanceAmount(0); // Reset the input field
    } catch (error) {
      console.error('Add Balance Error:', error);
      alert('Failed to add balance. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-info">
        {!editMode && (
          <>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>My Overall Rating:</strong> {Number(user.rating || 0).toFixed(1)}</p>
            <p><strong>Balance:</strong> ${Number(user.balance || 0).toFixed(2)}</p>

            <div className="add-balance-section">
              <input
                type="text" // Change from "number" to "text"
                placeholder="Enter amount"
                value={addBalanceAmount === 0 ? '' : addBalanceAmount} // Set empty string if value is 0
                onChange={(e) => {
                  const value = e.target.value;
                  // Validate input to allow only numbers
                  if (!isNaN(value) && Number(value) >= 0) {
                    setAddBalanceAmount(Number(value));
                  }
                }}
              />
              <button onClick={handleAddBalance}>Add Balance</button>
            </div>

            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}

        {editMode && (
          <>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />

            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        )}
      </div>

      <h2>My Motel Ratings</h2>
      {user.ratingsGiven.length === 0 && (
        <p>You haven’t rated any motels yet.</p>
      )}
      {user.ratingsGiven.length > 0 && (
        <ul className="ratings-list">
          {user.ratingsGiven.map((ratingItem, index) => (
            <li key={index} className="rating-item">
              <strong>Motel:</strong> {ratingItem.motelName} <br />
              <strong>Rating:</strong> {ratingItem.rating} <br />
              <strong>Comment:</strong> {ratingItem.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
