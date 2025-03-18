
function cleanupClient(userId,clients){
    if (clients[userId]) {
        console.log(`Cleaning up client for ${userId}`);
        
        // Mark as inactive first to prevent more QR generation
        clients[userId].isActive = false;
        
        try {
            if (clients[userId].client) {
                clients[userId].client.destroy();
                console.log('Client destroyed')
            }
        } catch (err) {
            console.error(`Error destroying client for ${userId}:`, err);
        }
        
        delete clients[userId];
    }
};

module.exports = {cleanupClient}