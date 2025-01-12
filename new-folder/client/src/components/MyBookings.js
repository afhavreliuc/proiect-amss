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
      {message && <p className="error-message">{message}</p>}
      {bookings.length > 0 ? (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <h3>{b.room_name}</h3>
              <p>
                <strong>Check In:</strong>{' '}
                {new Date(b.check_in).toLocaleString()}
              </p>
              <p>
                <strong>Check Out:</strong>{' '}
                {new Date(b.check_out).toLocaleString()}
              </p>
              
              <div className="rate-room">
                <p>Stars: </p>
                <input
                  className="rating-input"
                  type="number"
                  min="1"
                  max="5"
                  value={ratings[b.id] || ''}
                  onChange={(e) =>
                    handleRatingChange(b.id, Number(e.target.value))
                  }
                />
                <button
                  className="submit-rating-button"
                  onClick={() => handleRate(b.id)}
                >
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-bookings-message">You have no bookings yet.</p>
      )}
    </div>
  );
}
