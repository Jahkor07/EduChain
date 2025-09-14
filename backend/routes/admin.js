const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

// Get all users
router.get("/users", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash -otp -otpExpiry -phoneOTP -phoneOTPExpiry');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get single user
router.get("/users/:id", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -otp -otpExpiry -phoneOTP -phoneOTPExpiry');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// Update user
router.put("/users/:id", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Don't allow updating password through this route
    delete updateData.passwordHash;
    delete updateData.password;
    
    const updated = await User.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true
    }).select('-passwordHash -otp -otpExpiry -phoneOTP -phoneOTPExpiry');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// Delete user
router.delete("/users/:id", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// Get user statistics
router.get("/stats", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const educatorCount = await User.countDocuments({ role: 'educator' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        studentCount,
        educatorCount,
        adminCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

module.exports = router;
