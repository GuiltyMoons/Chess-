const express = require("express");
const router = express.Router();

router.use(express.static("public"));

router.get("/", (req, res) => {
    res.sendFile("public/index.html", { root: process.cwd() });
});

module.exports = router;
