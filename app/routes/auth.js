const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

if (process.env.NODE_ENV === "production") {
    databaseConfig = { connectionString: process.env.DATABASE_URL };
} else {
    const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
    databaseConfig = { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT };
}

const pool = new Pool(databaseConfig);
router.use(cookieParser());

function authenticateToken(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(403).sendFile("public/error/403.html", { root: process.cwd() });
    }

    pool.query("SELECT user_id FROM sessions WHERE token = $1", [token], async (err, result) => {
        if (err || !result || result.rows.length === 0) {
            return res.status(403).sendFile("public/error/403.html", { root: process.cwd() });
        }

        try {
            const userResult = await pool.query("SELECT username FROM users WHERE id = $1", [result.rows[0].user_id]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = {
                id: result.rows[0].user_id,
                username: userResult.rows[0].username,
            };

            next();
        } catch (error) {
            console.error("Error fetching user information:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
};

function makeToken() {
    return crypto.randomBytes(32).toString("hex");
}

router.get("/signup", (req, res) => {
    const { token } = req.cookies;
    if (token) {
        pool.query("SELECT 1 FROM sessions WHERE token = $1", [token], (err, result) => {
            if (result && result.rows.length > 0) {
                return res.redirect("/game/dashboard");
            }
            res.sendFile("public/auth/signup.html", { root: process.cwd() });
        });
    } else {
        res.sendFile("public/auth/signup.html", { root: process.cwd() });
    }
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
        if (error.code === "23505") {
            const field = error.detail.match(/\((.*?)\)/)[1];
            const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

            return res.status(400).json({ message: `${capitalizedField} already exists.` });
        }
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

router.get("/login", (req, res) => {
    const { token } = req.cookies;
    if (token) {
        pool.query("SELECT 1 FROM sessions WHERE token = $1", [token], (err, result) => {
            if (result && result.rows.length > 0) {
                return res.redirect("/game/dashboard");
            }
            res.sendFile("public/auth/login.html", { root: process.cwd() });
        });
    } else {
        res.sendFile("public/auth/login.html", { root: process.cwd() });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required.",
        });
    }

    try {
        const userResult = await pool.query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        const token = makeToken();
        await pool.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [user.id, token]);

        return res.cookie("token", token, cookieOptions).send();
    } catch (error) {
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

router.post("/logout", async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        console.log("Already logged out");
        return res.sendStatus(400);
    }

    try {
        const deleteResult = await pool.query("DELETE FROM sessions WHERE token = $1", [token]);

        if (deleteResult.rowCount === 0) {
            console.log("Token doesn't exist");
            return res.sendStatus(400);
        }

        return res.clearCookie("token", cookieOptions).sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

module.exports = {
    router,
    authenticateToken
};
