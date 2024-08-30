const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

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
    rooms[roomId] = {players:{}, turnOrder: [], turn: 0};
    return res.json({roomId});
});

router.get("/:roomId", (req, res) => {
    let { roomId } = req.params;
    if (!rooms.hasOwnProperty(roomId)) {
	    return res.status(404).sendFile("public/error/404.html", { root: process.cwd() }); //TODO: Maybe change this?
    }
    return res.sendFile("public/game/chess.html", { root: process.cwd() });
});

function initSocket(io) {
    io.on("connection", (socket) => {
        let url = socket.handshake.headers.referer;
        let pathParts = url.split("/");
        let roomId = pathParts[pathParts.length - 1];

        if (!rooms.hasOwnProperty(roomId)) {
            return;
        }

        let room = rooms[roomId];

        const colors = ["blue", "green", "red", "yellow"];
        if (Object.keys(room.players).length < colors.length) {
            let playerColor = colors[Object.keys(room.players).length];
            room.players[socket.id] = { color: playerColor, socket: socket };
            room.turnOrder.push(socket.id);
            socket.emit("assignColor", { color: playerColor });

            for (let playerSocket of Object.values(room.players)) {
                if (playerSocket && playerSocket.socket) {
                    playerSocket.socket.emit("playerJoined", { id: socket.id, color: playerColor})
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
            room.turnOrder = room.turnOrder.filter(id => id !== socket.id);

            for (let player of Object.values(room.players)) {
                if (player && player.socket) {
                    player.socket.emit("playerLeft", socket.id);
                }
            }
        });

        socket.on("gameUpdate", ({ from, to }) => {
            for (let otherSocketId of room.turnOrder) {
                if (otherSocketId !== socket.id) {
                    let otherSocket = room.players[otherSocketId];
                    if (otherSocket && otherSocket.socket) {
                        otherSocket.socket.emit("gameUpdate", { from, to });
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
