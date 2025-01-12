import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const DetailsPage = () => {
  const { hotelId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [checkInDate, setCheckInDate] = useState(query.get('checkIn') || '');
  const [checkOutDate, setCheckOutDate] = useState(query.get('checkOut') || '');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch rooms for the hotel
    fetch(`/api/hotel/${hotelId}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []))
      .catch((error) => console.error(error));
  }, [hotelId]);

  return (
    <div>
      <h1>Hotel Details</h1>
      <input
        type="date"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
      />
      <input
        type="date"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
      />

      <div>
        {rooms.map((room) => (
          <div key={room.id}>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <input
              type="number"
              placeholder="Rate this room"
              value={room.rating || 0}
              onChange={(e) =>
                setRooms((prev) =>
                  prev.map((r) =>
                    r.id === room.id ? { ...r, rating: e.target.value } : r
                  )
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsPage;
