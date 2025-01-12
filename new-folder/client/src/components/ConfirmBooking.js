import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomId, totalPrice, checkIn, checkOut } = state || {};

  const [userBalance, setUserBalance] = useState(0); // Default to 0

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view this page.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserBalance(Number(response.data.balance) || 0); // Ensure the balance is a number
      } catch (error) {
        console.error('Error fetching user balance:', error.response?.data || error.message);
        alert('Failed to fetch user balance. Please try again.');
      }
    };

    fetchUserBalance();
  }, [navigate]);

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to confirm the booking.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/book',
        { roomId, checkIn, checkOut, totalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Booking confirmed successfully!');
      navigate('/mybookings');
    } catch (error) {
      console.error('Error confirming booking:', error.response?.data || error.message);
      alert('Failed to confirm the booking. Please try again.');
    }
  };

  if (!roomId || !totalPrice || !checkIn || !checkOut) {
    return <div>Invalid booking details. Please try again.</div>;
  }

  return (
    <div className="confirm-booking">
      <h1>Confirm Your Booking</h1>
      <p>
        <strong>Your Balance:</strong> ${Number(userBalance).toFixed(2)}
      </p>
      <p>
        <strong>Total Price:</strong> ${Number(totalPrice).toFixed(2)}
      </p>
      <p>Are you sure you want to confirm this booking?</p>
      <button onClick={handleConfirmBooking}>Confirm</button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}
