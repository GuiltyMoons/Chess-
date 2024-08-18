const pg = require("pg");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const hostname = "localhost";

let http = require("http");
let { Server } = require("socket.io");
let server = http.createServer(app);
let io = new Server(server);

const env = require("./env.json");
const Pool = pg.Pool;
const pool = new Pool(env);

app.use(express.static("public"));
app.use(express.json());

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

app.get("/", (req, res) => {
    res.sendFile("public/game/menu.html", { root: __dirname });
});

let rooms = {};

function generateRoomCode() {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 4; i ++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

app.post("/create", (req, res) => {
    let roomId = generateRoomCode();
    rooms[roomId] = {};
    return res.json({roomId});
});

app.get("/game/:roomId", (req, res) => {
    let { roomId } = req.params;
    if (!rooms.hasOwnProperty(roomId)) {
        return res.status(404).send();
    }
    rooms[roomId] = [];
    res.sendFile("public/game/chess.html", { root: __dirname });
});

io.on("connection", (socket) => {
    let url = socket.handshake.headers.referer;
    let pathParts = url.split("/");
    let roomId = pathParts[pathParts.length - 1];

    if (!rooms.hasOwnProperty(roomId)) {
        return;
    }

    rooms[roomId][socket.id] = socket;

    socket.on("disconnect", () => {
        delete rooms[roomId][socket.id];
    });

    socket.on("gameUpdate", ({ from, to }) => {
        for (let otherSocket of Object.values(rooms[roomId])) {
            if (otherSocket.id === socket.id){
                continue;
            }
            otherSocket.emit("gameUpdate", { from, to });
        }
    });
});

pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

server.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
