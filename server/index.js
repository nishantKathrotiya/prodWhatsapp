const http = require('http');
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const {Server} = require('socket.io');
const cookieParser = require("cookie-parser");

const dbConnect = require("./Config/Connect");
const {setUpSocket} = require('./Controller/socket')

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  cookie: {
    name: "io",
    path: "/",
    httpOnly: true,
    sameSite: "lax"
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
dotenv.config();
const PORT = process.env.PORT || 4000;

dbConnect();
setUpSocket(io);


// Routes
const authRoutes = require("./Routes/Auth");
const whtsappRoutes = require("./Routes/whtsapp");
const studentRoutes = require("./Routes/Student");
const metatDataRoutes = require("./Routes/MetaData")

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wp", whtsappRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/metadata", metatDataRoutes);

app.get("/", (req, res) => {
  req.header("Access-Control-Allow-Origin", "http://localhost:5173");
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});