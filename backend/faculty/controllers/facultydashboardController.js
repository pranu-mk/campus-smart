const db = require('../../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const facultyId = req.user.id; 

        // 1. Stats Query
        const [stats] = await db.execute(`
            SELECT 
                COUNT(*) as totalAssigned,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
                SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as todaysComplaints
            FROM complaints 
            WHERE assigned_to = ?`, 
            [facultyId]
        );

        // 2. FIXED: Monthly Chart Query
        const [chartData] = await db.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as name, 
                COUNT(*) as total
            FROM complaints
            WHERE assigned_to = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY MONTH(created_at), name
            ORDER BY MIN(created_at) ASC`,
            [facultyId]
        );

        // 3. FIXED: Recent Activity Query
        // Changed c.student_id to c.user_id to match common schema
        const [recentActivity] = await db.execute(`
            SELECT 
                c.id, 
                c.description as title, 
                c.status, 
                c.created_at as timestamp,
                u.full_name as studentName
            FROM complaints c
            JOIN users u ON c.user_id = u.id -- Fix: using user_id instead of student_id
            WHERE c.assigned_to = ?
            ORDER BY c.created_at DESC
            LIMIT 5`,
            [facultyId]
        );

        res.json({
            success: true,
            data: {
                totalAssigned: stats[0].totalAssigned || 0,
                pending: stats[0].pending || 0,
                resolved: stats[0].resolved || 0,
                rejected: stats[0].rejected || 0,
                todaysComplaints: stats[0].todaysComplaints || 0,
                facultyName: req.user.full_name,
                chartData: chartData,
                pieData: [
                    { name: 'Pending', value: parseInt(stats[0].pending) || 0, color: '#F59E0B' },
                    { name: 'Resolved', value: parseInt(stats[0].resolved) || 0, color: '#10B981' },
                    { name: 'Rejected', value: parseInt(stats[0].rejected) || 0, color: '#EF4444' }
                ],
                recentActivity: recentActivity
            }
        });
    } catch (error) {
        console.error('Faculty Dashboard Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};