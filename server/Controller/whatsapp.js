const { Client } = require("whatsapp-web.js");
const { LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const { cleanupClient } = require("../Utils/cleanupClient");

class CustomLocalAuth extends LocalAuth {
  async logout() {
    try {
      await this.client.destroy();

      // Use a more robust file deletion approach
      if (this.userDataDir && fs.existsSync(this.userDataDir)) {
        try {
          // Use synchronous deletion with better error handling
          fs.rmSync(this.userDataDir, { recursive: true, force: true });
          console.log("Session deleted successfully!");
        } catch (deleteError) {
          console.warn(
            "Could not delete session directory:",
            deleteError.message
          );
          // Don't throw the error, just log it as a warning
        }
      }
      console.log("Disconnected!");
    } catch (error) {
      console.error("Error during logout:", error);
      // Don't throw the error to prevent server crash
    }
  }
}

const initializeClient = (userId, socket, io, userSockets, clients) => {
  // Store the current socket ID for this user
  userSockets[userId] = socket.id;
  console.log(`User ${userId} associated with socket ${socket.id}`);

  // If client already exists and is ready, just update the socket reference
  if (clients[userId] && clients[userId].isReady) {
    console.log(
      `User ${userId} is already logged in. Updating socket reference.`
    );
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
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  // Store the client with its state
  clients[userId] = {
    client: client,
    isReady: false,
    isActive: true, // Flag to track if we should continue with this client
  };

  client.on("qr", async (qr) => {
    // Only emit QR if the client is still active and socket is current
    if (
      clients[userId] &&
      clients[userId].isActive &&
      userSockets[userId] === socket.id
    ) {
      console.log(
        `QR received for user ${userId}, sending to socket ${socket.id}`
      );
      socket.emit("qr", { userId, qrCode: qr });
    } else {
      console.log(
        `QR generated but client inactive or socket changed. Not sending QR.`
      );
      // If socket disconnected or changed, we should stop the client
      if (!userSockets[userId] || userSockets[userId] !== socket.id) {
        cleanupClient(userId, clients);
      }
    }
  });

  client.on("ready", () => {
    console.log(`WhatsApp is ready for ${userId}!`);
    if (clients[userId]) {
      clients[userId].isReady = true;

      // Only emit to the current active socket for this user
      if (userSockets[userId] === socket.id) {
        socket.emit("status", { status: "READY", userId });
      }
    }
  });

  client.on("disconnected", (reason) => {
    console.log(`${userId} disconnected from WhatsApp: ${reason}`);

    // Notify the current socket if it exists
    notifyUser(userId, userSockets, { status: "DISCONNECTED" }, io);

    // Clean up
    cleanupClient(userId, clients);
  });

  client.on("auth_failure", () => {
    console.log(`Auth Failed for ${userId}!`);

    // Notify the current socket if it exists
    // notifyUser(userId, { status: "AUTH_FAILED" },io);

    // Clean up
    cleanupClient(userId, clients);
  });

  // Initialize the client only if it's still active
  if (clients[userId] && clients[userId].isActive) {
    client.initialize().catch((err) => {
      console.error(`Error initializing client for ${userId}:`, err);
      cleanupClient(userId, clients);
      notifyUser(userId, userSockets, { status: "DISCONNECTED" }, io);
    });
  }
};

// Helper function to notify the current user via their active socket
const notifyUser = (userId, userSockets, message, io) => {
  const currentSocketId = userSockets[userId];
  if (currentSocketId) {
    const currentSocket = io.sockets.sockets.get(currentSocketId);
    if (currentSocket) {
      currentSocket.emit("status", message);
    }
  }
};

module.exports = { initializeClient };
