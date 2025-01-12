-- Create and use the database
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(15),
  email VARCHAR(255),
  address TEXT,
  role VARCHAR(50) DEFAULT 'client',
  rating DECIMAL(3,2) DEFAULT 0.0,
  balance DECIMAL(10,2) DEFAULT 0.00
);

-- Create the motels table
CREATE TABLE IF NOT EXISTS motels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  rating FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0,
  utilities TEXT
);

-- Create the rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  motel_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  type ENUM('single', 'double', 'suite') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  utilities TEXT,
  max_people INT,
  rating FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0,
  FOREIGN KEY (motel_id) REFERENCES motels(id) ON DELETE CASCADE
);

-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME NOT NULL,
  status ENUM('active', 'cancelled') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Create the feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  motel_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (motel_id) REFERENCES motels(id)
);

-- Insert data into motels
INSERT IGNORE INTO motels (name, location, description, rating, rating_count, utilities) VALUES
('Grand Hotel', 'Downtown', 'Luxury hotel with modern amenities', 4.5, 10, 'Pool, Sauna, Jacuzzi'),
('Beach Motel', 'Miami', 'A cozy motel near the beach', 4.2, 10, 'Pool, AC, Wi-Fi'),
('Mountain Lodge', 'Aspen', 'Quiet lodge in the mountains', 4.5, 6, 'Heater, Fireplace, Wi-Fi'),
('City Inn', 'New York', 'In the heart of downtown', 3.8, 12, 'AC, TV, Restaurant');

-- Insert data into rooms
INSERT IGNORE INTO rooms (motel_id, name, room_number, type, price, availability, utilities, max_people, rating, rating_count) VALUES
(1, 'Queen Room', '101', 'single', 120.00, TRUE, 'TV, Fridge', 2, 4.0, 5),
(1, 'Double Room', '102', 'double', 150.00, TRUE, 'TV, Kitchenette', 4, 3.8, 7),
(2, 'Standard Room', '201', 'single', 90.00, TRUE, 'TV, Coffee Maker', 2, 4.3, 2),
(2, 'Deluxe Room', '202', 'suite', 160.00, TRUE, 'TV, Fireplace, Wi-Fi', 4, 4.6, 3),
(3, 'Economy Room', '301', 'single', 80.00, TRUE, 'TV, Wi-Fi', 2, 3.5, 10),
(3, 'Suite', '302', 'suite', 200.00, TRUE, 'TV, Mini Bar, AC', 4, 4.1, 4);

-- Insert data into users
INSERT INTO users (username, password, first_name, last_name, phone, email, address, role, balance) VALUES
('admin_user', 'hashed_password_here', 'Admin', 'User', '1234567890', 'admin@example.com', 'Admin Address', 'admin', 500.00),
('client_user', 'hashed_password_here', 'Client', 'User', '0987654321', 'client@example.com', 'Client Address', 'client', 300.00),
('test_user', 'hashed_password', 'Test', 'User', '1234567890', 'test@example.com', 'Test Address', 'client', 150.00);

-- Insert data into bookings
-- Add initial data if necessary
-- Select data to verify
SELECT * FROM rooms WHERE motel_id = 1;
SELECT * FROM users;
SELECT * FROM motels;
