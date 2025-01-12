import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkIn, checkOut }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search Error:', error);
    }
  };

  return (
    <div className='home-container'>
      <h1>Search Motels</h1>
      <div>
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        placeholder="Check-in"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        placeholder="Check-out"
      />
      <button className='search-button' onClick={handleSearch}>Search</button>
      </div>
      <div>
        {results.map((motel) => (
          <div key={motel.id} className='motel-card' >
            <h2>{motel.name}</h2>
            <p>Starting Price: ${motel.starting_price}</p>
            <p>Rating: {motel.rating}</p>
            <a href={`/motels/${motel.id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
