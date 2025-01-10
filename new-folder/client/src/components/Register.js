import React, { useState } from 'react';
import API from '../api';
import './Register.css';

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
    <div className="container">
      <div className="card">
        <h2 className="title">Create a New Account</h2>
        <p className="message">{message}</p>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <button type="submit" className="button">
            Register
          </button>
          <div className="footer">
            <p>
              Already have an account? <a href="/login" className="link">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}