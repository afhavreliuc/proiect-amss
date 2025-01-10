import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/register', {
        username: formData.username,
        password: formData.password
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
      <h2>Register</h2>
      <p style={{ color: 'red' }}>{message}</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username: </label><br />
          <input 
            type="text" 
            name="username" 
            value={formData.username}
            onChange={handleChange} 
            required 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password: </label><br />
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
