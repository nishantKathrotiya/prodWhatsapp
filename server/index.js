const http = require('http');
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const {Server} = require('socket.io');
const cookieParser = require("cookie-parser");
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/uploadRoutes');

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

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create templates directory if it doesn't exist
const templatesDir = path.join(__dirname, 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir);
}

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
app.use('/api/v1/upload', uploadRoutes);

app.get("/", (req, res) => {
  req.header("Access-Control-Allow-Origin", "http://localhost:5173");
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});