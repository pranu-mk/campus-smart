const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// --- IMPORT CONTROLLERS ---
const complaintController = require('../controllers/complaintController');
const noticeController = require('../controllers/noticeController');
const studentDashboard = require('../controllers/studentDashboard');
const helpdeskController = require('../controllers/helpdeskController');
const lostFoundController = require('../controllers/lostFoundController');
const eventController = require('../controllers/eventController');
const clubController = require('../controllers/clubController');
const pollController = require('../controllers/pollController');
const placementController = require('../controllers/placementController');
const chatbotController = require('../controllers/chatbotController');

// --- MULTER STORAGE CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/complaints/');
    },
    filename: (req, file, cb) => {
        cb(null, `complaint-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Only images (jpeg/jpg/png) or PDFs are allowed!"));
    }
});

// --- COMPLAINT ROUTES ---
router.post('/complaints', upload.single('file'), complaintController.createComplaint);
router.get('/complaints/stats', complaintController.getComplaintStats);
router.get('/complaints/recent', complaintController.getRecentComplaints);
router.get('/complaints', complaintController.getUserComplaints);
router.get('/complaints/:complaintId', complaintController.getComplaintById);

// --- HELPDESK ROUTES ---
router.post('/helpdesk/tickets', helpdeskController.createTicket);
router.get('/helpdesk/tickets', helpdeskController.getTickets);

// --- NOTICE & NOTIFICATION ROUTES ---
router.get('/notices', noticeController.getNotices);
router.get('/notifications', noticeController.getNotifications);
router.put('/notifications/:notificationId/read', noticeController.markNotificationRead);
router.put('/notifications/read-all', noticeController.markAllNotificationsRead);

// --- DASHBOARD ROUTES ---
// FIXED: Removed the router.use line that was causing the crash
router.get('/dashboard', studentDashboard.getDashboardData);


// --- LOST AND FOUND ROUTES ---
router.post('/lost-found', lostFoundController.createPost);
router.get('/lost-found', lostFoundController.getAllPosts);
router.put('/lost-found/:id/claim', lostFoundController.claimItem);


// --- EVENT ROUTES ---
router.get('/events', eventController.getAllEvents);
router.get('/events/upcoming', eventController.getUpcomingEvents);
// Add this under your existing event routes
router.post('/events/register', eventController.registerForEvent);

// --- CLUB ROUTES ---
router.get('/clubs', clubController.getAllClubs);
router.post('/clubs/join', clubController.joinClub);
router.delete('/clubs/leave/:clubId', clubController.leaveClub);

// --- POLL ROUTES ---
router.get('/polls', pollController.getAllPolls);
router.post('/polls/vote', pollController.submitVote);

// --- PLACEMENT ROUTES ---
router.get('/placements', placementController.getAllPlacements);
router.get('/placements/stats', placementController.getPlacementStats);
router.post('/placements/apply', placementController.applyForPlacement);

// --- CHATBOT ROUTES ---
router.get('/chatbot/history', chatbotController.getChatHistory);
router.post('/chatbot/message', chatbotController.sendMessage);
module.exports = router;