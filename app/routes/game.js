const express = require("express");
const router = express.Router();

router.use(express.static("public"));

router.get("/play", (req, res) => {
    res.sendFile("public/game/chess.html", { root: process.cwd() });
});

module.exports = router;
