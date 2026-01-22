const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Finalized Student Dashboard Aggregator - Fully Dynamic
router.get('/', async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User identity missing" });
    }

    const userId = req.user.id;

    try {
        console.log(`--- Fetching COMPLETE Dashboard for User ID: ${userId} ---`);

        // 1. FIXED QUERY: Added 'email' and 'mobile_number' to the selection
        const [userRows] = await db.query(
            'SELECT full_name, email, mobile_number, username, prn, course, year, department, profile_picture FROM users WHERE id = ?',
            [userId]
        );

        // 2. Get Complaint Stats
        const [statsRows] = await db.query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'In-Progress' THEN 1 ELSE 0 END) as inProgress,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
             FROM complaints WHERE user_id = ?`,
            [userId]
        );

        // 3. Get Recent Complaints
        const [complaintRows] = await db.query(
            "SELECT complaint_id, category, subject, status, DATE_FORMAT(created_at, '%b %d, %Y') as date FROM complaints WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
            [userId]
        );

        // 4. Get Latest Notices
        const [noticeRows] = await db.query(
            'SELECT * FROM notices WHERE is_active = TRUE AND (target_role = "student" OR target_role = "all") ORDER BY created_at DESC LIMIT 5'
        );

        // 5. Get Notifications
        const [notificationRows] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
            [userId]
        );

        console.log("--- All Data (Including Email/Mobile) Fetched ---");

        res.json({
            user: userRows[0] || null,
            stats: {
                total: statsRows[0].total || 0,
                pending: statsRows[0].pending || 0,
                inProgress: statsRows[0].inProgress || 0,
                resolved: statsRows[0].resolved || 0
            },
            recentComplaints: complaintRows,
            notices: noticeRows,
            notifications: notificationRows,
            unreadCount: notificationRows.filter(n => !n.is_read).length
        });

    } catch (error) {
        console.error('DASHBOARD AGGREGATOR ERROR:', error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

module.exports = router;