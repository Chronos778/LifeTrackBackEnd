-- SQLite version of PHR Database
-- Converted from MySQL dump files

-- Table: users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    age INTEGER,
    gender TEXT NOT NULL CHECK (gender IN ('Male','Female','Other')),
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL UNIQUE
);

-- Insert users data
INSERT INTO users (user_id, name, age, gender, contact_number, email, password) VALUES 
(1,'Raj',32,'Male','9875488456','raj@example.com','1234'),
(2,'Sami',24,'Female','8967868677','sami@example.com','9876');

-- Table: health_records
DROP TABLE IF EXISTS health_records;
CREATE TABLE health_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    diagnosis VARCHAR(200) NOT NULL,
    record_date DATE NOT NULL,
    file_path VARCHAR(225),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert health_records data
INSERT INTO health_records (record_id, user_id, doctor_id, diagnosis, record_date, file_path) VALUES 
(1,1,1,'Hypertension','2025-06-10','files/hypertension_report.pdf'),
(2,2,2,'Childhood Asthma','2025-07-15','files/asthma_report.pdf');

-- Table: treatment
DROP TABLE IF EXISTS treatment;
CREATE TABLE treatment (
    treatment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    medication VARCHAR(225) NOT NULL,
    procedure VARCHAR(200),
    follow_up_date DATE,
    FOREIGN KEY (record_id) REFERENCES health_records(record_id)
);

-- Insert treatment data
INSERT INTO treatment (treatment_id, record_id, medication, procedure, follow_up_date) VALUES 
(1,1,'Amlodipine','1 Tablet after Breakfast','2025-06-24'),
(2,2,'Salbutamol Inhaler','Use 2 puffs when experiencing breathing difficulty ','2025-08-05');

-- Table: doctors (creating basic structure since original was empty)
DROP TABLE IF EXISTS doctors;
CREATE TABLE doctors (
    doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE
);

-- Insert sample doctors data
INSERT INTO doctors (doctor_id, name, specialization, contact_number, email) VALUES 
(1,'Dr. Smith','Cardiologist','9876543210','dr.smith@hospital.com'),
(2,'Dr. Johnson','Pulmonologist','9876543211','dr.johnson@hospital.com');
