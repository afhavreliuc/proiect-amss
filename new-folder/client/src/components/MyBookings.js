import React, { useEffect, useState } from 'react';
import API from '../api';
import './MyBookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState({}); // Store ratings for each booking by ID
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/mybookings');
      setBookings(res.data);

      // Initialize ratings with current ratings from the backend
      const initialRatings = res.data.reduce((acc, booking) => {
        acc[booking.id] = booking.rating || 0; // Use the existing rating or default to 0
        return acc;
      }, {});
      setRatings(initialRatings);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRate = async (bookingId) => {
    setMessage('');
    try {
      const newRating = ratings[bookingId]; // Get the rating for this specific booking
      const res = await API.post('/rate', {
        bookingId,
        newRating,
      });
      setMessage(res.data.message);
      fetchBookings(); // Refresh the list
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error connecting to the server');
      }
    }
  };

  const handleRatingChange = (bookingId, value) => {
    // Update the rating for the specific booking
    if (value >= 1 && value <= 5) {
      setRatings({ ...ratings, [bookingId]: value });
    }
  };

  return (
    <div className="mybookings-container">
      <h2>My Bookings</h2>
      <p className="error-message">{message}</p>
      <table className="bookings-table">
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
              <td>{b.rating ? b.rating.toFixed(1) : 'N/A'}</td>
              <td>
                <input
                  className="rating-input"
                  type="number"
                  min="1"
                  max="5"
                  value={ratings[b.id] || ''} // Get the rating for this booking
                  onChange={(e) =>
                    handleRatingChange(b.id, Number(e.target.value))
                  }
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
