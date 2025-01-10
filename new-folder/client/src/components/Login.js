import React, { useState } from 'react';
import API from '../api';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/login', {
        username: formData.username,
        password: formData.password,
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
    <div className="container">
      <div className="card">
        <h2 className="title">Login to Your Account</h2>
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
            Login
          </button>
          <div className="footer">
            <p>
              Don't have an account? <a href="/register" className="link">Sign up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


