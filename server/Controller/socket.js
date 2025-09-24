const { socketUserIdExtract } = require("../Middleware/AuthMiddleware");
const { initializeClient } = require("./whatsapp");
const cookie = require("cookie");
const { cleanupClient } = require("../Utils/cleanupClient");
const Student = require("../Modal/Student");
const History = require("../Modal/History");
const userSockets = {};
const clients = {};
// Socket.IO Connection
const setUpSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    let associatedUserId = null;

    socket.on("login", async () => {
      const userId = await socketUserIdExtract(
        cookie.parse(socket.request.headers.cookie).token,
        socket
      );
      console.log(`Login request for ${userId} from socket ${socket.id}`);
      associatedUserId = userId; // Store the userId associated with this socket
      initializeClient(userId, socket, io, userSockets, clients);
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
            clients[userId].isActive = false; // Mark as inactive to stop QR gen

            // Optional: Destroy after a short delay to allow for quick reconnections
            setTimeout(() => {
              if (!userSockets[userId] && clients[userId]) {
                console.log(
                  `No quick reconnection for ${userId}, destroying client`
                );
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
              cleanupClient(associatedUserId, clients);
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
};
// API endpoints
const checkStatus = async (req, res) => {
  const userId = req.user.id;
  if (!clients[userId]) {
    return res.json({
      success: true,
      status: false,
    });
  }
  res.json({
    success: true,
    status: clients[userId].isReady,
  });
};

const sendSingle = async (req, res) => {
  const userId = req.params.userId;
  const { phoneNumber, message } = req.body;

  if (!clients[userId]) {
    return res.status(400).json({ error: "User not logged in" });
  }
  if (!phoneNumber || !message) {
    return res
      .status(400)
      .json({ error: "Phone number and message are required" });
  }

  try {
    const response = await clients[userId].sendMessage(
      phoneNumber + "@c.us",
      message
    );
    res.json({ success: true, message: "Message sent", response });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send message", error });
  }
};

const sendAll = async (req, res) => {
  const userId = req.user.id;
  const { selectedIds } = req.body; // Expecting an array of phone numbers

  if (!clients[userId]) {
    return res.json({ success: false, message: "User not Connected" });
  }
  if (!selectedIds) {
    return res.json({ success: false, message: "Phone numbers are required" });
  }
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
    return res.json({
      success: false,
      message: "Phone numbers should be an array and cannot be empty",
    });
  }

  try {
    const sendMessagePromises = selectedIds.map((data) => {
      return clients[userId].client.sendMessage(
        data.contactNo + "@c.us",
        data.studentId
      );
    });

    // Wait for all messages to be sent
    const responses = await Promise.all(sendMessagePromises);

    res.json({ success: true, message: "Messages sent", responses });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send messages", error });
  }
};

const logout = async (req, res) => {
  const userId = req.user.id;

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
        error: error.toString(),
      });
    }
  } else {
    res.status(400).json({ error: "User not logged in" });
  }
};

const tempSend = async (req, res) => {
  try {
    // MongoDB query to fetch all documents
    const allStudents = await Student.find({});

    const mobileNumbers = [];
    const studentsMissingNumbers = [];

    allStudents.forEach((student) => {
      if (student.homeNumber) {
        mobileNumbers.push("91" + student.homeNumber);
      }
      if (!student.homeNumber && student.emergencyNumber) {
        mobileNumbers.push("91" + student.emergencyNumber);
      }
      if (!student.homeNumber && !student.emergencyNumber) {
        studentsMissingNumbers.push(student.rollNo);
      }
    });

    const msgString =
      "Respected Parents,\n\nYour son/daughter was absent for today's exam. Please take serious note of this.\n\nRegards,\nCounselor";
    const tempNumbers = ["918347296122", "918320185820", "918460752501"];
    mobileNumbers.push("919925307605");
    if (!clients[req.user._id]) {
      return res.json({ success: false, message: "User not Connected" });
    }

    const sendMessagePromises = mobileNumbers.map((data) => {
      return clients[req.user.id].client.sendMessage(data + "@c.us", msgString);
    });

    // Wait for all messages to be sent
    // const responses = await Promise.all(sendMessagePromises);

    // res.json({ success: true, message: 'Messages sent', responses });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send messages12", error });
  }
};

