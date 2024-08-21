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

router.post("/create", (req, res) => {
    let roomId = generateRoomCode();
    rooms[roomId] = {};
    return res.json({roomId});
});

router.get("/:roomId", (req, res) => {
    let { roomId } = req.params;
    if (!rooms.hasOwnProperty(roomId)) {
        return res.status(404).send();
    }
    rooms[roomId] = [];
    res.sendFile("public/game/chess.html", { root: process.cwd() });
});

module.exports = router;
