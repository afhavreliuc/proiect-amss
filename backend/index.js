require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Rute
app.use('/users', require('./routes/users'));
app.use('/rooms', require('./routes/rooms'));
app.use('/reservations', require('./routes/reservations'));
app.use('/feedback', require('./routes/feedback'));
app.use('/stats', require('./routes/stats'));

// Pornirea serverului
app.listen(PORT, () => {
    console.log(`Serverul rulează la http://localhost:${PORT}`);
});
