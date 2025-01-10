-- Asigură-te că folosești baza de date corectă
USE hotel_db;

-- Modificarea tabelului `users` pentru a adăuga roluri și alte câmpuri
ALTER TABLE users
ADD COLUMN first_name VARCHAR(100),
ADD COLUMN last_name VARCHAR(100),
ADD COLUMN phone VARCHAR(15),
ADD COLUMN email VARCHAR(255),
ADD COLUMN address TEXT;

-- Crearea tabelului `motels` dacă nu există
CREATE TABLE IF NOT EXISTS motels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  rating FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0
);

-- Modificarea tabelului `rooms` pentru a-l asocia cu `motels` și pentru a adăuga mai multe detalii
ALTER TABLE rooms
  ADD COLUMN motel_id INT NOT NULL AFTER id,
  ADD COLUMN room_number VARCHAR(20) NOT NULL AFTER name,
  ADD COLUMN type ENUM('single', 'double', 'suite') NOT NULL AFTER room_number,
  ADD COLUMN availability BOOLEAN DEFAULT TRUE AFTER price,
  ADD FOREIGN KEY (motel_id) REFERENCES motels(id) ON DELETE CASCADE;

-- Crearea tabelului `bookings` dacă nu există (deja definit corect în fișierul tău)
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

-- Crearea tabelului `feedback` dacă nu există
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  motel_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (motel_id) REFERENCES motels(id)
);

-- Inserarea unor date fictive dacă este necesar
INSERT IGNORE INTO motels (name, location, description) VALUES
('Grand Hotel', 'Downtown', 'Luxury hotel with modern amenities'),
('Beach Resort', 'Seaside', 'Relaxing resort by the beach');

INSERT IGNORE INTO rooms (motel_id, room_number, type, price, availability) VALUES
(1, '101', 'single', 100.00, TRUE),
(1, '102', 'double', 150.00, TRUE),
(2, '201', 'suite', 250.00, TRUE);

INSERT IGNORE INTO users (username, password, role, email, phone) VALUES
('admin_user', 'hashed_password_here', 'admin', 'admin@example.com', '1234567890'),
('client_user', 'hashed_password_here', 'client', 'client@example.com', '0987654321');
