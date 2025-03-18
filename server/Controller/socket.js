const {socketUserIdExtract } = require('../Middleware/AuthMiddleware')
const {initializeClient} = require('./whatsapp')
const cookie = require('cookie');
const { cleanupClient } = require('../Utils/cleanupClient')
const Student = require("../Modal/Student");
const userSockets = {};
const clients = {};
// Socket.IO Connection
const setUpSocket = (io)=>{

    io.on("connection", async (socket) => {

        console.log(`New socket connection: ${socket.id}`);
        let associatedUserId = null;
    
        socket.on("login", async() => {
            const userId = await socketUserIdExtract(cookie.parse(socket.request.headers.cookie).token,socket)
            console.log(`Login request for ${userId} from socket ${socket.id}`);
            associatedUserId = userId;  // Store the userId associated with this socket
            initializeClient(userId, socket,io,userSockets,clients);
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
                            cleanupClient(associatedUserId,clients);
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
}
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
}

const sendAll = async (req, res) => {
  const userId = req.user.id;
  const { selectedIds } = req.body;  // Expecting an array of phone numbers

  if (!clients[userId]) {
    return res.json({success:false, message: 'User not Connected' });
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
}

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
        error: error.toString()
      });
    }
  } else {
    res.status(400).json({ error: 'User not logged in' });
  }
}

const tempSend = async (req, res) => {
  try {
    // MongoDB query to fetch all documents
    const allStudents = await Student.find({});
   
  
      const mobileNumbers = [];
      const studentsMissingNumbers = [];

      allStudents.forEach((student) => {
       
        if (student.homeNumber) {
          mobileNumbers.push('91'+student.homeNumber);
        }
        if (!student.homeNumber && student.emergencyNumber) {
          mobileNumbers.push('91'+student.emergencyNumber);
        }
        if (!student.homeNumber && !student.emergencyNumber) {
          studentsMissingNumbers.push(student.rollNo);
        }
      });


      const msgString = "Respected Parents,\n\nYour son/daughter was absent for today's exam. Please take serious note of this.\n\nRegards,\nCounselor";
      const tempNumbers = ['918347296122','918320185820','918460752501']
      mobileNumbers.push('919925307605');
      if (!clients[req.user._id]) {
        return res.json({success:false, message: 'User not Connected' });
      }

      const sendMessagePromises = mobileNumbers.map(data => {
        return clients[req.user.id].client.sendMessage(data + '@c.us',msgString);
      });
  
      // Wait for all messages to be sent
      // const responses = await Promise.all(sendMessagePromises);
    
      
      // res.json({ success: true, message: 'Messages sent', responses });

  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Failed to send messages12", error });
  }
};


module.exports = {setUpSocket,checkStatus,sendSingle,sendAll,logout,tempSend};
