import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './MotelDetails.css';

const MotelDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [motel, setMotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({
    checkIn: new URLSearchParams(location.search).get('checkIn') || '',
    checkOut: new URLSearchParams(location.search).get('checkOut') || '',
  });

  useEffect(() => {
    const fetchMotelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/motels/${id}`);
        const data = await response.json();
        setMotel(data.motel);
        setRooms(data.rooms);
      } catch (error) {
        console.error('Error fetching motel details:', error);
      }
    };

    fetchMotelDetails();
  }, [id]);

  const calculateTotalPrice = (pricePerNight) => {
    if (!bookingInfo.checkIn || !bookingInfo.checkOut) return 0;
  
    const checkInDate = new Date(bookingInfo.checkIn);
    const checkOutDate = new Date(bookingInfo.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const numericPrice = parseFloat(pricePerNight); // Ensure price is treated as a number
  
    return nights > 0 && !isNaN(numericPrice) ? nights * numericPrice : 0;
  };  

  const handleBookClick = (room) => {
    if (!bookingInfo.checkIn || !bookingInfo.checkOut) {
      alert('Please select valid check-in and check-out dates.');
      return;
    }

    const totalPrice = calculateTotalPrice(room.price);

    navigate('/confirm-booking', {
      state: {
        roomId: room.id,
        totalPrice,
        checkIn: bookingInfo.checkIn,
        checkOut: bookingInfo.checkOut,
      },
    });
  };

  if (!motel) return <div>Loading...</div>;

  return (
    <div className='motel-details-container'>
      <div className='motel-info'>
        <h1>{motel.name}</h1>
        <p>{motel.description}</p>
        <p>Utilities: {motel.utilities}</p>
        <p>Rating: {motel.rating}</p>
      </div>

      <h2>Rooms</h2>
      <div className='booking-dates'>
        <label>Check-In:</label>
        <input
          type='date'
          value={bookingInfo.checkIn}
          onChange={(e) => setBookingInfo({ ...bookingInfo, checkIn: e.target.value })}
        />
        <label>Check-Out:</label>
        <input
          type='date'
          value={bookingInfo.checkOut}
          onChange={(e) => setBookingInfo({ ...bookingInfo, checkOut: e.target.value })}
        />
      </div>

      <div className='rooms-list'>
        {rooms.map((room) => {
          const numericPrice = parseFloat(room.price); // Parse price as a number
          return (
            <div key={room.id} className='room-card'>
              <h3>{room.name}</h3>
              <p>Price: ${!isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A'}</p>
              <p>Max People: {room.max_people}</p>
              <p>Utilities: {room.utilities}</p>
              <p>
                Total Price: $
                {bookingInfo.checkIn && bookingInfo.checkOut && !isNaN(numericPrice)
                  ? calculateTotalPrice(numericPrice).toFixed(2)
                  : 'N/A'}
              </p>
              <button onClick={() => handleBookClick(room)} className='book-button'>
                Book
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MotelDetails;
