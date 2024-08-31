const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
    databaseConfig = { connectionString: process.env.DATABASE_URL };
} else {
    const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
    databaseConfig = { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT };
}

const pool = new Pool(databaseConfig);
router.use(express.static("public"));

function generateRoomCode() {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 4; i ++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

let rooms = {}; //TODO: move

router.get("/dashboard", (req, res) => {
    return res.sendFile("public/game/dashboard.html", { root: process.cwd() });
});

router.post("/username", async (req, res) => {
    return res.status(200).json({ username: req.user.username});
});

router.post("/create", (req, res) => {
    let roomId = generateRoomCode();
    rooms[roomId] = {players:{}, turnOrder: [], turn: 0, board: {}};
    return res.json({roomId});
});

router.get("/:roomId", (req, res) => {
    let { roomId } = req.params;
    if (!rooms.hasOwnProperty(roomId)) {
	    return res.status(404).sendFile("public/error/404.html", { root: process.cwd() });
    }
    return res.sendFile("public/game/chess.html", { root: process.cwd() });
});

function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(";").forEach(cookie => {
            const [name, value] = cookie.split("=").map(c => c.trim());
            cookies[name] = value;
        });
    }
    return cookies;
}

function initSocket(io) {
    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        const parsedCookies = parseCookies(cookies);
        const userId = parsedCookies['token'];
        socket.userId = userId;
        next();
    });

    io.on("connection", (socket) => {
        let userId = socket.userId;
        let url = socket.handshake.headers.referer;
        let pathParts = url.split("/");
        let roomId = pathParts[pathParts.length - 1];

        if (!rooms.hasOwnProperty(roomId)) {
            return;
        }

        let room = rooms[roomId];
        console.log(room);
        if (room.players.hasOwnProperty(userId)) { //TODO: PLAYER RECONNECT MISSING ACCOUNT IDENTIFICATION
            let existingPlayer = room.players[userId];
            socket.emit("assignColor", {id: userId, color: existingPlayer.color});
            
            for (let playerSocket of Object.values(room.players)) {
                if (playerSocket && playerSocket.socket && playerSocket.userId !== userId) {
                    //TODO: CAN NOT TEST SAVED BOARD STATE UNTIL PLAYER CAN RECONNECT
                    playerSocket.socket.emit("playerRejoined", { id: userId, color: existingPlayer.color, board: room.board})
                }
            }
            if (room.turnOrder.includes(userId)) {
                socket.emit("playerTurn", { playerId: room.turnOrder[room.turn], turnOrder: room.turnOrder });
            }
            return;
        }

        const colors = ["blue", "green", "red", "yellow"];
        if (Object.keys(room.players).length < colors.length) {
            let playerColor = colors[Object.keys(room.players).length];
            room.players[userId] = { color: playerColor, socket: socket };
            room.turnOrder.push(userId);
            socket.emit("assignColor", { id: userId, color: playerColor });

            const playerList = Object.keys(room.players).map(id => ({
                id,
                color: room.players[id].color
            }));
            socket.emit("playerList", playerList);

            for (let playerSocket of Object.values(room.players)) {
                if (playerSocket && playerSocket.socket) {
                    playerSocket.socket.emit("playerJoined", { id: userId, color: playerColor})
                }
            }

            if (room.turnOrder.length === 1) {
                room.turn = 0;
                for (let otherSocketId of room.turnOrder) {
                    let otherSocket = room.players[otherSocketId];
                    if (otherSocket && otherSocket.socket) {
                        otherSocket.socket.emit("playerTurn", { playerId: room.turnOrder[room.turn], turnOrder: room.turnOrder });
                    }
                }
            }
        } else {
            socket.emit("roomFull");
            socket.disconnect(); //This can be changed to redirect to menu or spec later
            return;
        }

        socket.on("disconnect", () => {
            delete room.players[socket.id];
            room.turnOrder = room.turnOrder.filter(id => id !== userId);

            for (let player of Object.values(room.players)) {
                if (player && player.socket) {
                    player.socket.emit("playerLeft", { id: userId });
                }
            }

            const updatedPlayerList = Object.entries(room.players).map(([id, player]) => ({
                id,
                color: player.color
            }));
            for (let player of Object.values(room.players)) {
                if (player && player.socket) {
                    player.socket.emit("playerList", updatedPlayerList);
                }
            }
        });

        socket.on("gameUpdate", ({ from, to, board }) => {
            for (let otherSocketId of room.turnOrder) {
                if (otherSocketId !== userId) {
                    let otherSocket = room.players[otherSocketId];
                    if (otherSocket && otherSocket.socket) {
                        otherSocket.socket.emit("gameUpdate", { from, to, board });
                        room.board = board;
                    }
                }
            }
            room.turn = (room.turn + 1) % room.turnOrder.length;
            const nextPlayer = room.turnOrder[room.turn];
            for (let otherSocketId of room.turnOrder) {
                let otherSocket = room.players[otherSocketId];
                if (otherSocket && otherSocket.socket) {
                    otherSocket.socket.emit("playerTurn", { playerId: nextPlayer, turnOrder: room.turnOrder });
                }
            }
        });
    });
}

module.exports = {router, initSocket};
