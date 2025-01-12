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
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assuming you store the user's role in localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role'); // Remove the stored role
    window.location.href = '/login';
  };

  const AdminRoute = ({ children }) => {
    return userRole === 'ADMIN' ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <nav>
      <div className="left-links">
        <Link to="/">Home</Link>
      </div>
      <div className="right-links">
        {token ? (
          <>
            <Link to="/mybookings">My Bookings</Link>
            <Link to="/profile">My Profile</Link>
            {userRole === 'ADMIN' && <Link to="/admin">Admin Dashboard</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
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
          {/* Profile Page */}
          <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
          {/* Login */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          {/* Register */}
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
          {/* My Bookings */}
          <Route path="/mybookings" element={token ? <MyBookings /> : <Navigate to="/login" />} />
          {/* Confirm Booking */}
          <Route path="/confirm-booking" element={token ? <ConfirmBooking /> : <Navigate to="/login" />} />
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
