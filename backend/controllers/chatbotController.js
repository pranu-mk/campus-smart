const db = require('../config/db');

// 1. Fetch Chat History for the logged-in student
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const [messages] = await db.execute(
            `SELECT sender_role as sender, message, created_at 
             FROM chatbot_messages 
             WHERE user_id = ? 
             ORDER BY created_at ASC`,
            [userId]
        );

        const formattedHistory = messages.map(m => ({
            id: Math.random().toString(36).substr(2, 9), // Temp ID for React keys
            text: m.message,
            sender: m.sender,
            time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }));

        res.status(200).json({ success: true, history: formattedHistory });
    } catch (error) {
        console.error("Chatbot History Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Handle Sending Message & Getting Bot Response
exports.sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { text } = req.body;

        // A. Save User Message
        await db.execute(
            `INSERT INTO chatbot_messages (user_id, sender_role, message) VALUES (?, 'user', ?)`,
            [userId, text]
        );

        // B. Find Bot Response (Keyword Match)
        // We look for a keyword in the user's text
        const [responses] = await db.execute(
            `SELECT response_text FROM bot_responses WHERE ? LIKE CONCAT('%', keyword, '%') LIMIT 1`,
            [text.toLowerCase()]
        );

        const botReply = responses.length > 0 
            ? responses[0].response_text 
            : "I'm still learning! 🤖 For specific queries, please try keywords like 'exam', 'hostel', or 'library'.";

        // C. Save Bot Message
        await db.execute(
            `INSERT INTO chatbot_messages (user_id, sender_role, message) VALUES (?, 'bot', ?)`,
            [userId, botReply]
        );

        res.status(200).json({
            success: true,
            reply: {
                id: Date.now(),
                text: botReply,
                sender: 'bot',
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }
        });

    } catch (error) {
        console.error("Chatbot Message Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};