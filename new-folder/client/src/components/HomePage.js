import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkIn, checkOut }),
      });
  
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search Error:', error);
    } finally {
      setLoading(false);
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
      <div className="results-container">
        {Array.isArray(results) &&
          results.map((motel) => (
            <div key={motel.id} className="motel-card">
              <h2>{motel.name}</h2>
              <p>Starting Price: ${motel.starting_price}</p>
              <p>Rating: {motel.rating}</p>
              <a href={`/motels/${motel.id}?checkIn=${checkIn}&checkOut=${checkOut}`}>
                View Details
              </a>
            </div>
          ))}
      </div>


    </div>
  );
};

export default HomePage;