const db = require('../config/db');

// --- GET NOTICES ---
// Fetches active notices and maps them to the frontend structure
exports.getNotices = async (req, res) => {
    try {
        // 1. Ensure limit is a real number (integer) for MySQL safety
        const limit = parseInt(req.query.limit) || 10;
        
        // 2. Identify the target role (usually 'student' for this dashboard)
        const targetRole = 'student';

        /**
         * ALIAS MAPPING EXPLAINED:
         * content AS description -> Your UI looks for 'description'
         * type AS category      -> Your UI looks for 'category' to set icons/colors
         * is_important AS important -> Your UI looks for 'important' to show red badges
         */
        const query = `
            SELECT 
                id, 
                title, 
                content AS description, 
                type AS category, 
                DATE_FORMAT(created_at, '%b %d, %Y') as date,
                is_important AS important 
            FROM notices 
            WHERE is_active = TRUE
            AND (target_role = 'all' OR target_role = ?) 
            AND (expires_at IS NULL OR expires_at > NOW())
            ORDER BY created_at DESC 
            LIMIT ?`;

        // 3. Pass arguments in order: [?] for role, then [?] for limit
        const [rows] = await db.query(query, [targetRole, limit]);
        
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get notices error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- GET NOTIFICATIONS ---
// Fetches user-specific notifications with dynamic time formatting
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;

        const [notifications] = await db.execute(
            `SELECT id, title, message, type, is_read, related_id,
                    CASE 
                        WHEN created_at >= NOW() - INTERVAL 1 HOUR THEN CONCAT(TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' minutes ago')
                        WHEN created_at >= NOW() - INTERVAL 1 DAY THEN CONCAT(TIMESTAMPDIFF(HOUR, created_at, NOW()), ' hours ago')
                        ELSE DATE_FORMAT(created_at, '%b %d, %Y')
                    END as time
             FROM notifications 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ?`,
            [userId, limit]
        );

        // Get unread count for the notification badge
        const [unreadResult] = await db.execute(
            'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );

        res.json({
            success: true,
            notifications,
            unreadCount: unreadResult[0].unread
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// --- MARK SINGLE NOTIFICATION AS READ ---
exports.markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        await db.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );

        res.json({
            success: true,
            message: "Notification marked as read"
        });

    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};

// --- MARK ALL NOTIFICATIONS AS READ ---
exports.markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await db.execute(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update notifications"
        });
    }
};