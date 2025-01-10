import React, { useState } from 'react';
import API from '../api';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/login', {
        username: formData.username,
        password: formData.password
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        window.location.href = '/';
      } else {
        setMessage('Login failed, please try again');
      }
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
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
