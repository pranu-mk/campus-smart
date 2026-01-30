const db = require('../../config/db');
const bcrypt = require('bcrypt');

// 1. Fetch Profile Data
exports.getProfile = async (req, res) => {
    try {
        const facultyId = req.user.id; 

        const [rows] = await db.execute(
            'SELECT full_name, email, mobile_number, faculty_id, department, designation, username, profile_picture FROM users WHERE id = ? AND role = "faculty"',
            [facultyId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Error fetching faculty profile:", error);
        res.status(500).json({ success: false, message: "Server error fetching profile" });
    }
};

// 2. Update Profile (Handles Name, Phone, Email, and Photo)
exports.updateProfile = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const { fullName, mobileNumber, officeMail, photo } = req.body;

        // Note: We use profile_picture for the photo field to match your DB schema
        await db.execute(
            'UPDATE users SET full_name = ?, mobile_number = ?, email = ?, profile_picture = ? WHERE id = ?',
            [fullName, mobileNumber, officeMail, photo, facultyId]
        );

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

// 3. Change Password
exports.changePassword = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Fetch current hashed password from DB
        const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [facultyId]);
        const user = users[0];

        // Verify current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Save new password
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, facultyId]);

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Password Change Error:", error);
        res.status(500).json({ success: false, message: "Failed to change password" });
    }
};