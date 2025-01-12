import React, { useState, useEffect } from 'react';
import API from '../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [motelData, setMotelData] = useState({
    name: '',
    location: '',
    description: '',
  });
  const [roomData, setRoomData] = useState({
    motelName: '', // Use motel name instead of ID
    name: '',
    price: '',
  });
  const [motels, setMotels] = useState([]); // List of available motels
  const [message, setMessage] = useState('');

  // Fetch motels when the component loads
  useEffect(() => {
    fetchMotels();
  }, []);

  const fetchMotels = async () => {
    try {
      const res = await API.get('/motels'); // Adjust the endpoint as needed
      setMotels(res.data); // Assuming the backend returns an array of motels
    } catch (error) {
      console.error('Error fetching motels:', error);
      setMessage('Error fetching motels.');
    }
  };

  const handleMotelChange = (e) => {
    const { name, value } = e.target;
    setMotelData({ ...motelData, [name]: value });
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const addMotel = async () => {
    try {
      const res = await API.post('/motels', motelData);
      setMessage(res.data.message);
      setMotelData({ name: '', location: '', description: '' });
      fetchMotels(); // Refresh motels after adding one
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding motel.');
    }
  };

  const addRoom = async () => {
    try {
      // Find the selected motel by name to get its ID
      const selectedMotel = motels.find((m) => m.name === roomData.motelName);
      if (!selectedMotel) {
        setMessage('Invalid motel selected.');
        return;
      }

      const res = await API.post('/rooms', {
        motelId: selectedMotel.id, // Send the motel ID to the backend
        name: roomData.name,
        price: roomData.price,
      });
      setMessage(res.data.message);
      setRoomData({ motelName: '', name: '', price: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding room.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>{message}</p>

      <h3>Add Motel</h3>
      <input
        type="text"
        name="name"
        placeholder="Motel Name"
        value={motelData.name}
        onChange={handleMotelChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={motelData.location}
        onChange={handleMotelChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={motelData.description}
        onChange={handleMotelChange}
      />
      <button onClick={addMotel}>Add Motel</button>

      <h3>Add Room</h3>
      <select
        name="motelName"
        value={roomData.motelName}
        onChange={handleRoomChange}
      >
        <option value="">Select Motel</option>
        {motels.map((motel) => (
          <option key={motel.id} value={motel.name}>
            {motel.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="name"
        placeholder="Room Name"
        value={roomData.name}
        onChange={handleRoomChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={roomData.price}
        onChange={handleRoomChange}
      />
      <button onClick={addRoom}>Add Room</button>
    </div>
  );
}
