const pg = require("pg");
const express = require("express");
const path = require("path");
const app = express();

const port = 3000;
const hostname = "localhost";

const env = require("./env.json");
const Pool = pg.Pool;
const pool = new Pool(env);

app.use(express.static("public"));
app.use(express.json());

//TODO: refactor code into /routes/auth.js
//start of auth code
app.get('/signup', (req, res) => {
    res.sendFile("public/auth/signup.html", { root: __dirname });
});

app.post('/signup', async (req, res) => {
    //TODO: Request Validation
    const { username, email, password } = req.body;

    //TODO: Hashing. use bcrypt?
    let hashedPassword = password;
    try {
        await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.get('/login', (req, res) => {
    res.sendFile("public/auth/login.html", { root: __dirname });
});

//end of auth code

pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
