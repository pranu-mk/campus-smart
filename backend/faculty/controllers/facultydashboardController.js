const db = require('../../config/db');



exports.getDashboardStats = async (req, res) => {
    try {
        const facultyId = req.user.id; 

        // 1. Existing Stats Query
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

        // 2. NEW: Monthly Chart Query (Last 6 months)
        const [chartData] = await db.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as name, 
                COUNT(*) as total
            FROM complaints
            WHERE assigned_to = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY MONTH(created_at), name
            ORDER BY created_at ASC`,
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
                chartData: chartData // This goes to the graph
            }
        });
    } catch (error) {
        console.error('Faculty Dashboard Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};