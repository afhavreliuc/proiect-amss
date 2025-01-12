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


const pool = mysql.createPool({
  host: DB_HOST,
  port: 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(403).json({ message: 'Invalid or expired token' });
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
  const { username, password, first_name, last_name, phone, email, address } = req.body;

  // Validate all fields
  if (!username || !password || !email || !first_name || !last_name || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with the default role of 'client'
    const role = 'client';
    await pool.query(
      `INSERT INTO users (username, password, first_name, last_name, phone, email, address, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, first_name, last_name, phone, email, address, role]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Register Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }
    res.status(500).json({ message: 'Error registering user.' });
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

    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
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

// server.js

app.get('/api/motels/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const motelQuery = `
      SELECT id, name, description, utilities, rating
      FROM motels
      WHERE id = ?;
    `;
    const roomQuery = `
      SELECT id, name, price, utilities, max_people
      FROM rooms
      WHERE motel_id = ?
      ORDER BY price ASC;
    `;

    const [motel] = await pool.query(motelQuery, [id]);
    const [rooms] = await pool.query(roomQuery, [id]);

    console.log('Motel Data:', motel);
    console.log('Rooms Data:', rooms);

    if (!motel.length) {
      return res.status(404).json({ message: 'Motel not found' });
    }

    res.json({ motel: motel[0], rooms });
  } catch (error) {
    console.error('Motel Details Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// 10. View user bookings
app.get('/api/mybookings', authenticateToken, async (req, res) => {
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

app.post('/api/search', async (req, res) => {
  const { checkIn, checkOut } = req.body;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ message: 'Check-in and check-out dates are required' });
  }

  try {
    const query = `
      SELECT m.id, m.name, m.rating, MIN(r.price) AS starting_price
      FROM motels m
      JOIN rooms r ON m.id = r.motel_id
      WHERE r.id NOT IN (
        SELECT room_id
        FROM bookings
        WHERE NOT (check_out <= ? OR check_in >= ?)
      )
      GROUP BY m.id, m.name, m.rating
      ORDER BY starting_price ASC;
    `;

    const [results] = await pool.query(query, [checkIn, checkOut]);
    res.json({ results }); // Ensure the response includes a 'results' key with an array
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // Fetch the user's basic details
    const [rows] = await pool.query(
      `SELECT first_name, last_name, email, phone, rating, balance
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRow = rows[0];
    const fullName = `${userRow.first_name} ${userRow.last_name}`;

    // Fetch the user's feedback ratings
    const [ratings] = await pool.query(
      `SELECT f.rating, f.comment, m.name AS motelName
       FROM feedback f
       JOIN motels m ON f.motel_id = m.id
       WHERE f.user_id = ?`,
      [req.user.id]
    );

    // Construct the detailed user data object
    const userData = {
      id: req.user.id,
      fullName,
      email: userRow.email,
      phone: userRow.phone,
      rating: userRow.rating || 0,
      balance: userRow.balance || 0,
      ratingsGiven: ratings.map((rating) => ({
        motelName: rating.motelName,
        rating: rating.rating,
        comment: rating.comment,
      })), // Changed 'feedback' to 'ratingsGiven'
    };

    res.json(userData);
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    // The request body might have
    // { fullName, email, phone, rating, balance, ratingsGiven }
    const {
      fullName,
      email,
      phone
      // rating, balance, etc. - depends on how you handle updates
    } = req.body;

    // If you're storing first/last name separately, parse them
    // e.g. fullName = "John Smith"
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update just the columns that are editable
    await pool.query(
      `UPDATE users
       SET first_name = ?, last_name = ?, email = ?, phone = ?
       WHERE id = ?`,
      [firstName, lastName, email, phone, req.user.id]
    );

    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 9. Book a room
app.post('/api/book', authenticateToken, async (req, res) => {
  const { roomId, checkIn, checkOut, totalPrice } = req.body;

  if (!roomId || !checkIn || !checkOut || !totalPrice) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Fetch user's balance
    const [user] = await pool.query('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user[0].balance < totalPrice) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct balance
    await pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [totalPrice, req.user.id]);

    // Create booking
    await pool.query('INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)', [
      req.user.id,
      roomId,
      checkIn,
      checkOut,
    ]);

    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add money to user's balance
app.post('/api/profile/add-balance', authenticateToken, async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount provided.' });
  }

  try {
    await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, req.user.id]);
    const [updatedUser] = await pool.query('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Balance updated successfully!', balance: updatedUser[0].balance });
  } catch (error) {
    console.error('Add Balance Error:', error);
    res.status(500).json({ message: 'Server error while updating balance.' });
  }
});

// Rate a booking and update the motel's rating
app.post('/api/rate', authenticateToken, async (req, res) => {
  const { bookingId, newRating } = req.body;

  // Validate the input
  if (!bookingId || !newRating || newRating < 1 || newRating > 5) {
    return res.status(400).json({ message: 'Invalid booking ID or rating.' });
  }

  try {
    // Check if the booking exists and belongs to the authenticated user
    const [booking] = await pool.query(
      'SELECT b.*, r.motel_id FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.id = ? AND b.user_id = ?',
      [bookingId, req.user.id]
    );

    if (!booking.length) {
      return res.status(404).json({ message: 'Booking not found or not authorized.' });
    }

    const { motel_id } = booking[0];

    // Update the rating for the booking
    await pool.query('UPDATE bookings SET rating = ? WHERE id = ?', [newRating, bookingId]);

    // Recalculate the motel's overall rating
    const [ratings] = await pool.query(
      'SELECT AVG(b.rating) AS averageRating, COUNT(b.rating) AS ratingCount ' +
      'FROM bookings b ' +
      'JOIN rooms r ON b.room_id = r.id ' +
      'WHERE r.motel_id = ? AND b.rating IS NOT NULL',
      [motel_id]
    );

    const { averageRating, ratingCount } = ratings[0];

    // Update the motel's rating and rating count
    await pool.query(
      'UPDATE motels SET rating = ?, rating_count = ? WHERE id = ?',
      [averageRating, ratingCount, motel_id]
    );

    res.json({ message: 'Rating submitted successfully!' });
  } catch (error) {
    console.error('Error while rating:', error);
    res.status(500).json({ message: 'Server error while submitting rating.' });
  }
});





