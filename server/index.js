const express = require("express");
const {Server} = require('socket.io');
const http = require('http');
const { Client } = require('whatsapp-web.js');
const { LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const {socketUserIdExtract , isLoggedin} = require('./Middleware/AuthMiddleware')

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

// Other imports and setup...
const dbConnect = require("./Config/Connect");
const cookieParser = require("cookie-parser");
const cookie = require('cookie');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connect
dbConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Routes
const authRoutes = require("./Routes/Auth");
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  req.header("Access-Control-Allow-Origin", "http://localhost:5173");
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});






const clients = {};
// Map userIds to their active socket IDs
const userSockets = {};

class CustomLocalAuth extends LocalAuth {
    async logout() {
        try {
            await this.client.destroy();
            fs.rm(this.userDataDir, { recursive: true, force: true }, (err) => {
                if (err) {
                    throw new Error(err);
                } else {
                    console.log('Session deleted!');
                    console.log('Disconnected!');
                }
            });
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }
}

const initializeClient = (userId, socket) => {
    // Store the current socket ID for this user
    userSockets[userId] = socket.id;
    console.log(`User ${userId} associated with socket ${socket.id}`);

    // If client already exists and is ready, just update the socket reference
    if (clients[userId] && clients[userId].isReady) {
        console.log(`User ${userId} is already logged in. Updating socket reference.`);
        socket.emit("status", { status: "READY", userId });
        return;
    }

    // If there's an existing initializing client, destroy it first
    if (clients[userId] && clients[userId].client) {
        console.log(`Destroying existing initializing client for ${userId}`);
        try {
            clients[userId].client.destroy();
        } catch (err) {
            console.log(`Error destroying existing client: ${err}`);
        }
    }

    // Create a new client
    const client = new Client({
        authStrategy: new CustomLocalAuth({ clientId: userId }),
        puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    });

    // Store the client with its state
    clients[userId] = {
        client: client,
        isReady: false,
        isActive: true  // Flag to track if we should continue with this client
    };

    client.on('qr', async (qr) => {
        // Only emit QR if the client is still active and socket is current
        if (clients[userId] && clients[userId].isActive && userSockets[userId] === socket.id) {
            console.log(`QR received for user ${userId}, sending to socket ${socket.id}`);
            socket.emit("qr", { userId, qrCode: qr });
        } else {
            console.log(`QR generated but client inactive or socket changed. Not sending QR.`);
            // If socket disconnected or changed, we should stop the client
            if (!userSockets[userId] || userSockets[userId] !== socket.id) {
                cleanupClient(userId);
            }
        }
    });

    client.on('ready', () => {
        console.log(`WhatsApp is ready for ${userId}!`);
        if (clients[userId]) {
            clients[userId].isReady = true;
            
            // Only emit to the current active socket for this user
            if (userSockets[userId] === socket.id) {
                socket.emit("status", { status: "READY", userId });
            }
        }
    });

    client.on('disconnected', (reason) => {
        console.log(`${userId} disconnected from WhatsApp: ${reason}`);
        
        // Notify the current socket if it exists
        notifyUser(userId, { status: "DISCONNECTED" });
        
        // Clean up
        cleanupClient(userId);
    });

    client.on('auth_failure', () => {
        console.log(`Auth Failed for ${userId}!`);
        
        // Notify the current socket if it exists
        notifyUser(userId, { status: "AUTH_FAILED" });
        
        // Clean up
        cleanupClient(userId);
    });

    // Initialize the client only if it's still active
    if (clients[userId] && clients[userId].isActive) {
        client.initialize().catch(err => {
            console.error(`Error initializing client for ${userId}:`, err);
            cleanupClient(userId);
        });
    }

};

// Helper function to notify the current user via their active socket
const notifyUser = (userId, message) => {
    const currentSocketId = userSockets[userId];
    if (currentSocketId) {
        const currentSocket = io.sockets.sockets.get(currentSocketId);
        if (currentSocket) {
            currentSocket.emit("status", message);
        }
    }
};

// Helper function to properly clean up a client
const cleanupClient = (userId) => {
    if (clients[userId]) {
        console.log(`Cleaning up client for ${userId}`);
        
        // Mark as inactive first to prevent more QR generation
        clients[userId].isActive = false;
        
        try {
            if (clients[userId].client) {
                clients[userId].client.destroy();
            }
        } catch (err) {
            console.error(`Error destroying client for ${userId}:`, err);
        }
        
        delete clients[userId];
    }
};

// Socket.IO Connection
io.on("connection", async (socket) => {

    console.log(`New socket connection: ${socket.id}`);
    let associatedUserId = null;

    socket.on("login", async() => {
        const userId = await socketUserIdExtract(cookie.parse(socket.request.headers.cookie).token,socket)
        console.log(`Login request for ${userId} from socket ${socket.id}`);
        associatedUserId = userId;  // Store the userId associated with this socket
        initializeClient(userId, socket);
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        
        // Find if this socket is associated with any user
        for (const [userId, socketId] of Object.entries(userSockets)) {
            if (socketId === socket.id) {
                console.log(`User ${userId} socket disconnected`);
                delete userSockets[userId];
                
                // Clean up the client immediately to stop QR generation
                if (clients[userId] && !clients[userId].isActive) {
                    clients[userId].isActive = false;  // Mark as inactive to stop QR gen
                    
                    // Optional: Destroy after a short delay to allow for quick reconnections
                    setTimeout(() => {
                        if (!userSockets[userId] && clients[userId]) {
                            console.log(`No quick reconnection for ${userId}, destroying client`);
                            cleanupClient(userId);
                        }
                    }, 5000); // 5 seconds delay before full cleanup
                }
            }
        }
        
        // Also check the local variable if socket disconnects before loop runs
        if (associatedUserId && userSockets[associatedUserId] === socket.id) {
            delete userSockets[associatedUserId];
            
            if (clients[associatedUserId]) {
                clients[associatedUserId].isActive = false;
                
                setTimeout(() => {
                    if (!userSockets[associatedUserId] && clients[associatedUserId]) {
                        cleanupClient(associatedUserId);
                    }
                }, 5000);
            }
        }
    });
    
    // Allow explicit cancellation of QR generation
    socket.on("cancel-login", (userId) => {
        console.log(`Explicitly canceling login for ${userId}`);
        if (userSockets[userId] === socket.id) {
            cleanupClient(userId);
        }
    });
});


// API endpoints
app.get('/status/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!clients[userId]) {
    return res.status(400).json({ error: 'User not logged in' });
  }
  res.json({ 
    success: true, 
    userId, 
    status: clientStates[userId] || "UNKNOWN" 
  });
});

