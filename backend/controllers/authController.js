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

        // Fetch user by username or email
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ? OR email = ?", [identifier, identifier]);
        const user = rows[0];

        // Verify password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // Handle role validation
        if (!selectedRole) selectedRole = user.role;
        if (user.role.toLowerCase() !== selectedRole.toLowerCase()) {
            return res.status(401).json({ success: false, message: `Please select the correct role.` });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role.toLowerCase() }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Return full user details for the AuthContext
        return res.json({
            success: true,
            token,
            role: user.role.toLowerCase(),
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            prn: user.prn,
            department: user.department,
            course: user.course,
            year: user.year,
            profile_picture: user.profile_picture
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 2. REGISTER LOGIC ---
const register = async (req, res) => {
    try {
        const { 
            role, fullName, email, mobile, username, password, 
            studentId, department, course, yearSemester, 
            facultyId, designation, photo, profilePicture 
        } = req.body;

        // Check if user already exists
        const [existing] = await db.execute("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Username or Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (
                role, full_name, email, mobile_number, username, password, 
                prn, course, year, faculty_id, designation, department, profile_picture
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            role, 
            fullName, 
            email, 
            mobile, 
            username, 
            hashedPassword, 
            studentId || null,
            course || null, 
            yearSemester || null, 
            facultyId || null, 
            designation || null, 
            department ?? null, 
            (photo || profilePicture) ?? null // Normalizes the image field
        ];

        await db.execute(sql, values);
        res.status(201).json({ success: true, message: "Registration successful!" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Registration failed: " + err.message });
    }
};

// --- 3. UPDATE PROFILE LOGIC ---
const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const userId = req.user.id;
        const { fullName, mobileNumber, username, department, profilePicture } = req.body;

        const values = [
            fullName ?? null,
            mobileNumber ?? null,
            username ?? null,
            department ?? null,
            profilePicture ?? null,
            userId
        ];

        const sql = `
            UPDATE users 
            SET full_name = ?, mobile_number = ?, username = ?, department = ?, profile_picture = ? 
            WHERE id = ?
        `;

        const [result] = await db.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // CRITICAL FIX: Fetch full user row to send back to frontend
        // This prevents the frontend state from losing "locked" fields like PRN or email
        const [updatedRows] = await db.execute(
            "SELECT id, role, full_name, email, prn, department, course, year, mobile_number, profile_picture FROM users WHERE id = ?", 
            [userId]
        );

        res.json({ 
            success: true, 
            message: "Profile updated successfully!",
            user: updatedRows[0] 
        });

    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ success: false, message: "Server error during update" });
    }
};

// --- 4. CHANGE PASSWORD LOGIC ---
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const [rows] = await db.execute("SELECT password FROM users WHERE id = ?", [userId]);
        const user = rows[0];

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect current password" });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, userId]);

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        console.error("Password Change Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    login,
    register,
    updateProfile,
    changePassword
};