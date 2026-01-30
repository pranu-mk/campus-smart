const express = require('express');
const router = express.Router();

// Import Controllers
const studentController = require('../controllers/studentController');
const dashboardController = require('../controllers/facultydashboardController');
const profileController = require('../controllers/profileController');
const notificationController = require('../controllers/notificationController');
const noticeController = require('../controllers/noticeController');
const eventController = require('../controllers/eventController');
const helpdeskController = require('../controllers/helpdeskController');
const complaintController = require('../controllers/complaintController');
// --- THE TRUTH TEST ---
console.log("--- DEBUGGING CONTROLLERS ---");
console.log("Dashboard:", typeof dashboardController.getDashboardStats);
console.log("Profile:", typeof profileController.getProfile);
console.log("Notifications:", typeof notificationController.getNotifications);
console.log("Notices (GET):", typeof noticeController.getNotices);
console.log("Notices (DELETE):", typeof noticeController.deleteNotice); // Added to debug
console.log("Notices (PUT):", typeof noticeController.updateNotice);   // Added to debug
console.log("-----------------------------");

// Existing Notice Routes (GET/POST)
if (typeof noticeController.getNotices === 'function') {
    router.get('/notices', noticeController.getNotices);
    router.post('/notices', noticeController.addNotice);
}

// --- NEW: Isolated Edit and Delete Routes ---
if (typeof noticeController.deleteNotice === 'function') {
    router.delete('/notices/:id', noticeController.deleteNotice);
}

if (typeof noticeController.updateNotice === 'function') {
    router.put('/notices/:id', noticeController.updateNotice);
}

// Stats
if (typeof dashboardController.getDashboardStats === 'function') {
    router.get('/stats', dashboardController.getDashboardStats);
}

// Profile
if (typeof profileController.getProfile === 'function') {
    router.get('/profile', profileController.getProfile);
    router.put('/update-profile', profileController.updateProfile);
    router.post('/change-password', profileController.changePassword);
}

// Notifications
if (typeof notificationController.getNotifications === 'function') {
    router.get('/notifications', notificationController.getNotifications);
    router.put('/notifications/:id/read', notificationController.markAsRead);
}
// Student Directory Routes
if (typeof studentController.getStudentDirectory === 'function') {
    router.get('/students', studentController.getStudentDirectory);
    router.get('/students/:studentId/history', studentController.getStudentComplaintHistory);
}

// Event Management Routes
router.get('/events', eventController.getEventsData);
router.put('/events/:id/status', eventController.updateEventStatus);
router.get('/events/:id/history', eventController.getEventHistory);

// Helpdesk Routes
router.get('/helpdesk/tickets', helpdeskController.getFacultyTickets);
router.post('/helpdesk/tickets', helpdeskController.createTicket);
router.post('/helpdesk/tickets/reply', helpdeskController.sendReply);

// Assigned Complaints Routes
router.get('/assigned-complaints', complaintController.getAssignedComplaints);
router.put('/assigned-complaints/:id', complaintController.updateComplaintStatus);

module.exports = router;