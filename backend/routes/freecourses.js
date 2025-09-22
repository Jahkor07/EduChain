const express = require('express');
const router = express.Router();

// Basic free courses route
router.get('/free-courses', (req, res) => {
  res.json({
    success: true,
    message: 'Free courses endpoint',
    data: []
  });
});

module.exports = router;


