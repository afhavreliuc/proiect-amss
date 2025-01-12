import React, { useEffect, useState, useCallback } from 'react';
import API from '../api'; // Replace with your Axios/Fetch helper
import { useNavigate } from 'react-router-dom';
import './Rooms.css';

export default function Rooms({ motelId }) {
  const [rooms, setRooms] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalPrice: 0,
  });

  const navigate = useNavigate();

  const fetchRooms = useCallback(async () => {
    try {
      const res = await API.get(`/motels/${motelId}`);
      console.log('Rooms API Response:', res.data);
      
      // Extract all prices into an array
      const roomPrices = res.data.rooms.map((room) => ({
        id: room.id,
        name: room.name,
        price: room.price,
      }));
      console.log('Room Prices:', roomPrices);
      
      setRooms(res.data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to fetch rooms. Please try again later.');
    }
  }, [motelId]);
  
  

  useEffect(() => {
    if (!motelId) {
      console.error('motelId is not provided to Rooms component.');
      alert('Invalid motel selected.');
      return;
    }
    fetchRooms();
  }, [motelId, fetchRooms]);

  const calculateTotalPrice = (pricePerNight) => {
    if (!bookingInfo.checkIn || !bookingInfo.checkOut) return 0;
    const checkInDate = new Date(bookingInfo.checkIn);
    const checkOutDate = new Date(bookingInfo.checkOut);
    const diffTime = checkOutDate - checkInDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const numericPrice = parseFloat(pricePerNight); // Convert price to a number
    return nights > 0 && !isNaN(numericPrice) ? nights * numericPrice : 0;
  };

  const handleBookClick = (room) => {
    if (!bookingInfo.checkIn || !bookingInfo.checkOut) {
      alert('Please select valid check-in and check-out dates.');
      return;
    }
    const totalPrice = calculateTotalPrice(room.price);
    if (totalPrice === 0) {
      alert('Invalid booking details. Please check your dates.');
      return;
    }
    console.log(`Booking Info for Room ID ${room.id}:`, { ...bookingInfo, roomId: room.id, totalPrice });
    setBookingInfo({
      ...bookingInfo,
      roomId: room.id,
      totalPrice,
    });
    navigate('/confirm-booking', {
      state: {
        roomId: room.id,
        totalPrice,
        checkIn: bookingInfo.checkIn,
        checkOut: bookingInfo.checkOut,
      },
    });
  };

  if (!rooms || rooms.length === 0) {
    return <p>No rooms available for this motel.</p>;
  }

  return (
    <div className="rooms-container">
      <h2>Available Rooms</h2>
      <div className="booking-info">
        <label>Check-In:</label>
        <input
          type="date"
          onChange={(e) => {
            const newCheckIn = e.target.value;
            if (bookingInfo.checkOut && new Date(newCheckIn) >= new Date(bookingInfo.checkOut)) {
              alert('Check-In date must be before Check-Out date.');
              return;
            }
            setBookingInfo({ ...bookingInfo, checkIn: newCheckIn });
          }}
        />
        <label>Check-Out:</label>
        <input
          type="date"
          onChange={(e) => {
            const newCheckOut = e.target.value;
            if (bookingInfo.checkIn && new Date(newCheckOut) <= new Date(bookingInfo.checkIn)) {
              alert('Check-Out date must be after Check-In date.');
              return;
            }
            setBookingInfo({ ...bookingInfo, checkOut: newCheckOut });
          }}
        />
      </div>
      <table className="rooms-table">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Price Per Night</th>
            <th>Total Price</th>
            <th>Book</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>${Number(room.price).toFixed(2)}</td>
              <td>${calculateTotalPrice(room.price).toFixed(2)}</td>
              <td>
                <button onClick={() => handleBookClick(room)}>Book</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
