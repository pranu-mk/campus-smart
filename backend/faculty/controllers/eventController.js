const db = require('../../config/db');

// 1. Get All Events + Summary Stats
exports.getEventsData = async (req, res) => {
    try {
        // Query A: Get Summary Counts
        const [stats] = await db.execute(`
            SELECT 
                SUM(CASE WHEN status = 'Pending Approval' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                COUNT(*) as totalThisMonth
            FROM events 
            WHERE MONTH(event_date) = MONTH(CURRENT_DATE())
        `);

        // Query B: Get Events List with Coordinator Info
        // We join with the users table to get the full profile of the organizer
        const [events] = await db.execute(`
            SELECT 
                e.id, 
                e.title, 
                e.description, 
                DATE_FORMAT(e.event_date, '%Y-%m-%d') as date,
                TIME_FORMAT(e.event_time, '%h:%i %p') as time,
                e.location as venue,
                e.status,
                e.attendees,
                u.full_name as coordinator,
                u.email as coordinatorEmail,
                u.mobile_number as coordinatorPhone,
                u.department
            FROM events e
            LEFT JOIN users u ON e.organizer = u.id
            ORDER BY e.event_date DESC
        `);

        res.json({
            success: true,
            stats: stats[0],
            events: events
        });
    } catch (error) {
        console.error('Faculty Events Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 2. Approve/Reject Event
exports.updateEventStatus = async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const facultyId = req.user.id; // From JWT middleware

    try {
        // Start a transaction so both updates happen or none
        await db.query('START TRANSACTION');

        // Update the event status
        await db.execute(
            'UPDATE events SET status = ? WHERE id = ?',
            [status, id]
        );

        // Log the action in history
        await db.execute(
            'INSERT INTO event_history (event_id, action, performed_by, remarks) VALUES (?, ?, ?, ?)',
            [id, status, facultyId, remarks || 'No remarks provided']
        );

        await db.query('COMMIT');

        res.json({ success: true, message: `Event ${status} successfully` });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Update Event Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

// 3. Get Event History
exports.getEventHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const [history] = await db.execute(`
            SELECT 
                h.action, 
                u.full_name as 'by', 
                DATE_FORMAT(h.created_at, '%Y-%m-%d') as date,
                h.remarks
            FROM event_history h
            JOIN users u ON h.performed_by = u.id
            WHERE h.event_id = ?
            ORDER BY h.created_at DESC`,
            [id]
        );
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching history' });
    }
};