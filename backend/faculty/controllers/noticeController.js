const db = require('../../config/db');

// Fetch notices for Faculty (Visible to All or Faculty)
exports.getNotices = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, title, content as description, type, target_role as visibility, 
             created_at as date, (SELECT full_name FROM users WHERE id = created_by) as issuedBy,
             (SELECT department FROM users WHERE id = created_by) as department
             FROM notices 
             WHERE target_role IN ('all', 'faculty') AND is_active = 1
             ORDER BY created_at DESC`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).json({ success: false, message: "Failed to fetch notices" });
    }
};

// Add a new notice with proper ENUM mapping for the database
exports.addNotice = async (req, res) => {
    try {
        const { title, description, type, visibility } = req.body;
        const createdBy = req.user.id;

        // Map UI types to DB ENUM: 'general','academic','event','placement','urgent'
        let dbType = 'general';
        if (type === 'Exam' || type === 'Department') dbType = 'academic';
        
        let dbTarget = visibility.toLowerCase(); // 'all', 'faculty', 'student'

        await db.execute(
            `INSERT INTO notices (title, content, type, target_role, created_by, is_active) 
             VALUES (?, ?, ?, ?, ?, 1)`,
            [title, description, dbType, dbTarget, createdBy]
        );

        res.json({ success: true, message: "Notice published successfully" });
    } catch (error) {
        console.error("Error adding notice:", error);
        res.status(500).json({ success: false, message: "Failed to publish notice" });
    }
};
// 3. Delete a notice
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const facultyId = req.user.id;

        const [result] = await db.execute(
            'DELETE FROM notices WHERE id = ? AND created_by = ?',
            [id, facultyId]
        );

        if (result.affectedRows === 0) {
            // Specific message for permission issues
            return res.status(403).json({ 
                success: false, 
                message: "You do not have permission to delete this notice." 
            });
        }

        res.json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during deletion." });
    }
};

// 4. Update a notice
exports.updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, visibility } = req.body;
        const facultyId = req.user.id;

        let dbType = (type === 'Exam' || type === 'Department') ? 'academic' : 'general';

        const [result] = await db.execute(
            `UPDATE notices SET title = ?, content = ?, type = ?, target_role = ? 
             WHERE id = ? AND created_by = ?`,
            [title, description, dbType, visibility.toLowerCase(), id, facultyId]
        );

        if (result.affectedRows === 0) {
            // Specific message for permission issues
            return res.status(403).json({ 
                success: false, 
                message: "You do not have permission to update this notice." 
            });
        }

        res.json({ success: true, message: "Notice updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during update." });
    }
};