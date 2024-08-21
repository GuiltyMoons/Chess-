const express = require("express");
const router = express.Router();

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

router.get("/menu", (req, res) => {
    res.sendFile("public/game/menu.html", { root: process.cwd() });
});

router.post("/create", (req, res) => {
    let roomId = generateRoomCode();
    rooms[roomId] = {};
    return res.json({roomId});
});

router.get("/:roomId", (req, res) => {
    let { roomId } = req.params;
    if (!rooms.hasOwnProperty(roomId)) {
        return res.status(404).send(); //TODO: should not crash
    }
    rooms[roomId] = [];
    res.sendFile("public/game/chess.html", { root: process.cwd() });
});

function initSocket(io) {
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
}

module.exports = {router, initSocket};
