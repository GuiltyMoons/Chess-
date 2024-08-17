const express = require("express");
const router = express.Router();
const pg = require("pg");
const bcrypt = require("bcrypt");
const Pool = pg.Pool;
const pool = new Pool(require("../env.json"));

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

router.post("/login", (req, res) => {
    // TODO: Login validation
});

module.exports = router;
