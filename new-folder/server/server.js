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

// middleware for authorization based on role
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: `Access denied for ${role}s only.` });
  }
  next();
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
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'CLIENT']
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
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ========== Admin Routes ==========


// 3. Add a motel
app.post('/api/motels', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  const { name, location, description } = req.body;
  try {
    await pool.query('INSERT INTO motels (name, location, description) VALUES (?, ?, ?)', [name, location, description]);
    return res.status(201).json({ message: 'Motel added successfully' });
  } catch (error) {
    console.error('Add Motel Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 4. Modify a motel
app.put('/api/motels/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { name, location, description } = req.body;
  try {
    await pool.query('UPDATE motels SET name = ?, location = ?, description = ? WHERE id = ?', [name, location, description, id]);
    return res.json({ message: 'Motel updated successfully' });
  } catch (error) {
    console.error('Update Motel Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 5. Delete a motel
app.delete('/api/motels/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM motels WHERE id = ?', [id]);
    return res.json({ message: 'Motel deleted successfully' });
  } catch (error) {
    console.error('Delete Motel Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 6. Add a room
app.post('/api/rooms', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  const { motelId, name, price } = req.body;
  try {
    await pool.query('INSERT INTO rooms (motel_id, name, price) VALUES (?, ?, ?)', [motelId, name, price]);
    return res.status(201).json({ message: 'Room added successfully' });
  } catch (error) {
    console.error('Add Room Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 7. Modify a room
app.put('/api/rooms/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    await pool.query('UPDATE rooms SET name = ?, price = ? WHERE id = ?', [name, price, id]);
    return res.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error('Update Room Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 8. Delete a room
app.delete('/api/rooms/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    return res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete Room Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// ========== Client Routes ==========

// 9. Book a room
app.post('/api/book', authenticateToken, authorizeRole('CLIENT'), async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  try {
    await pool.query('INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)', [req.user.id, roomId, checkIn, checkOut]);
    return res.status(201).json({ message: 'Room booked successfully' });
  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 10. View user bookings
app.get('/api/mybookings', authenticateToken, authorizeRole('CLIENT'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT b.id, b.room_id, b.check_in, b.check_out, r.name AS room_name, r.price, m.name AS motel_name ' +
      'FROM bookings b ' +
      'JOIN rooms r ON b.room_id = r.id ' +
      'JOIN motels m ON r.motel_id = m.id ' +
      'WHERE b.user_id = ? ' +
      'ORDER BY b.check_in DESC',
      [req.user.id]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Get Bookings Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 11. Update user booking
app.put('/api/mybookings/:id', authenticateToken, authorizeRole('CLIENT'), async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }
    await pool.query('UPDATE bookings SET check_in = ?, check_out = ? WHERE id = ?', [checkIn, checkOut, id]);
    return res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Update Booking Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 12. Cancel user booking
app.delete('/api/mybookings/:id', authenticateToken, authorizeRole('CLIENT'), async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Delete Booking Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 13. Submit feedback for a motel
app.post('/api/feedback', authenticateToken, authorizeRole('CLIENT'), async (req, res) => {
  const { motelId, rating, comment } = req.body;
  try {
    const [motel] = await pool.query('SELECT rating, rating_count FROM motels WHERE id = ?', [motelId]);
    if (motel.length === 0) {
      return res.status(404).json({ message: 'Motel not found' });
    }

    const newRating = ((motel[0].rating * motel[0].rating_count) + rating) / (motel[0].rating_count + 1);
    await pool.query('UPDATE motels SET rating = ?, rating_count = rating_count + 1 WHERE id = ?', [newRating, motelId]);
    return res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
