const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch Full User Profile (For Profile Page & Navbar)
        const [userRows] = await db.execute(
            `SELECT full_name, email, username, prn, department, course, year, mobile_number, profile_picture 
             FROM users WHERE id = ?`,
            [userId]
        );
        const userData = userRows[0];

        // 2. Fetch Status Counts (Stats)
        const [statsRows] = await db.execute(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'In-Progress' THEN 1 ELSE 0 END) as inProgress,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
             FROM complaints 
             WHERE user_id = ?`,
            [userId]
        );

        // 3. Fetch 5 Most Recent Complaints
        const [recentComplaints] = await db.execute(
            `SELECT complaint_id, category, subject, status, created_at, description, file_path
             FROM complaints 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        // 4. Fetch Latest 3 Notices
        const [notices] = await db.execute(
            `SELECT 
                id, 
                title, 
                content, 
                type as category, 
                created_at as date 
             FROM notices 
             WHERE is_active = TRUE 
             AND target_role IN ('all', 'student')
             ORDER BY created_at DESC 
             LIMIT 3`
        );

        // 5. Fetch Unread Notification Count
        const [unreadRows] = await db.execute(
            `SELECT COUNT(*) as unreadCount 
             FROM notifications 
             WHERE user_id = ? AND is_read = FALSE`, 
            [userId]
        );
        
        // 6. Fetch Top 3 Upcoming Events (and check registration)
        const [events] = await db.execute(
            `SELECT e.*, 
             IF(r.student_id IS NULL, FALSE, TRUE) AS is_registered
             FROM events e
             LEFT JOIN event_registrations r ON e.id = r.event_id AND r.student_id = ?
             WHERE e.event_date >= NOW()
             ORDER BY e.event_date ASC 
             LIMIT 3`,
            [userId]
        );
        // 7. Fetch Clubs joined by the student
        const [joinedClubs] = await db.execute(
            `SELECT c.id, c.name, c.image_emoji, c.category
             FROM clubs c
             JOIN club_memberships cm ON c.id = cm.club_id
             WHERE cm.student_id = ?
             ORDER BY cm.joined_at DESC`,
            [userId]
        );

        // 6. Combine and Send Response
        res.status(200).json({
            success: true,
            stats: {
                total: Number(statsRows[0].total) || 0,
                pending: Number(statsRows[0].pending) || 0,
                inProgress: Number(statsRows[0].inProgress) || 0,
                resolved: Number(statsRows[0].resolved) || 0
            },
            recentComplaints,
            notices,
            upcomingEvents: events,
            joinedClubs,
            unreadCount: unreadRows[0].unreadCount || 0,
            user: {
                full_name: userData?.full_name || "",
                email: userData?.email || "",
                username: userData?.username || "",
                prn: userData?.prn || "",
                department: userData?.department || "",
                course: userData?.course || "",
                year: userData?.year || "",
                mobile_number: userData?.mobile_number || "",
                profile_picture: userData?.profile_picture || null
            }
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to load dashboard data" 
        });
    }
};

