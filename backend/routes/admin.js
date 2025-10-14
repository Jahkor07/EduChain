const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Book = require("../models/Book");
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

// Create new user (admin only)
router.post("/users/create", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      passwordHash,
      role: role || 'student',
      firstName: firstName || '',
      lastName: lastName || '',
      username: email.split('@')[0]
    });

    await newUser.save();

    console.log(`✅ Admin created new user: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// Get user statistics
router.get("/stats", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEducators = await User.countDocuments({ role: 'educator' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    // Get pending educators (those not yet verified)
    const pendingVerifications = await User.countDocuments({ 
      role: 'educator', 
      verified: false 
    });

    // Get marketplace stats
    const totalBooks = await Book.countDocuments();
    const activeBooks = await Book.countDocuments({ isActive: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalEducators,
        adminCount,
        pendingVerifications,
        totalNFTs: 0, // Can be updated when NFT tracking is implemented
        activeReports: 0, // Can be updated when reports are implemented
        totalBooks,
        activeBooks
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

// Get pending educators for verification
router.get("/educators/pending", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const pendingEducators = await User.find({ 
      role: 'educator',
      verified: { $ne: true }
    }).select('-passwordHash');
    
    res.json({
      success: true,
      educators: pendingEducators
    });
  } catch (error) {
    console.error('Error fetching pending educators:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending educators'
    });
  }
});

// Verify or reject educator
router.post("/educators/:id/verify", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const educator = await User.findById(id);
    if (!educator || educator.role !== 'educator') {
      return res.status(404).json({
        success: false,
        message: 'Educator not found'
      });
    }

    if (approved) {
      educator.verified = true;
      educator.verifiedAt = new Date();
      await educator.save();
      
      console.log(`✅ Admin approved educator: ${educator.email}`);
      
      res.json({
        success: true,
        message: 'Educator verified successfully'
      });
    } else {
      // Reject - either delete or mark as rejected
      await User.findByIdAndDelete(id);
      
      console.log(`❌ Admin rejected educator: ${educator.email}`);
      
      res.json({
        success: true,
        message: 'Educator application rejected'
      });
    }
  } catch (error) {
    console.error('Error verifying educator:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying educator'
    });
  }
});

// Get all marketplace items
router.get("/marketplace/all", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const books = await Book.find()
      .populate('educatorId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      items: books
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketplace items'
    });
  }
});

// Moderate marketplace item (activate/deactivate/delete)
router.post("/marketplace/:id/moderate", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'activate', 'deactivate', 'delete'

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (action === 'delete') {
      await Book.findByIdAndDelete(id);
      console.log(`🗑️ Admin deleted book: ${book.title}`);
    } else if (action === 'activate') {
      book.isActive = true;
      await book.save();
      console.log(`✅ Admin activated book: ${book.title}`);
    } else if (action === 'deactivate') {
      book.isActive = false;
      await book.save();
      console.log(`⏸️ Admin deactivated book: ${book.title}`);
    }

    res.json({
      success: true,
      message: `Item ${action}d successfully`
    });
  } catch (error) {
    console.error('Error moderating item:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating item'
    });
  }
});

// Get platform configuration
router.get("/config", auth, requireRole(["admin"]), async (req, res) => {
  try {
    // Return default config for now
    // In production, this would be stored in database
    res.json({
      success: true,
      config: {
        mintingFee: 0.001,
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'docx', 'txt'],
        plagiarismThreshold: 15,
        autoApproveEducators: false
      }
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching configuration'
    });
  }
});

// Update platform configuration
router.put("/config", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const config = req.body;
    
    // In production, save to database
    console.log('⚙️ Admin updated platform config:', config);
    
    res.json({
      success: true,
      message: 'Configuration updated successfully',
      config
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating configuration'
    });
  }
});

// Get reports
router.get("/reports", auth, requireRole(["admin"]), async (req, res) => {
  try {
    // Return empty array for now
    // In production, this would fetch from a Reports collection
    res.json({
      success: true,
      reports: []
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports'
    });
  }
});

// Resolve report
router.post("/reports/:id/resolve", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    
    console.log(`✔️ Admin resolved report ${id}: ${resolution}`);
    
    res.json({
      success: true,
      message: 'Report resolved successfully'
    });
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving report'
    });
  }
});

module.exports = router;
