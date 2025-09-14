const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Get user's notifications (sorted by createdAt DESC)
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Build query
    const query = { userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'firstName lastName email');

    // Get total count for pagination
    const totalCount = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get unread count
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        },
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message, type = 'info', actionUrl = null, metadata = {} } = req.body;

    // Validate required fields
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Validate message length
    if (message.length > 500) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message cannot exceed 500 characters' 
      });
    }

    // Create notification
    const notification = new Notification({
      userId,
      message: message.trim(),
      type,
      actionUrl,
      metadata
    });

    await notification.save();
    await notification.populate('userId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Validate notificationId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid notification ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find and update notification
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true, readAt: new Date() },
      { new: true }
    ).populate('userId', 'firstName lastName email');

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found or does not belong to user' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update all unread notifications
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Validate notificationId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid notification ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find and delete notification
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found or does not belong to user' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: { deletedNotificationId: notificationId }
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete all notifications for user
const deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Delete all notifications for user
    const result = await Notification.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get statistics
    const totalCount = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    const readCount = totalCount - unreadCount;

    // Get notifications by type
    const typeStats = await Notification.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCount,
        unreadCount,
        readCount,
        typeStats
      }
    });

  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats
};

