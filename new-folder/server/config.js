// config.js
require('dotenv').config();

module.exports = {
  // The port for your Express server (NOT MySQL)
  PORT: process.env.PORT || 5000,
  
  // JWT secret key for signing tokens
  JWT_SECRET: process.env.JWT_SECRET || 'MY_SECRET_KEY',
  
  // MySQL Database connection info
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'root',
  DB_NAME: process.env.DB_NAME || 'hotel_db'
};
