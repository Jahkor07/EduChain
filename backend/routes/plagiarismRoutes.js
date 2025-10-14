const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const winstonService = require('../services/winstonService');

const router = express.Router();

/**
 * Plagiarism Detection Routes
 * 
 * This router handles plagiarism detection endpoints using the Winston AI service.
 * Supports both direct text and file uploads (PDF, DOCX, TXT).
 */

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/msword'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

/**
 * POST /api/plagiarism/check
 * Check text content or uploaded file for plagiarism
 * 
 * @route POST /api/plagiarism/check
 * @desc Check text or file for plagiarism using Winston AI
 * @access Public
 * @body {string} text - The text content to check (optional if file is provided)
 * @body {file} file - The file to check (PDF, DOCX, TXT) (optional if text is provided)
 * @returns {Object} Plagiarism detection results
 */
router.post('/check', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    let textContent = '';

    // Handle file upload
    if (req.file) {
      filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`📄 Processing file: ${req.file.originalname} (${req.file.mimetype})`);

      // Extract text based on file type
      if (req.file.mimetype === 'application/pdf') {
        console.log('📖 Extracting text from PDF...');
        const data = await pdfParse(fileBuffer);
        textContent = data.text;
        console.log(`✅ Extracted ${textContent.length} characters from PDF`);
      } else if (
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        req.file.mimetype === 'application/msword'
      ) {
        console.log('📖 Extracting text from DOCX...');
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        textContent = result.value;
        console.log(`✅ Extracted ${textContent.length} characters from DOCX`);
      } else if (req.file.mimetype === 'text/plain') {
        console.log('📖 Reading text file...');
        textContent = fileBuffer.toString('utf8');
        console.log(`✅ Read ${textContent.length} characters from TXT`);
      } else {
        // Clean up file before returning error
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type',
          message: 'Only PDF, DOCX, and TXT files are supported'
        });
      }

      // Clean up uploaded file after extraction
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Temporary file deleted');
      }
    } 
    // Handle direct text input
    else if (req.body.text || req.body.content) {
      textContent = req.body.text || req.body.content;
      console.log(`📝 Processing direct text input (${textContent.length} characters)`);
    } 
    // No input provided
    else {
      return res.status(400).json({
        success: false,
        error: 'No file or text provided',
        message: 'Please provide either a file upload or text content'
      });
    }

    // Validate extracted text
    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Empty content',
        message: 'No text content could be extracted from the file'
      });
    }

    if (textContent.trim().length < 100) {
      return res.status(400).json({
        success: false,
        error: 'Content too short',
        message: 'Text content must be at least 100 characters for plagiarism analysis'
      });
    }

    // Check text length limits
    const maxLength = 50000; // 50,000 characters limit
    if (textContent.length > maxLength) {
      return res.status(400).json({
        success: false,
        error: 'Text too long',
        message: `Text content exceeds maximum length of ${maxLength} characters`
      });
    }

    console.log(`🔍 Plagiarism check requested for ${textContent.length} characters`);

    // Call Winston service to check plagiarism
    const result = await winstonService.checkPlagiarism(textContent);

    // Extract score from Winston AI response
    let plagiarismScore = 0;
    if (result.data && result.data.score !== undefined) {
      plagiarismScore = result.data.score;
    } else if (result.data && result.data.plagiarism_score !== undefined) {
      plagiarismScore = result.data.plagiarism_score;
    } else if (result.data && result.data.result && result.data.result.score !== undefined) {
      plagiarismScore = result.data.result.score;
    }

    // Determine if content is plagiarized (threshold: 20%)
    const THRESHOLD = 20;
    const isPlagiarized = plagiarismScore >= THRESHOLD;

    // Extract flagged sections/matches from Winston AI
    let flaggedSections = [];
    if (result.data && result.data.matches) {
      flaggedSections = result.data.matches;
    } else if (result.data && result.data.sources) {
      flaggedSections = result.data.sources;
    } else if (result.data && result.data.result && result.data.result.matches) {
      flaggedSections = result.data.result.matches;
    }

    // Return enhanced result
    res.status(200).json({
      success: true,
      message: 'Plagiarism check completed successfully',
      plagiarism_score: plagiarismScore,
      is_plagiarized: isPlagiarized,
      flagged_sections: flaggedSections,
      data: {
        score: plagiarismScore,
        plagiarism_score: plagiarismScore,
        is_plagiarized: isPlagiarized,
        matches: flaggedSections,
        threshold: THRESHOLD,
        passed: !isPlagiarized
      },
      metadata: {
        textLength: textContent.length,
        timestamp: result.timestamp || new Date().toISOString(),
        service: 'Winston AI',
        fileProcessed: !!req.file,
        fileName: req.file ? req.file.originalname : null,
        threshold: THRESHOLD
      }
    });

  } catch (error) {
    console.error('❌ Plagiarism check error:', error.message);

    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('🗑️ Temporary file deleted after error');
      } catch (cleanupError) {
        console.error('Failed to delete temporary file:', cleanupError);
      }
    }

    // Return error response
    res.status(500).json({
      success: false,
      error: 'Plagiarism check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/plagiarism/status
 * Get plagiarism service status
 * 
 * @route GET /api/plagiarism/status
 * @desc Get Winston AI service status and configuration
 * @access Public
 * @returns {Object} Service status information
 */
router.get('/status', (req, res) => {
  try {
    const status = winstonService.getStatus();
    
    res.status(200).json({
      success: true,
      message: 'Plagiarism service status retrieved',
      data: status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Status check error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Status check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/plagiarism/test
 * Test plagiarism service connection
 * 
 * @route POST /api/plagiarism/test
 * @desc Test Winston AI service connection
 * @access Public
 * @returns {Object} Connection test results
 */
router.post('/test', async (req, res) => {
  try {
    console.log('🧪 Testing Winston AI service connection...');
    
    const testResult = await winstonService.testConnection();
    
    if (testResult.success) {
      res.status(200).json({
        success: true,
        message: 'Winston AI service connection test successful',
        data: testResult,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        success: false,
        error: 'Service unavailable',
        message: testResult.error,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Service test error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Service test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Health check endpoint
 * GET /api/plagiarism/health
 * 
 * @route GET /api/plagiarism/health
 * @desc Health check for plagiarism service
 * @access Public
 * @returns {Object} Health status
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Plagiarism service is healthy',
    service: 'Winston AI Plagiarism Detection',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

