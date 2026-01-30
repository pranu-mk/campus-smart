const db = require('../../config/db');

const getNotifications = async (req, res) => {
    try {
        const facultyId = req.user.id; 
        const [rows] = await db.execute(
            'SELECT id, title, message, type, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
            [facultyId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Notification Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// This style is very clear for Node.js to read
module.exports = {
    getNotifications,
    markAsRead
};