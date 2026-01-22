const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyRole } = require('../middleware/authMiddleware'); // Fixed: using the correct export

// Debugging: This will show in your terminal exactly what is ready
console.log("Checking Auth Controller Functions:", {
    login: typeof authController.login,
    updateProfile: typeof authController.updateProfile
});

// 1. Login Route (No protection needed)
if (typeof authController.login === 'function') {
    router.post('/login', authController.login);
}

// 2. Update Profile Route (Protected by verifyRole)
if (typeof authController.updateProfile === 'function') {
    // We call verifyRole('student') to create the middleware for this route
    router.put('/update-profile', verifyRole('student'), authController.updateProfile);
} else {
    console.warn("⚠️ WARNING: authController.updateProfile is NOT a function!");
}

module.exports = router;