const sendMessages = async (req, res) => {
  const userId = req.user.id;
  const { selectedIds, message } = req.body;

  // Check if user is connected
  if (!clients[userId]) {
    return res.json({ success: false, message: "Whatsapp not Connected" });
  }
  // Validate request body
  if (!selectedIds || !message) {
    return res.json({ success: false, message: "Data Missing" });
  }

  if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
    return res.json({ success: false, message: "No Students are selected" });
  }

  try {
    // Extract all student IDs from the selectedIds array
    const studentIds = selectedIds.map((student) => student.studentId);

    const students = await Student.find({
      studentId: { $in: studentIds },
    }).select("firstName lastName homeNumber studentId _id");

    // Now map through the selectedIds to prepare the data for sending messages
    const contactPromises = students.map(async (student) => {
      // If no student data is found for a given student ID
      if (student.homeNumber) {
        // Return the object containing student name, parent contact, and student ID
        return {
          name: student.firstName + " " + student.lastName,
          contactNo: "91" + student.homeNumber,
          studentId: student.studentId,
        };
      }
      return null; // Return null for students without a homeNumber
    });

    // Resolve all contact promises
    const contacts = await Promise.all(contactPromises);

    // Filter out any null or undefined values from the contacts array
    const validContacts = contacts.filter(
      (contact) => contact !== null && contact !== undefined
    );

    // Map through the contacts array and send messages
    // const sendMessagePromises = validContacts.map((data) => {
    //   return clients[userId].client.sendMessage(data.contactNo + '@c.us', message);
    // });

    const sendMessagePromises = validContacts.map(async (data) => {
      try {
        const chatId = data.contactNo + "@c.us";
        await clients[userId].client.sendMessage(chatId, message);
        return {
          contact: chatId,
          success: true,
          contactNo: data.contactNo,
          studentId: data.studentId,
          name: data.name,
        };
      } catch (err) {
        console.error(`Failed to send to ${data.contactNo}: ${err.message}`);
        return {
          contact: data.contactNo,
          success: false,
          error: err.message,
          contactNo: data.contactNo,
          studentId: data.studentId,
          name: data.name,
        };
      }
    });

    // Wait for all messages to be sent
    const responses = await Promise.all(sendMessagePromises);

    // Get current Indian date (IST timezone)
    const indianDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const messagesToInsert = responses.map((response) => {
      return {
        sender: req.user.phoneNumber || "system", // Use user's phone number or default
        receiver: response.contactNo, // Receiver's phone number
        message: message, // Message body
        timestamp: indianDate, // Current Indian date
        status: response.success ? "success" : "failed", // Success/failure status
        senderId: req.user.employeeId, // User ID who sent the message
      };
    });

    // Insert the messages in a single write operation (bulk insert)
    await History.insertMany(messagesToInsert);
    // Send success response

    res.json({ success: true, message: "Messages sent" });
  } catch (error) {
    // Handle errors
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send messages",
      error: error.message,
    });
  }
};

const arraySend = async (req, res) => {
  try {
    // MongoDB query to fetch all documents
    const mobileNumbers = [
      918347296122, 918460752501, 919265256348, 919638766520, 919925121637,
      919978288188, 919227014988, 919825136492, 919825424035, 919825151261,
    ];
    var msgString =
      "Dear Parent,\n" +
      "\n" +
      "This is to inform you that your son/daughter was absent for the Class Test (CIE) conducted on 18th April 2025 for the subject Programming with C++.\n" +
      "\n" +
      "We kindly request you to speak with your ward regarding this absence. If you require any further clarification, please feel free to contact Dr. Parth Goel at the Sophos Lab (Room No. 316), 2nd Floor, DEPSTAR Building, CHARUSAT.\n" +
      "\n" +
      "Name : Dr. Parth Goel\n" +
      "Email : parthgoel.ce@charusat.ac.in\n" +
      "\n" +
      "Thank you for your attention to this matter.\n" +
      "\n" +
      "Warm regards,\n" +
      "Department of Computer Science and Engineering\n" +
      "DEPSTAR – CHARUSAT\n" +
      "\n" +
      "Note : This message was sent by the underdevelopment system do not reply to this message contact to given person above.";

    if (!clients[req.user._id]) {
      return res.json({ success: false, message: "User not Connected" });
    }

    const sendMessagePromises = mobileNumbers.map((data) => {
      return clients[req.user.id].client.sendMessage(data + "@c.us", msgString);
    });

    // Wait for all messages to be sent
    const responses = await Promise.all(sendMessagePromises);

    res.json({ success: true, message: "Messages sent", responses });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send messages12", error });
  }
};

const directMessageSend = async (req, res, processingStatus) => {
  try {
    const { fileId, message } = req.body;

    if (!fileId || !message) {
      return res
        .status(400)
        .json({ error: "File ID and message are required" });
    }

    const status = processingStatus[fileId];
    if (!status || status.status !== "completed") {
      return res
        .status(400)
        .json({ error: "File not processed or processing failed" });
    }
    if (!clients[req.user.id]) {
      return res.json({ success: false, message: "Whatsapp not Connected" });
    }

    const contacts = status.contacts;
    let successCount = 0;
    let failedCount = 0;

    const sendMessagePromises = contacts.map(async (data) => {
      try {
        await clients[req.user.id].client.sendMessage(
          "91" + data + "@c.us",
          message
        );
        return {
          contactNo: data,
          success: true,
        };
      } catch (err) {
        console.error(`Failed to send to ${data}: ${err.message}`);
        return {
          contactNo: data,
          success: false,
          error: err.message,
        };
      }
    });

    // Wait for all messages to be sent
    const responses = await Promise.all(sendMessagePromises);

    // Get current Indian date (IST timezone)
    const indianDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const messagesToInsert = responses.map((response) => {
      return {
        sender: req.user.phoneNumber || "system", // Use user's phone number or default
        receiver: "91" + response.contactNo, // Receiver's phone number
        message: message, // Message body
        timestamp: indianDate, // Current Indian date
        status: response.success ? "success" : "failed", // Success/failure status
        senderId: req.user.id, // User ID who sent the message
      };
    });

    // Insert the messages in a single write operation (bulk insert)
    await History.insertMany(messagesToInsert);

    // Clean up processing status
    delete processingStatus[fileId];

    res.json({
      success: true,
      total: contacts.length,
      success: messagesToInsert.length,
      failed: contacts.length - messagesToInsert.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  setUpSocket,
  checkStatus,
  sendSingle,
  sendAll,
  logout,
  tempSend,
  sendMessages,
  arraySend,
  directMessageSend,
};
