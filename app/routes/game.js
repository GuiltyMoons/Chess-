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
let rooms = {};
let room;

function generateRoomCode() {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 4; i ++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

router.get("/dashboard", (req, res) => {
    return res.sendFile("public/game/dashboard.html", { root: process.cwd() });
});

router.post("/info", async (req, res) => {
    try {
        const query = `SELECT wins FROM users WHERE username = $1`;
        const result = await pool.query(query, [req.user.username]);

        if (result.rows.length > 0) {
            const info = {
                username: req.user.username, 
                wins: result.rows[0].wins
            }
            return res.status(200).json(info);
        } else {
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.sendStatus(500);
    }
});

router.post("/create", (req, res) => {
    let roomId = generateRoomCode();
    
    rooms[roomId] = {
        players:{}, 
        turnOrder: [], 
        turn: 0, 
        board: {}, 
        checkMatedArr: [], 
        winner: null
    };

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

async function initSocket(io) {
    io.use(async (socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        const parsedCookies = parseCookies(cookies);
        const userId = parsedCookies['token'];
        socket.userId = userId;
        const query = `SELECT users.username FROM users JOIN sessions ON users.id = sessions.user_id 
        WHERE sessions.token = $1 `;
        const result = await pool.query(query, [userId]);
        if (result.rows.length > 0) {
            username = result.rows[0].username;
            socket.username = username;
        }
        next();
    });



    io.on("connection", (socket) => {
        let userId = socket.userId;
        let username = socket.username;
        let url = socket.handshake.headers.referer;
        let pathParts = url.split("/");
        let roomId = pathParts[pathParts.length - 1];

        if (!rooms.hasOwnProperty(roomId)) {
            return;
        }

        room = rooms[roomId];
        if (room.players.hasOwnProperty(userId)) {
            let existingPlayer = room.players[userId];
            existingPlayer.socket = socket;
            socket.emit("assignColor", {id: userId, color: existingPlayer.color});

            const playerList = Object.keys(room.players).map(id => ({
                id,
                color: room.players[id].color
            }));
            socket.emit("playerList", playerList);
            
            for (let playerSocket of Object.values(room.players)) {
                if (playerSocket && playerSocket.socket) {
                    playerSocket.socket.emit("playerRejoined", { id: userId, color: existingPlayer.color, board: room.board, username: username});
                }
            }
            if (room.turnOrder.includes(userId)) {
                socket.emit("playerTurn", { playerId: room.turnOrder[room.turn], turnOrder: room.turnOrder });
            }

            socket.on("disconnect", () => {
                delete room.players[userId].socket;
    
                for (let player of Object.values(room.players)) {
                    if (player && player.socket) {
                        player.socket.emit("playerLeft", { id: userId, username: username });
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
                if (from !== null && to !== null) {
                    for (let otherSocketId of room.turnOrder) {
                        if (otherSocketId !== userId) {
                            let otherSocket = room.players[otherSocketId];
                            if (otherSocket && otherSocket.socket) {
                                otherSocket.socket.emit("gameUpdate", { from, to, board });
                                room.board = board;
                            }
                        }
                    }
                }
                if (room.checkMatedArr.length === 3) {
                    room.winner = room.turnOrder.filter(player => !room.checkMatedArr.includes(player));
                    for (let otherSocketId of room.turnOrder) {
                        let otherSocket = room.players[otherSocketId];
                        if (otherSocket && otherSocket.socket) {
                            otherSocket.socket.emit("winner", {winner: room.winner})
                        }
                    }
                };
                room.turn = (room.turn + 1) % room.turnOrder.length;
                const nextPlayer = room.turnOrder[room.turn];   
                for (let otherSocketId of room.turnOrder) {
                    let otherSocket = room.players[otherSocketId];
                    if (otherSocket && otherSocket.socket) {
                        otherSocket.socket.emit("playerTurn", { playerId: nextPlayer, turnOrder: room.turnOrder, username: username });
                    }
                }
            });

            socket.on("message", (msg) => {
                for (let otherSocketId of room.turnOrder) {
                    let otherSocket = room.players[otherSocketId];
                    if (otherSocket && otherSocket.socket) {
                        otherSocket.socket.emit("message", msg);
                    }
                }
            });

            socket.on("checkMated", (playerId) => {
                if (!room.checkMatedArr.includes(playerId)){
                    room.checkMatedArr.push(playerId);
                }
            });

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
                    playerSocket.socket.emit("playerJoined", { id: userId, color: playerColor, username: username});
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
            socket.disconnect();
            return;
        }

        socket.on("disconnect", async () => {
            delete room.players[userId].socket;

            for (let player of Object.values(room.players)) {
                if (player && player.socket) {
                    player.socket.emit("playerLeft", { id: userId, username: username });
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
            if (from !== null && to !== null) {
                for (let otherSocketId of room.turnOrder) {
                    if (otherSocketId !== userId) {
                        let otherSocket = room.players[otherSocketId];
                        if (otherSocket && otherSocket.socket) {
                            otherSocket.socket.emit("gameUpdate", { from, to, board });
                            room.board = board;
                        }
                    }
                }
            }
            if (room.checkMatedArr.length === 3) {
                room.winner = room.turnOrder.filter(player => !room.checkMatedArr.includes(player));
                for (let otherSocketId of room.turnOrder) {
                    let otherSocket = room.players[otherSocketId];
                    if (otherSocket && otherSocket.socket) {
                        otherSocket.socket.emit("winner", {winner: room.winner})
                    }
                }
            };
            room.turn = (room.turn + 1) % room.turnOrder.length;
            const nextPlayer = room.turnOrder[room.turn];   
            for (let otherSocketId of room.turnOrder) {
                let otherSocket = room.players[otherSocketId];
                if (otherSocket && otherSocket.socket) {
                    otherSocket.socket.emit("playerTurn", { playerId: nextPlayer, turnOrder: room.turnOrder });
                }
            }
        });

        socket.on("message", (msg) => {
            for (let otherSocketId of room.turnOrder) {
                let otherSocket = room.players[otherSocketId];
                if (otherSocket && otherSocket.socket) {
                    otherSocket.socket.emit("message", msg);
                }
            }
        });

        socket.on("checkMated", (playerId) => {
            if (!room.checkMatedArr.includes(playerId)){
                room.checkMatedArr.push(playerId);
            }
        });
        
        //TODO: Wins get incremented twice for some reason.
        socket.once("getWinner", async ({ winner }) => {
            let user_id = room.winner;
            const updateWinsQuery = `UPDATE users SET wins = wins + 1 FROM sessions WHERE sessions.token = $1 AND sessions.user_id = users.id`;
    
            try {
                await pool.query(updateWinsQuery, [user_id.toString()]);
                console.log(`Player with ID ${user_id} has been awarded a win.`);
            } catch (error) {
                console.error("Error updating wins for player:", error);
            }
        });
    });
}

module.exports = {router, initSocket};
