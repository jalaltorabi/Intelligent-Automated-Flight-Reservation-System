CREATE DATABASE flight_reservation_thesis
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flight_reservation_thesis;

-- =========================
-- جدول کاربران
-- =========================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150),
  ab_group ENUM('CONTROL','AUTO_BASIC','AUTO_SUPERVISED'),
  openness TINYINT,
  conscientiousness TINYINT,
  extroversion TINYINT,
  agreeableness TINYINT,
  neuroticism TINYINT,
  avg_price INT,
  flexibility TINYINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- جدول مبدا مقصد
-- =========================
CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origin VARCHAR(50),
  destination VARCHAR(50)
);

-- =========================
-- جدول پروازها
-- =========================
CREATE TABLE flights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT,
  airline VARCHAR(100),
  price INT,
  quality_score DECIMAL(3,2),
  delay_risk DECIMAL(3,2),
  departure_time TIME,
  arrival_time TIME,
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- =========================
-- جدول رزروها
-- =========================
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  flight_id INT,
  booking_type ENUM('MANUAL','AUTO'),
  supervisor_status ENUM('APPROVED','REVIEW','REJECTED'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (flight_id) REFERENCES flights(id)
);

-- =========================
-- درج مبدا مقصدها
-- =========================
INSERT INTO routes (origin, destination) VALUES
('Tehran','Mashhad'),
('Tehran','Shiraz'),
('Tehran','Isfahan'),
('Mashhad','Tehran'),
('Shiraz','Tehran');

-- =========================
-- درج 5 پرواز برای هر مسیر
-- =========================
INSERT INTO flights (route_id, airline, price, quality_score, delay_risk, departure_time, arrival_time)
SELECT r.id,
       CONCAT('Airline-',n.num),
       1200000 + (RAND()*800000),
       ROUND(3 + RAND()*2,2),
       ROUND(RAND(),2),
       '08:00:00',
       '09:30:00'
FROM routes r
JOIN (
  SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
) n;

-- =========================
-- تولید 100 کاربر رندوم
-- =========================
INSERT INTO users
(name, email, ab_group, openness, conscientiousness, extroversion, agreeableness, neuroticism, avg_price, flexibility)
SELECT
  CONCAT('User ',n),
  CONCAT('user',n,'@thesis.ir'),
  ELT(1 + FLOOR(RAND()*3),'CONTROL','AUTO_BASIC','AUTO_SUPERVISED'),
  1 + FLOOR(RAND()*5),
  1 + FLOOR(RAND()*5),
  1 + FLOOR(RAND()*5),
  1 + FLOOR(RAND()*5),
  1 + FLOOR(RAND()*5),
  1000000 + (RAND()*1000000),
  1 + FLOOR(RAND()*5)
FROM (
  SELECT a.N + b.N*10 + 1 AS n
  FROM
    (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
    (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
  LIMIT 100
) numbers;

-- =========================
-- ثبت رزروهای رندوم برای کاربران
-- =========================
INSERT INTO bookings (user_id, flight_id, booking_type, supervisor_status)
SELECT
  u.id,
  f.id,
  IF(u.ab_group='CONTROL','MANUAL','AUTO'),
  ELT(1 + FLOOR(RAND()*3),'APPROVED','REVIEW','REJECTED')
FROM users u
JOIN flights f
ORDER BY RAND()
LIMIT 300;
