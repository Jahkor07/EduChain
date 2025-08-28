const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is an educator
const requireEducator = (req, res, next) => {
  if (req.user.role !== 'educator') {
    return res.status(403).json({ error: 'Access denied. Educator role required.' });
  }
  next();
};

// Middleware to check if user is a student
const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied. Student role required.' });
  }
  next();
};

// Middleware to check if user owns the resource (for educators)
const requireOwnership = (modelName) => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${modelName}`);
      const resource = await Model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ error: `${modelName} not found` });
      }

      if (resource.educatorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied. You do not own this resource.' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error(`Ownership check error for ${modelName}:`, error);
      return res.status(500).json({ error: 'Server error during ownership verification' });
    }
  };
};

module.exports = {
  authenticateToken,
  requireEducator,
  requireStudent,
  requireOwnership
};








