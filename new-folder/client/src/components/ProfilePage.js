// ProfilePage.js

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
    ratingsGiven: [] // Ensure this matches the server response
  });

  // Toggling between display and editing form
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch the user profile from the server
  const fetchUserProfile = async () => {
    try {
      const res = await API.get('/profile'); // Ensure the endpoint is correct
      setUser(res.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      alert('Failed to fetch profile. Please try again.');
    }
  };

  // Update state when editing fields
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Submit the updated profile to the server
  const handleSave = async () => {
    try {
      await API.put('/profile', user); // Ensure the endpoint is correct
      setEditMode(false);
      // Refresh the user data
      fetchUserProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-info">
        {/* === Display Mode === */}
        {!editMode && (
          <>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>My Overall Rating:</strong> {Number(user.rating || 0).toFixed(1)}</p>
            <p><strong>Balance:</strong> ${Number(user.balance || 0).toFixed(2)}</p>

            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        )}

        {/* === Edit Mode === */}
        {editMode && (
          <>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />

            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />

            <button onClick={handleSave}>
              Save
            </button>
            <button onClick={() => setEditMode(false)}>
              Cancel
            </button>
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
