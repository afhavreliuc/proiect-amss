import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({
    roomId: '',
    checkIn: '',
    checkOut: ''
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBook = async (roomId) => {
    setMessage('');
    if (!token) {
      setMessage('You must be logged in to book a room');
      return;
    }
    try {
      const res = await API.post('/book', {
        roomId,
        checkIn: bookingInfo.checkIn,
        checkOut: bookingInfo.checkOut
      });
      setMessage(res.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error connecting to the server');
      }
    }
  };

  return (
    <div>
      <h2>Available Rooms</h2>
      <p style={{ color: 'red' }}>{message}</p>
      <div>
        <label>Check-In: </label>
        <input 
          type="datetime-local"
          onChange={(e) => setBookingInfo({ ...bookingInfo, checkIn: e.target.value })}
        />
        <label style={{ marginLeft: '10px' }}>Check-Out: </label>
        <input 
          type="datetime-local"
          onChange={(e) => setBookingInfo({ ...bookingInfo, checkOut: e.target.value })}
        />
      </div>
      <br />
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Book</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.price}</td>
              <td>{room.rating.toFixed(1)}</td>
              <td>
                <button onClick={() => handleBook(room.id)}>Book Now</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
