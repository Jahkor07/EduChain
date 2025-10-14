const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import plagiarism routes
const plagiarismRoutes = require('./routes/plagiarismRoutes');

// Use plagiarism routes
app.use('/api/plagiarism', plagiarismRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'EduChain Plagiarism Service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Plagiarism service running on port ${PORT}`);
  console.log(`🔍 Winston AI API Key: ${process.env.WINSTON_API_KEY ? 'Configured' : 'Missing'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Plagiarism API: http://localhost:${PORT}/api/plagiarism/check`);
});

module.exports = app;
