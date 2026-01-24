const db = require('../config/db');

// --- 1. GET TICKER DATA (Dynamic Scrolling Bar) ---
exports.getUpcomingPlacements = async (req, res) => {
    try {
        // Fetch only drives where the deadline hasn't passed
        const sql = `
            SELECT company_name, role, package_lpa, deadline 
            FROM placements 
            WHERE deadline >= NOW() 
            ORDER BY deadline ASC
        `;
        const [rows] = await db.query(sql);

        // We return the same structure the PlacementTicker component expects
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Ticker Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching ticker data' });
    }
};

// --- 2. GET ALL PLACEMENTS (Detailed Page) ---
exports.getAllPlacements = async (req, res) => {
    try {
        const studentId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        // Fetch all placement drives
        const [drives] = await db.query('SELECT * FROM placements ORDER BY created_at DESC');

        const dynamicPlacements = await Promise.all(drives.map(async (drive) => {
            // Fetch stages for the timeline
            const [stages] = await db.query(
                'SELECT stage_name as title, stage_date as date FROM placement_stages WHERE placement_id = ? ORDER BY stage_date ASC',
                [drive.id]
            );

            // Check if this specific student has applied
            const [application] = await db.query(
                'SELECT status FROM placement_applications WHERE placement_id = ? AND student_id = ?',
                [drive.id, studentId]
            );

            // Process Timeline Status
            const timeline = stages.map(stage => {
                const stageDate = new Date(stage.date).toISOString().split('T')[0];
                let status = 'pending';
                if (stageDate < today) status = 'completed';
                else if (stageDate === today) status = 'current';

                return { title: stage.title, date: stage.date, status };
            });

            // Calculate overall Drive Status
            let driveStatus = 'upcoming';
            if (timeline.some(s => s.status === 'current')) driveStatus = 'ongoing';
            else if (timeline.length > 0 && timeline.every(s => s.status === 'completed')) driveStatus = 'completed';

            return {
                id: drive.id.toString(),
                company_name: drive.company_name, // Kept database naming for ticker compatibility
                role: drive.role,
                package_lpa: drive.package_lpa, // Kept database naming
                package: `${drive.package_lpa} LPA`,
                location: drive.location,
                status: driveStatus,
                applied: application.length > 0,
                applicationStatus: application.length > 0 ? application[0].status : null,
                deadline: drive.deadline,
                description: drive.description,
                requirements: drive.requirements ? drive.requirements.split(',') : [],
                timeline: timeline
            };
        }));

        // For the main page, we return the array directly as your frontend expects
        res.status(200).json({ success: true, data: dynamicPlacements });
    } catch (error) {
        console.error('Error fetching placements:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- 3. GET STATS (Cards) ---
exports.getPlacementStats = async (req, res) => {
    try {
        const studentId = req.user.id;
        const [stats] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM placements) as totalDrives,
                (SELECT COUNT(*) FROM placement_applications WHERE student_id = ?) as applied,
                (SELECT COUNT(*) FROM placement_applications WHERE student_id = ? AND status = 'Ongoing') as ongoing,
                (SELECT COUNT(*) FROM placement_applications WHERE student_id = ? AND status = 'Offered') as offers
        `, [studentId, studentId, studentId]);
        
        res.status(200).json(stats[0]);
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};

// --- 4. APPLY LOGIC ---
exports.applyForPlacement = async (req, res) => {
    const { placementId } = req.body;
    const studentId = req.user.id;
    try {
        // Check if already applied to prevent duplicates
        const [existing] = await db.query(
            'SELECT id FROM placement_applications WHERE placement_id = ? AND student_id = ?',
            [placementId, studentId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Already applied for this drive" });
        }

        await db.query(
            'INSERT INTO placement_applications (placement_id, student_id, status) VALUES (?, ?, ?)', 
            [placementId, studentId, 'Applied']
        );
        
        res.status(201).json({ success: true, message: "Applied successfully!" });
    } catch (err) {
        console.error('Apply Error:', err);
        res.status(500).json({ message: "Error applying" });
    }
};