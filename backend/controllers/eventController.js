const db = require('../config/db');

// Fetch all events sorted by date (newest first)
exports.getAllEvents = async (req, res) => {
    const studentId = req.user.id; // Get student ID from the JWT token

    // This query selects all events AND checks if a registration exists for THIS student
    const query = `
        SELECT 
        e.id, 
        e.title, 
        e.description, 
        e.event_type AS type, -- Alias to match frontend 'type'
        e.event_date AS date, -- Alias to match frontend 'date'
        e.location, 
        e.organizer,
        IF(r.student_id IS NULL, FALSE, TRUE) AS is_registered
    FROM events e
    LEFT JOIN event_registrations r ON e.id = r.event_id AND r.student_id = ?
    ORDER BY e.event_date DESC
`;
    
    try {
        const [rows] = await db.query(query, [studentId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch only upcoming events
exports.getUpcomingEvents = async (req, res) => {
    const query = 'SELECT * FROM events WHERE event_date >= NOW() ORDER BY event_date ASC';
    
    try {
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching upcoming events:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Register a student for an event
exports.registerForEvent = async (req, res) => {
    const { eventId } = req.body;
    const studentId = req.user.id; // Taken from JWT token automatically

    if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
    }

    try {
        const query = 'INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)';
        await db.query(query, [eventId, studentId]);
        
        res.status(201).json({ message: "Successfully registered for the event!" });
    } catch (err) {
        // Handle duplicate registration error (MySQL Error 1062)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "You are already registered for this event." });
        }
        console.error('Registration Error:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};