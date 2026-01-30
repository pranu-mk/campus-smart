const db = require('../../config/db');

exports.getFacultyTickets = async (req, res) => {
    try {
        const facultyId = req.user.id;

        // 1. Fetch Summary Stats - Force counts to be Numbers
        const [statsRows] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
            FROM faculty_helpdesk_tickets
            WHERE user_id = ?`, 
            [facultyId]
        );

        // 2. Fetch Tickets List
        const [tickets] = await db.execute(`
            SELECT t.*, MAX(r.created_at) as last_reply_time
            FROM faculty_helpdesk_tickets t
            LEFT JOIN faculty_helpdesk_replies r ON t.id = r.ticket_id
            WHERE t.user_id = ?
            GROUP BY t.id
            ORDER BY t.created_at DESC`, 
            [facultyId]
        );

        // Map replies... (Keep your existing mapping logic here)
        const ticketsWithReplies = await Promise.all(tickets.map(async (ticket) => {
            const [replies] = await db.execute(`
                SELECT id, sender_role as sender, message, created_at as time
                FROM faculty_helpdesk_replies
                WHERE ticket_id = ?
                ORDER BY created_at ASC`,
                [ticket.id]
            );
            return {
                id: ticket.ticket_custom_id,
                issueType: ticket.issue_type,
                subject: ticket.subject,
                description: ticket.description,
                createdDate: ticket.created_at,
                priority: ticket.priority,
                status: ticket.status,
                lastReply: ticket.last_reply_time || 'No replies yet',
                replies: replies
            };
        }));

        // CRITICAL: Ensure we send statsRows[0]
        res.json({ 
            success: true, 
            data: ticketsWithReplies,
            stats: statsRows[0] || { total: 0, open: 0, inProgress: 0, resolved: 0 }
        });
    } catch (error) {
        console.error('Get Faculty Tickets Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// 2. Create a new support ticket
exports.createTicket = async (req, res) => {
    try {
        const { issueType, subject, description, priority } = req.body;
        const facultyId = req.user.id;
        
        // Generate a simple custom ID (e.g., TKT-1234)
        const customId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

        await db.execute(`
            INSERT INTO faculty_helpdesk_tickets 
            (ticket_custom_id, user_id, issue_type, subject, description, priority)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [customId, facultyId, issueType, subject, description, priority]
        );

        res.json({ success: true, message: 'Ticket created successfully', customId });
    } catch (error) {
        console.error('Create Ticket Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create ticket' });
    }
};

// 3. Send a reply to an existing ticket
exports.sendReply = async (req, res) => {
    try {
        const { ticketCustomId, message } = req.body;
        const facultyId = req.user.id;

        // First, find the internal ID of the ticket
        const [ticket] = await db.execute(
            'SELECT id FROM faculty_helpdesk_tickets WHERE ticket_custom_id = ? AND user_id = ?',
            [ticketCustomId, facultyId]
        );

        if (ticket.length === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        await db.execute(`
            INSERT INTO faculty_helpdesk_replies (ticket_id, sender_id, sender_role, message)
            VALUES (?, ?, 'faculty', ?)`,
            [ticket[0].id, facultyId, message]
        );

        res.json({ success: true, message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Send Reply Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send reply' });
    }
};