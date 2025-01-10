import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import MyBookings from './components/MyBookings';

function App() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          {token ? (
            <>
              <Link to="/mybookings">My Bookings</Link>
              <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{ marginLeft: '10px' }}>Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Rooms />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
          <Route path="/mybookings" element={token ? <MyBookings /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
