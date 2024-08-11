DROP DATABASE IF EXISTS login_db;
CREATE DATABASE login_db;
\c login_db

CREATE TABLE users (
	id SERIAL PRIMARY KEY,                -- Unique identifier for each user
    username VARCHAR(50) NOT NULL UNIQUE, -- Username for login, must be unique
    email VARCHAR(100) NOT NULL UNIQUE,   -- Email address, must be unique
    password_hash VARCHAR(255) NOT NULL   -- Hashed password for security
);
