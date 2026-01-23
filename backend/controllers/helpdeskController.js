    const db = require('../config/db');

    exports.createTicket = async (req, res) => {
        try {
            const userId = req.user.id;
            const { category, subject, message, priority } = req.body;
            const senderName = req.user.full_name || "Student"; // Use the name from JWT

            // 1. Generate a custom ID like TKT17062025 (TKT + Timestamp)
            const ticketCustomId = `TKT${Date.now().toString().slice(-6)}`;

            // 2. Insert the Ticket
            const [ticketResult] = await db.execute(
                `INSERT INTO helpdesk_tickets (ticket_custom_id, user_id, category, subject, priority) 
                VALUES (?, ?, ?, ?, ?)`,
                [ticketCustomId, userId, category, subject, priority]
            );

            const newTicketId = ticketResult.insertId;

            // 3. Insert the First Message
            await db.execute(
                `INSERT INTO helpdesk_messages (ticket_id, sender_role, sender_name, message) 
                VALUES (?, 'student', ?, ?)`,
                [newTicketId, senderName, message]
            );

            res.status(201).json({
                success: true,
                message: "Ticket created successfully",
                ticketId: ticketCustomId
            });

        } catch (error) {
            console.error("Helpdesk Create Error:", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    };
    exports.getTickets = async (req, res) => {
        try {
            const userId = req.user.id;

            // 1. Fetch all tickets for this student
            const [tickets] = await db.execute(
                `SELECT * FROM helpdesk_tickets WHERE user_id = ? ORDER BY created_at DESC`,
                [userId]
            );

            if (tickets.length === 0) {
                return res.status(200).json({ success: true, tickets: [] });
            }

            // 2. Fetch all messages for these tickets
            const ticketIds = tickets.map(t => t.id);
            const [messages] = await db.execute(
                `SELECT * FROM helpdesk_messages WHERE ticket_id IN (${ticketIds.join(',')}) ORDER BY created_at ASC`
            );

            // 3. Format data: Group messages inside their tickets
            const formattedTickets = tickets.map(ticket => {
                return {
                    id: ticket.ticket_custom_id,
                    db_id: ticket.id, // we keep this for internal replies
                    category: ticket.category,
                    subject: ticket.subject,
                    status: ticket.status,
                    priority: ticket.priority,
                    assignedTo: ticket.assigned_to,
                    department: ticket.department,
                    date: new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    messages: messages
                        .filter(m => m.ticket_id === ticket.id)
                        .map(m => ({
                            sender: m.sender_role,
                            message: m.message,
                            time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                            senderName: m.sender_name
                        }))
                };
            });

            res.status(200).json({ success: true, tickets: formattedTickets });

        } catch (error) {
            console.error("Helpdesk Fetch Error:", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    };