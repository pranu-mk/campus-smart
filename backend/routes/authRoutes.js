const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

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
if (typeof authController.login === 'function') {
    router.post('/login', authController.login);
}

// THE FIX: Added the registration route
if (typeof authController.register === 'function') {
    router.post('/register', authController.register);
} else {
    console.warn("⚠️ WARNING: authController.register is NOT defined in your controller file!");
}

// 3. PROTECTED ROUTES (Requires Login)
// We use verifyToken first to make sure the user is who they say they are

// Student specific updates
router.put(
    '/update-profile', 
    verifyToken, 
    authController.updateProfile
);

router.put(
    '/change-password', 
    verifyToken, 
    authController.changePassword
);

// 4. ROLE-BASED CHECK (Optional helper)
// If you want to ensure ONLY students can hit these routes:
// router.put('/update-profile', verifyToken, verifyRole('student'), authController.updateProfile);

module.exports = router;