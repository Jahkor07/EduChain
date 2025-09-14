const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats
} = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

// Apply authentication middleware to all notification routes
router.use(auth);

// GET /api/notifications/:userId - Get user's notifications (with pagination and filtering)
router.get('/:userId', getNotifications);

// POST /api/notifications/:userId - Create a new notification
router.post('/:userId', createNotification);

// PUT /api/notifications/:userId/:notificationId - Mark notification as read
router.put('/:userId/:notificationId', markAsRead);

// PUT /api/notifications/:userId - Mark all notifications as read
router.put('/:userId', markAllAsRead);

// DELETE /api/notifications/:userId/:notificationId - Delete specific notification
router.delete('/:userId/:notificationId', deleteNotification);

// DELETE /api/notifications/:userId - Delete all notifications for user
router.delete('/:userId', deleteAllNotifications);

// GET /api/notifications/:userId/stats - Get notification statistics
router.get('/:userId/stats', getNotificationStats);

module.exports = router;





