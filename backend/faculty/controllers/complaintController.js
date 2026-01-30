const db = require('../../config/db');

/**
 * 1. GET ASSIGNED COMPLAINTS
 * Fetches complaints specifically assigned to the logged-in Faculty member.
 */
exports.getAssignedComplaints = async (req, res) => {
    try {
        const facultyId = req.user.id; // Extracted from verified JWT

        const [complaints] = await db.execute(`
            SELECT 
                c.id as db_id,
                c.complaint_id as id,
                u.full_name as studentName,
                u.department,
                c.category as type,
                c.priority,
                DATE_FORMAT(c.created_at, '%Y-%m-%d') as date,
                c.status,
                c.description,
                c.faculty_reply,
                c.internal_notes
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE c.assigned_to = ?
            ORDER BY c.created_at DESC`, 
            [facultyId]
        );

        res.json({ success: true, data: complaints });
    } catch (error) {
        console.error('Fetch Assigned Complaints Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * 2. UPDATE COMPLAINT STATUS & ACTION PANEL
 * Stores response and notes in dedicated columns for better security and visibility.
 */
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params; // e.g., CMP-TEST-01
        const { status, priority, facultyResponse, internalNote } = req.body;
        const facultyId = req.user.id;

        // Atomic update using the new dedicated columns
        const [result] = await db.execute(
            `UPDATE complaints 
             SET status = ?, 
                 priority = IFNULL(?, priority),
                 faculty_reply = ?, 
                 internal_notes = ?,
                 updated_at = NOW() 
             WHERE complaint_id = ? AND assigned_to = ?`,
            [
                status, 
                priority || null, 
                facultyResponse || null, 
                internalNote || null, 
                id, 
                facultyId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Complaint not found or unauthorized' });
        }

        res.json({ success: true, message: 'Complaint updated successfully' });
    } catch (error) {
        console.error('Update Complaint Status Error:', error.message);
        res.status(500).json({ success: false, message: 'Server Error - Failed to save changes' });
    }
};