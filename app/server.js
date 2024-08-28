// make this script's dir the cwd
// b/c npm run start doesn't cd into src/ to run this
// and if we aren't in its cwd, all relative paths will break
process.chdir(__dirname);

const express = require("express");
const { Pool } = require("pg");
const { Server } = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");

let host;
const port = 3000;

const app = express();
const { router: authRoutes, authenticateToken } = require("./routes/auth");
const { router: gameRoutes, initSocket} = require("./routes/game");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/game/*", authenticateToken);
app.use("/game", gameRoutes);
initSocket(io);

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

app.get("*", (req, res) => {
	return res.status(404).sendFile("public/error/404.html", { root: process.cwd() });
});

server.listen(port, host, () => {
    console.log(`Listening at: http://${host}:${port}`);
});
