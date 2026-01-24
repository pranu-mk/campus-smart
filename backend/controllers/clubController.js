const db = require('../config/db');

exports.getAllClubs = async (req, res) => {
    try {
        const studentId = req.user.id; // From authMiddleware

        // This query joins clubs with memberships for THIS specific student
        const query = `
            SELECT c.*, 
            IF(cm.student_id IS NULL, 0, 1) AS is_member
            FROM clubs c
            LEFT JOIN club_memberships cm ON c.id = cm.club_id AND cm.student_id = ?
            ORDER BY c.name ASC
        `;
        
        const [rows] = await db.query(query, [studentId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Phase 2: Join a club
exports.joinClub = async (req, res) => {
    const { clubId } = req.body;
    const studentId = req.user.id; // From authMiddleware

    if (!clubId) {
        return res.status(400).json({ message: "Club ID is required" });
    }

    try {
        const query = 'INSERT INTO club_memberships (club_id, student_id) VALUES (?, ?)';
        await db.query(query, [clubId, studentId]);
        
        res.status(201).json({ 
            success: true, 
            message: "You have successfully joined the club!" 
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "You are already a member of this club." });
        }
        console.error('Join Club Error:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Phase 2: Join a club
exports.joinClub = async (req, res) => {
    const { clubId } = req.body;
    const studentId = req.user.id; // Automatically identifies the logged-in student

    if (!clubId) {
        return res.status(400).json({ message: "Club ID is required" });
    }

    try {
        const query = 'INSERT INTO club_memberships (club_id, student_id) VALUES (?, ?)';
        await db.query(query, [clubId, studentId]);
        
        res.status(201).json({ 
            success: true, 
            message: "Welcome to the club! You are now a member." 
        });
    } catch (err) {
        // Handle case where student is already a member (Unique Key constraint)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "You are already a member of this club." });
        }
        console.error('Join Club Error:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Phase 4: Leave a club
exports.leaveClub = async (req, res) => {
    const { clubId } = req.params;
    const studentId = req.user.id;

    try {
        const query = 'DELETE FROM club_memberships WHERE club_id = ? AND student_id = ?';
        const [result] = await db.query(query, [clubId, studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Membership not found." });
        }

        res.status(200).json({ 
            success: true, 
            message: "You have left the club successfully." 
        });
    } catch (error) {
        console.error('Leave Club Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};