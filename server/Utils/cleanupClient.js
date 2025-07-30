
function cleanupClient(userId, clients) {
    if (clients[userId]) {
        console.log(`Cleaning up client for ${userId}`);
        
        // Mark as inactive first to prevent more QR generation
        clients[userId].isActive = false;
        
        try {
            if (clients[userId].client) {
                // Add a small delay before destroying to allow any pending operations to complete
                setTimeout(async () => {
                    try {
                        await clients[userId].client.destroy();
                        console.log(`Client destroyed for ${userId}`);
                    } catch (destroyError) {
                        console.error(`Error destroying client for ${userId}:`, destroyError.message);
                    }
                }, 1000); // 1 second delay
            }
        } catch (err) {
            console.error(`Error during cleanup for ${userId}:`, err.message);
        }
        
        // Remove from clients object after a delay to ensure cleanup is complete
        setTimeout(() => {
            if (clients[userId]) {
                delete clients[userId];
                console.log(`Client removed from memory for ${userId}`);
            }
        }, 2000); // 2 second delay
    }
}

module.exports = {cleanupClient}