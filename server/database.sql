-- Run these queries in your MySQL before starting the server

CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Insert some dummy rooms
INSERT INTO rooms (name, price, rating, rating_count) VALUES ('Room A', 100, 4.5, 10);
INSERT INTO rooms (name, price, rating, rating_count) VALUES ('Room B', 200, 3.8, 5);
INSERT INTO rooms (name, price, rating, rating_count) VALUES ('Room C', 150, 4.2, 8);
