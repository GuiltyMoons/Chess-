DROP DATABASE IF EXISTS chesspp;
CREATE DATABASE chesspp;
\c chesspp

CREATE TABLE users (
	id SERIAL PRIMARY KEY,                -- Unique identifier for each user
    username VARCHAR(50) NOT NULL UNIQUE, -- Username for login, must be unique
    email VARCHAR(100) NOT NULL UNIQUE,   -- Email address, must be unique
    password_hash VARCHAR(255) NOT NULL   -- Hashed password for security
);
