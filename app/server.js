// make this script's dir the cwd
// b/c npm run start doesn't cd into src/ to run this
// and if we aren't in its cwd, all relative paths will break
process.chdir(__dirname);

const express = require("express");
const { Pool } = require("pg");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
let host;
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));



// fly.io sets NODE_ENV to production automatically, otherwise it's unset when running locally
let databaseConfig;
if (process.env.NODE_ENV == "production") {
	host = "0.0.0.0";
	databaseConfig = { connectionString: process.env.DATABASE_URL };
} else {
	host = "localhost";
	let { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
	databaseConfig = { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT };
}

let pool = new Pool(databaseConfig);
pool.connect().then(() => {
	console.log("Connected to db"); 
});

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

// sockets from jason

let rooms = {};

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

//

//TODO: This is basically a try-catch block. If a user tries to access a page taht doesnt exist, they just default go to the signup page.
app.get("*", (req, res) => {
    // res.redirect("/auth/signup");
	res.redirect("/game/menu.html"); //TODO: add signup and login button to this redirect
});

server.listen(port, host, () => {
    console.log(`Listening at: http://${host}:${port}`);
});
