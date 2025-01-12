import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MyBookings from './components/MyBookings';
import HomePage from './components/HomePage'; // Import HomePage
import MotelDetails from './components/MotelDetails'; // Import MotelDetails
import ProfilePage from './components/ProfilePage';
import ConfirmBooking from './components/ConfirmBooking';
import DetailsPage from './components/DetailsPage'; // Import DetailsPage

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
              <Link to="/profile" style={{ marginLeft: '10px' }}>My Profile</Link>
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
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          {/* Motel Details Page */}
          <Route path="/motels/:id" element={<MotelDetails />} />
          {/* Details Page */}
          <Route path="/details/:hotelId" element={<DetailsPage />} />
          {/* Other Routes */}
          <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
          <Route path="/mybookings" element={token ? <MyBookings /> : <Navigate to="/login" />} />
          <Route path="/confirm-booking" element={token ? <ConfirmBooking /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
