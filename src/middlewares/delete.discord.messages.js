async function deleteAfterTimeout(message) {
    try {
        const timeout = parseInt(process.env.DELETE_MESSAGES_AFTER, 10);
        if (timeout && message) {
            setTimeout(async () => {
                try {
                    await message.delete();
                } catch (error) {
                    console.error('Failed to delete the message:', error);
                }
            }, timeout);
        } else if (!message) {
            console.error('No message provided to deleteAfterTimeout.');
        }
    } catch (error) {
        console.error('Failed to set timeout for deleting message:', error);
    }
}

module.exports = deleteAfterTimeout;
