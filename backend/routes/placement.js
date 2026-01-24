const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');

// --- THE FIX IS HERE ---
// If the previous way failed, try importing the whole object and logging it
const authMiddleware = require('../middleware/authMiddleware');
const verifyToken = authMiddleware.verifyToken;

// Debugging check for the terminal
console.log('Middleware Check:', { 
    verifyToken: typeof verifyToken, 
    allMiddleware: Object.keys(authMiddleware) 
});

/**
 * @route   GET /api/placements/upcoming
 */
router.get('/upcoming', placementController.getUpcomingPlacements);

/**
 * @route   GET /api/placements/all
 */
// This is line 19 - where the crash happens if verifyToken is undefined
router.get('/all', verifyToken, placementController.getAllPlacements);

/**
 * @route   GET /api/placements/stats
 */
router.get('/stats', verifyToken, placementController.getPlacementStats);

/**
 * @route   POST /api/placements/apply
 */
router.post('/apply', verifyToken, placementController.applyForPlacement);

module.exports = router;