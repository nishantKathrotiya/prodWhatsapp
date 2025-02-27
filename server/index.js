const express = require("express");
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"],
	  credentials: true,
	},
  });

  const authRoutes = require("./Routes/Auth");
// const userRoutes = require("./routes/User");
// const tournamentRoutes = require("./routes/Tournament");
// const publicRoutes = require("./routes/Public");
// const  scoreRoutes  = require("./routes/Score");
// const contestRoutes = require("./routes/contest");
// const editRoutes = require("./routes/Edit")
// const {setupSocketLogic} = require("./controller/socket");



const dbConnect = require("./Config/Connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
dbConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);


//routes
app.use("/api/v1/auth", authRoutes);
// app.use("/admin/tournament", tournamentRoutes);
// app.use("/public",publicRoutes);
// app.use("/admin/score",scoreRoutes);
// app.use("/admin/contest",contestRoutes);
// app.use("/edit",editRoutes)
// setupSocketLogic(io);

app.get("/", (req, res) => {
	req.header("Access-Control-Allow-Origin", "http://localhost:3000");
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});


server.listen(PORT, () => {
	console.log(`App is running at ${PORT}`);
  });