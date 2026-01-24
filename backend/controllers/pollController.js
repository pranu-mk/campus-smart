const db = require('../config/db');

exports.getAllPolls = async (req, res) => {
    try {
        const studentId = req.user.id;

        // 1. Fetch all polls
        const [polls] = await db.query('SELECT * FROM polls ORDER BY created_at DESC');

        // 2. For each poll, get options and check if this student voted
        const dynamicPolls = await Promise.all(polls.map(async (poll) => {
            // Get options
            const [options] = await db.query(
                'SELECT id, option_text as text, votes_count as votes FROM poll_options WHERE poll_id = ?', 
                [poll.id]
            );

            // Check if student voted
            const [voteRecord] = await db.query(
                'SELECT option_id FROM poll_votes WHERE poll_id = ? AND student_id = ?',
                [poll.id, studentId]
            );

            return {
                ...poll,
                id: poll.id.toString(),
                voted: voteRecord.length > 0,
                votedOption: voteRecord.length > 0 ? voteRecord[0].option_id.toString() : null,
                options: options.map(opt => ({ ...opt, id: opt.id.toString() }))
            };
        }));

        res.status(200).json(dynamicPolls);
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};  

// Phase 2: Submit a vote
exports.submitVote = async (req, res) => {
    const { pollId, optionId } = req.body;
    const studentId = req.user.id;

    if (!pollId || !optionId) {
        return res.status(400).json({ message: "Poll ID and Option ID are required" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Double check if student already voted (Backend Safety)
        const [existing] = await connection.query(
            'SELECT id FROM poll_votes WHERE poll_id = ? AND student_id = ?',
            [pollId, studentId]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: "You have already voted in this poll." });
        }

        // 2. Record the vote
        await connection.query(
            'INSERT INTO poll_votes (poll_id, student_id, option_id) VALUES (?, ?, ?)',
            [pollId, studentId, optionId]
        );

        // 3. Increment the vote count for that option
        await connection.query(
            'UPDATE poll_options SET votes_count = votes_count + 1 WHERE id = ?',
            [optionId]
        );

        await connection.commit();
        res.status(200).json({ success: true, message: "Vote recorded successfully!" });

    } catch (error) {
        await connection.rollback();
        console.error('Vote Submission Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        connection.release();
    }
};