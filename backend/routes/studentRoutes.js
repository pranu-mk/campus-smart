const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const noticeController = require('../controllers/noticeController');

// 1. ADD THIS LINE: Import your dashboard logic
const studentDashboard = require('../dashboards/studentDashboard');

// Complaint routes
router.post('/complaints', complaintController.createComplaint);
router.get('/complaints/stats', complaintController.getComplaintStats);
router.get('/complaints/recent', complaintController.getRecentComplaints);
router.get('/complaints/:complaintId', complaintController.getComplaintById);
router.get('/complaints', complaintController.getUserComplaints);

// Notice routes
router.get('/notices', noticeController.getNotices);
router.get('/notifications', noticeController.getNotifications);
router.put('/notifications/:notificationId/read', noticeController.markNotificationRead);
router.put('/notifications/read-all', noticeController.markAllNotificationsRead);

// 2. ADD THIS LINE: Link the dashboard URL to the dashboard file
// This makes /api/student/dashboard work!
router.use('/dashboard', studentDashboard);

module.exports = router;