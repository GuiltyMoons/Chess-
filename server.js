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

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
