// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');  // Declare once here
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { PORT, JWT_SECRET, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Remove the second "const mysql = require('mysql2/promise');" line — it's already declared above

const pool = mysql.createPool({
  host: DB_HOST,
  port: 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // user { id, username, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is invalid or expired' });
  }
};

// ========== Routes ==========

// 1. Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user exists
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 2. Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1d', // token expires in 1 day
    });

    return res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 3. Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    return res.json(rows);
  } catch (error) {
    console.error('Get Rooms Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 4. Book a room
app.post('/api/book', authenticateToken, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  try {
    await pool.query(
      'INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?,?,?,?)',
      [req.user.id, roomId, checkIn, checkOut]
    );
    return res.status(201).json({ message: 'Room booked successfully' });
  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 5. Get user bookings
app.get('/api/mybookings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT b.id, b.room_id, b.check_in, b.check_out, r.name as room_name, r.price, r.rating ' +
      'FROM bookings b ' +
      'JOIN rooms r ON b.room_id = r.id ' +
      'WHERE b.user_id = ? ' +
      'ORDER BY b.check_in DESC',
      [req.user.id]
    );
    return res.json(rows);
  } catch (error) {
    console.error('MyBookings Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 6. Rate a room
app.post('/api/rate', authenticateToken, async (req, res) => {
  const { bookingId, newRating } = req.body;
  try {
    // Check if this booking belongs to the user and if check_out has passed
    const [bookings] = await pool.query(
      'SELECT b.*, r.rating, r.rating_count ' +
      'FROM bookings b ' +
      'JOIN rooms r ON b.room_id = r.id ' +
      'WHERE b.id = ? AND b.user_id = ?',
      [bookingId, req.user.id]
    );

    if (bookings.length === 0) {
      return res.status(400).json({ message: 'Invalid booking or no permission' });
    }

    const booking = bookings[0];
    const now = new Date();

    if (new Date(booking.check_out) > now) {
      return res.status(400).json({ message: 'Cannot rate before checkout time' });
    }

    // Calculate new average rating
    const oldRating = booking.rating;
    const oldCount = booking.rating_count;
    const updatedCount = oldCount + 1;
    const updatedRating = ((oldRating * oldCount) + newRating) / updatedCount;

    await pool.query(
      'UPDATE rooms SET rating = ?, rating_count = ? WHERE id = ?',
      [updatedRating, updatedCount, booking.room_id]
    );

    return res.json({ message: 'Room rated successfully' });
  } catch (error) {
    console.error('Rating Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Start server on PORT (default 5000)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
