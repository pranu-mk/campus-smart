const db = require('../../config/db');

exports.getStudentDirectory = async (req, res) => {
    try {
        const { search, department } = req.query;
        
        let query = `
            SELECT 
                u.id, 
                u.full_name as name, 
                u.prn as rollNumber, 
                u.course, 
                u.year, 
                u.department, 
                u.email,
                COUNT(c.id) as totalComplaints
            FROM users u
            LEFT JOIN complaints c ON u.id = c.user_id
            WHERE u.role = 'student'
        `;

        const queryParams = [];

        // Dynamic Filtering
        if (department && department !== 'all') {
            query += ` AND u.department = ?`;
            queryParams.push(department);
        }

        if (search) {
            query += ` AND (u.full_name LIKE ? OR u.prn LIKE ? OR u.email LIKE ?)`;
            const searchVal = `%${search}%`;
            queryParams.push(searchVal, searchVal, searchVal);
        }

        query += ` GROUP BY u.id ORDER BY u.full_name ASC`;

        const [students] = await db.execute(query, queryParams);

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Faculty Student Directory Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// We will keep History separate for performance
exports.getStudentComplaintHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        const [history] = await db.execute(`
            SELECT 
                id, 
                category as type, 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
                status, 
                description 
            FROM complaints 
            WHERE user_id = ? 
            ORDER BY created_at DESC`, 
            [studentId]
        );

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Student History Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};