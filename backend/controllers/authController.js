const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. LOGIN LOGIC ---
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        let selectedRole = req.body.role; 

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Required fields missing." });
        }

        const [rows] = await db.execute("SELECT * FROM users WHERE username = ? OR email = ?", [identifier, identifier]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        if (!selectedRole) selectedRole = user.role;

        if (user.role.toLowerCase() !== selectedRole.toLowerCase()) {
            return res.status(401).json({ success: false, message: `Please select the correct role.` });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role.toLowerCase() }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token,
            role: user.role.toLowerCase(),
            name: user.full_name
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 2. UPDATE PROFILE LOGIC ---
const updateProfile = async (req, res) => {
    try {
        // Safety check for JWT data
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const userId = req.user.id;
        const { fullName, mobileNumber, username } = req.body;

        const sql = `UPDATE users SET full_name = ?, mobile_number = ?, username = ? WHERE id = ?`;
        const [result] = await db.execute(sql, [fullName, mobileNumber, username, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile updated successfully!" });
    } catch (err) {
        console.error("Update Profile Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to update profile: " + err.message });
    }
};

// --- 3. EXPORT ALL FUNCTIONS AT ONCE ---
// This ensures authRoutes.js can see both 'login' and 'updateProfile'
module.exports = {
    login,
    updateProfile
};