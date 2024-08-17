const express = require("express");
const router = express.Router();
const pg = require("pg");
const Pool = pg.Pool;
const pool = new Pool(require("../env.json"));

router.get("/signup", (req, res) => {
    res.sendFile("public/auth/signup.html", { root: process.cwd() });
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    // TODO: Hashing with bcrypt
    let hashedPassword = password;
    try {
        await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/login", (req, res) => {
    res.sendFile("public/auth/login.html", { root: process.cwd() });
});

router.post("/login", (req, res) => {
    // TODO: Login validation
});

module.exports = router;
