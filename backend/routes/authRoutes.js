const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. DEBUGGING LOG
// This helps you see in your terminal if all functions are loaded correctly
console.log("Checking Auth Controller Functions:", {
    login: typeof authController.login,
    register: typeof authController.register,
    updateProfile: typeof authController.updateProfile,
    changePassword: typeof authController.changePassword
});

// 2. PUBLIC ROUTES
// These do not require a token because the user isn't logged in yet

// Login Route - Must be POST
if (typeof authController.login === 'function') {
    router.post('/login', authController.login);
} else {
    console.error("❌ ERROR: authController.login is NOT defined in your controller file!");
}

// Registration Route - Must be POST
if (typeof authController.register === 'function') {
    router.post('/register', authController.register);
} else {
    console.warn("⚠️ WARNING: authController.register is NOT defined in your controller file!");
}

// 3. PROTECTED ROUTES (Requires Login)
// verifyToken ensures the user has a valid session/token before proceeding

// Student/Faculty profile updates
router.put(
    '/update-profile', 
    verifyToken, 
    authController.updateProfile
);

// Password change functionality
router.put(
    '/change-password', 
    verifyToken, 
    authController.changePassword
);

module.exports = router;