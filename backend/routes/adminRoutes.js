import express from 'express';
import User from '../models/User.js';
import Report from '../models/Report.js';
import NFT from '../models/NFT.js';
import PlatformConfig from '../models/PlatformConfig.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check admin role
router.use(authenticateToken);
router.use(isAdmin);

// ==================== STATS ====================

/**
 * GET /api/admin/stats
 * Get platform statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalEducators, totalStudents, pendingVerifications, totalNFTs, activeReports] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'educator' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'educator', verified: false }),
      NFT ? NFT.countDocuments() : 0,
      Report ? Report.countDocuments({ status: 'pending' }) : 0,
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEducators,
        totalStudents,
        pendingVerifications,
        totalNFTs,
        activeReports,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// ==================== EDUCATOR VERIFICATION ====================

/**
 * GET /api/admin/educators/pending
 * Get pending educator verifications
 */
router.get('/educators/pending', async (req, res) => {
  try {
    const pendingEducators = await User.find({
      role: 'educator',
      verified: false,
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      educators: pendingEducators,
    });
  } catch (error) {
    console.error('Error fetching pending educators:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending educators' });
  }
});

/**
 * POST /api/admin/educators/:id/verify
 * Approve educator verification
 */
router.post('/educators/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    
    const educator = await User.findByIdAndUpdate(
      id,
      { verified: true, verifiedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!educator) {
      return res.status(404).json({ success: false, message: 'Educator not found' });
    }

    res.json({
      success: true,
      message: 'Educator verified successfully',
      educator,
    });
  } catch (error) {
    console.error('Error verifying educator:', error);
    res.status(500).json({ success: false, message: 'Failed to verify educator' });
  }
});

/**
 * POST /api/admin/educators/:id/reject
 * Reject educator verification
 */
router.post('/educators/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // You can either delete the user or mark them as rejected
    const educator = await User.findByIdAndUpdate(
      id,
      { 
        verified: false, 
        rejectedAt: new Date(),
        rejectionReason: reason || 'Application rejected by admin'
      },
      { new: true }
    ).select('-password');

    if (!educator) {
      return res.status(404).json({ success: false, message: 'Educator not found' });
    }

    res.json({
      success: true,
      message: 'Educator verification rejected',
      educator,
    });
  } catch (error) {
    console.error('Error rejecting educator:', error);
    res.status(500).json({ success: false, message: 'Failed to reject educator' });
  }
});

// ==================== PLATFORM CONFIGURATION ====================

/**
 * GET /api/admin/config
 * Get platform configuration
 */
router.get('/config', async (req, res) => {
  try {
    let config = await PlatformConfig.findOne();
    
    // Create default config if doesn't exist
    if (!config) {
      config = await PlatformConfig.create({
        mintingFee: 0.001,
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'docx', 'txt'],
        plagiarismThreshold: 15,
        autoApproveEducators: false,
      });
    }

    res.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch configuration' });
  }
});

/**
 * PUT /api/admin/config
 * Update platform configuration
 */
router.put('/config', async (req, res) => {
  try {
    const updates = req.body;
    
    let config = await PlatformConfig.findOne();
    
    if (!config) {
      config = await PlatformConfig.create(updates);
    } else {
      config = await PlatformConfig.findOneAndUpdate(
        {},
        updates,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Configuration updated successfully',
      config,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ success: false, message: 'Failed to update configuration' });
  }
});

// ==================== MARKETPLACE MODERATION ====================

/**
 * GET /api/admin/marketplace
 * Get all marketplace items for moderation
 */
router.get('/marketplace', async (req, res) => {
  try {
    // This assumes you have an NFT or MarketplaceItem model
    const items = NFT ? await NFT.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(100) : [];

    res.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch marketplace items' });
  }
});

/**
 * DELETE /api/admin/marketplace/:id
 * Remove item from marketplace
 */
router.delete('/marketplace/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!NFT) {
      return res.status(400).json({ success: false, message: 'NFT model not available' });
    }

    const item = await NFT.findByIdAndUpdate(
      id,
      { 
        removed: true, 
        removedAt: new Date(),
        removalReason: reason || 'Removed by admin'
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({
      success: true,
      message: 'Item removed from marketplace',
      item,
    });
  } catch (error) {
    console.error('Error removing marketplace item:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
});

// ==================== REPORTS MONITORING ====================

/**
 * GET /api/admin/reports
 * Get all reports
 */
router.get('/reports', async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = status ? { status } : {};
    
    const reports = Report ? await Report.find(query)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(100) : [];

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

/**
 * POST /api/admin/reports/:id/resolve
 * Resolve a report
 */
router.post('/reports/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    
    if (!Report) {
      return res.status(400).json({ success: false, message: 'Report model not available' });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { 
        status: 'resolved',
        resolution,
        resolvedBy: req.user.id,
        resolvedAt: new Date()
      },
      { new: true }
    ).populate('reporter', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report resolved successfully',
      report,
    });
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({ success: false, message: 'Failed to resolve report' });
  }
});

/**
 * DELETE /api/admin/reports/:id
 * Delete a report
 */
router.delete('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!Report) {
      return res.status(400).json({ success: false, message: 'Report model not available' });
    }

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
});

export default router;










