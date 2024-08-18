const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

if (process.env.NODE_ENV == "production") {
	databaseConfig = { connectionString: process.env.DATABASE_URL };
} else {
	let { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
	databaseConfig = { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT };
}

let pool = new Pool(databaseConfig);

//TODO: Ask about rate limiting the pages. How much do we care about security?

router.get("/signup", (req, res) => {
    res.sendFile("public/auth/signup.html", { root: process.cwd() });
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email, and password are required.",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email.",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long.",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        if (error.code === "23505") { // Postgres error code for unique violation (username or email already exists)
            const field = error.detail.match(/\((.*?)\)/)[1];
            const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

            return res.status(400).json({ message: `${capitalizedField} already exists.` });
        }
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

router.get("/login", (req, res) => {
    res.sendFile("public/auth/login.html", { root: process.cwd() });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required.",
        });
    }

    try {
        const userResult = await pool.query("SELECT username, password_hash FROM users WHERE username = $1", [username]); //TODO: ask about sql injection attacks? idk

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        return res.status(200).json({ message: "Login successful" }); //TODO: create cookie/JWT token
    } catch (error) {
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

module.exports = router;