app.post('/send-message/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { phoneNumber, message } = req.body;

  if (!clients[userId]) {
    return res.status(400).json({ error: 'User not logged in' });
  }
  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required' });
  }

  try {
    const response = await clients[userId].sendMessage(phoneNumber + '@c.us', message);
    res.json({ success: true, message: 'Message sent', response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error });
  }
});

// app.post('/send-all/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   const { phoneNumbers, message } = req.body;  // Expecting an array of phone numbers

//   if (!clients[userId]) {
//     return res.status(400).json({ error: 'User not logged in' });
//   }
//   if (!phoneNumbers || !message) {
//     return res.status(400).json({ error: 'Phone numbers and message are required' });
//   }
//   if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
//     return res.status(400).json({ error: 'Phone numbers should be an array and cannot be empty' });
//   }

//   try {
//     const sendMessagePromises = phoneNumbers.map(phoneNumber => {
//       return clients[userId].client.sendMessage(phoneNumber + '@c.us', message);
//     });

//     // Wait for all messages to be sent
//     const responses = await Promise.all(sendMessagePromises);
    
//     res.json({ success: true, message: 'Messages sent', responses });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to send messages', error });
//   }
// });


app.post('/send-all', isLoggedin,async (req, res) => {
  const userId = req.user.id;
  const { selectedIds } = req.body;  // Expecting an array of phone numbers

  if (!clients[userId]) {
    return res.json({success:false, message: 'User not logged in' });
  }
  if (!selectedIds) {
    return res.json({ success:false,message: 'Phone numbers are required' });
  }
  if (!Array.isArray(selectedIds) ||selectedIds.length === 0) {
    return res.json({success:false, message: 'Phone numbers should be an array and cannot be empty' });
  }

  try {
    const sendMessagePromises = selectedIds.map(data => {
      return clients[userId].client.sendMessage(data.contactNo + '@c.us', data.studentId);
    });

    // Wait for all messages to be sent
    const responses = await Promise.all(sendMessagePromises);
    
    res.json({ success: true, message: 'Messages sent', responses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send messages', error });
  }
});

app.get('/logout/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  if (clients[userId] && clients[userId].client) {
    try {
    
      clients[userId].isActive = false;
      await clients[userId].client.logout();
      await clients[userId].client.destroy();
      delete clients[userId];
      delete userSockets[userId];
      res.json({ success: true, message: `User ${userId} logged out.` });
    } catch (error) {
      console.error(`Error during logout for ${userId}:`, error);
      
      // Even if there's an error, try to clean up
      if (clients[userId]) {
        if (clients[userId].client) {
          try {
            await clients[userId].client.destroy();
          } catch (e) {
            console.error("Error destroying client:", e);
          }
        }
        delete clients[userId];
      }
      delete userSockets[userId];
      
      res.status(500).json({ 
        success: false, 
        message: `Error during logout: ${error.message}`,
        error: error.toString()
      });
    }
  } else {
    res.status(400).json({ error: 'User not logged in' });
  }
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});