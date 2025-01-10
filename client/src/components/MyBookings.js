import React, { useEffect, useState } from 'react';
import API from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/mybookings');
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRate = async (bookingId) => {
    setMessage('');
    try {
      const res = await API.post('/rate', {
        bookingId,
        newRating: rating
      });
      setMessage(res.data.message);
      fetchBookings(); // refresh the list
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
      <h2>My Bookings</h2>
      <p style={{ color: 'red' }}>{message}</p>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Current Rating</th>
            <th>Rate This Room</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.room_name}</td>
              <td>{new Date(b.check_in).toLocaleString()}</td>
              <td>{new Date(b.check_out).toLocaleString()}</td>
              <td>{b.rating && b.rating.toFixed(1)}</td>
              <td>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)} 
                />
                <button onClick={() => handleRate(b.id)}>Submit Rating</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
