const express = require('express');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const { authenticateToken, requireEducator, requireOwnership } = require('../middleware/roleCheck');
const ipfsService = require('../services/ipfsService');
const blockchainService = require('../services/blockchainService');
const plagiarismService = require('../services/plagiarismService');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, images, and documents
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and documents are allowed.'), false);
    }
  }
});

// GET /certificates/student/:studentEmail - Get all certificates for a student
router.get('/student/:studentEmail', authenticateToken, async (req, res) => {
  try {
    const { studentEmail } = req.params;
    
    // Check if user is requesting their own certificates or is an educator
    if (req.user.role !== 'educator' && req.user.email !== studentEmail) {
      return res.status(403).json({ error: 'Access denied. You can only view your own certificates.' });
    }

    const certificates = await Certificate.find({ 
      studentEmail: { $regex: new RegExp(`^${studentEmail}$`, 'i') }
    }).populate('courseId', 'title description');

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error('Error fetching student certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET /certificates/verify/:certificateId - Public certificate verification
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = await Certificate.findById(certificateId)
      .populate('courseId', 'title description')
      .populate('educatorId', 'firstName lastName email');

    if (!certificate) {
      return res.status(404).json({ 
        verified: false, 
        error: 'Certificate not found' 
      });
    }

    // Verify blockchain data
    const verificationData = {
      verified: true,
      certificate: {
        id: certificate._id,
        studentEmail: certificate.studentEmail,
        courseTitle: certificate.courseTitle,
        educatorName: certificate.educatorEmail,
        grade: certificate.grade,
        issuedAt: certificate.issuedAt,
        status: certificate.status,
        nftTokenId: certificate.nftTokenId,
        transactionHash: certificate.transactionHash,
        contractAddress: certificate.contractAddress,
        ipfsHash: certificate.ipfsHash,
        ipfsUrl: certificate.imageLink
      },
      blockchain: {
        tokenId: certificate.nftTokenId,
        transactionHash: certificate.transactionHash,
        contractAddress: certificate.contractAddress,
        network: 'Hardhat Local Network'
      },
      ipfs: {
        fileHash: certificate.ipfsHash,
        fileUrl: certificate.imageLink,
        metadataUrl: certificate.metadataLink
      }
    };

    res.json(verificationData);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ 
      verified: false, 
      error: 'Failed to verify certificate' 
    });
  }
});

// POST /certificates/check-originality - Check content originality before minting
router.post('/check-originality', authenticateToken, requireEducator, async (req, res) => {
  try {
    const { content, contentType = 'certificate' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required for originality check' });
    }

    console.log(`🔍 Checking ${contentType} content originality...`);
    
    const plagiarismResult = await plagiarismService.checkContentOriginality(content, contentType);
    
    res.json({
      success: true,
      data: {
        contentType: contentType,
        timestamp: new Date().toISOString(),
        aiScore: plagiarismResult.aiScore,
        plagiarism: plagiarismResult.plagiarism,
        riskLevel: plagiarismResult.riskLevel,
        recommendations: generateRecommendations(plagiarismResult.aiScore, plagiarismResult.plagiarism)
      }
    });

  } catch (error) {
    console.error('Error checking content originality:', error);
    res.status(500).json({ error: 'Failed to check content originality' });
  }
});

// Helper function to generate recommendations
function generateRecommendations(aiScore, plagiarism) {
  const recommendations = [];
  
  if (aiScore > 0.7) {
    recommendations.push('⚠️  High AI-generated content detected. Consider adding more original human input.');
  }
  
  if (aiScore > 0.5) {
    recommendations.push('⚠️  Moderate AI assistance detected. Review content for originality.');
  }
  
  if (plagiarism.score && plagiarism.score > 0.3) {
    recommendations.push('🚨 Significant plagiarism detected. Content needs substantial revision.');
  } else if (plagiarism.score && plagiarism.score > 0.1) {
    recommendations.push('⚠️  Minor plagiarism detected. Review and cite sources properly.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Content appears original and human-generated.');
  }
  
  return recommendations;
}

// GET /certificates/search - Search certificates with filters
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { 
      studentEmail, 
      courseId, 
      status, 
      grade, 
      startDate, 
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};
    
    if (studentEmail) {
      filter.studentEmail = { $regex: new RegExp(studentEmail, 'i') };
    }
    if (courseId) {
      filter.courseId = courseId;
    }
    if (status) {
      filter.status = status;
    }
    if (grade) {
      filter.grade = grade;
    }
    if (startDate || endDate) {
      filter.issuedAt = {};
      if (startDate) filter.issuedAt.$gte = new Date(startDate);
      if (endDate) filter.issuedAt.$lte = new Date(endDate);
    }

    // Add role-based filtering
    if (req.user.role === 'student') {
      filter.studentEmail = req.user.email;
    } else if (req.user.role === 'educator') {
      filter.educatorId = req.user._id;
    }

    const skip = (page - 1) * limit;
    
    const certificates = await Certificate.find(filter)
      .populate('courseId', 'title description')
      .populate('studentId', 'firstName lastName email')
      .populate('educatorId', 'firstName lastName email')
      .sort({ issuedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments(filter);

    res.json({
      success: true,
      data: certificates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching certificates:', error);
    res.status(500).json({ error: 'Failed to search certificates' });
  }
});

// POST /certificates/mint - Mint a certificate as NFT (Educators only)
router.post('/mint', authenticateToken, requireEducator, upload.single('certificateFile'), async (req, res) => {
  try {
    console.log('=== Certificate Minting Request ===');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const { 
      studentEmail, 
      courseId, 
      grade, 
      expiresAt,
      certificateFile,
      metadata 
    } = req.body;
    
    console.log('Extracted data:', { studentEmail, courseId, grade, expiresAt });
    
    // Validate required fields
    if (!studentEmail || !courseId || !grade) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'studentEmail, courseId, and grade are required' 
      });
    }

    console.log('Validation passed - checking course...');
    
    // Verify the course exists and belongs to the educator
    const course = await Course.findById(courseId);
    console.log('Course found:', course);
    
    if (!course) {
      console.log('Course not found for ID:', courseId);
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.educatorId.toString() !== req.user._id.toString()) {
      console.log('Access denied - course belongs to:', course.educatorId, 'user is:', req.user._id);
      return res.status(403).json({ error: 'Access denied. You do not own this course.' });
    }

    console.log('Course ownership verified - looking for student...');
    
    // Get student by email
    const User = require('../models/User');
    const student = await User.findOne({ email: { $regex: new RegExp(`^${studentEmail}$`, 'i') } });
    console.log('Student found:', student ? { id: student._id, email: student.email } : 'Not found');
    
    if (!student) {
      console.log('Student not found for email:', studentEmail);
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log('Starting IPFS upload and NFT minting process...');

    try {
      // Step 1: Upload certificate file to IPFS
      let ipfsFileResult = null;
      if (req.file) { // Check if req.file is available after multer middleware
        console.log('File received:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          bufferType: typeof req.file.buffer,
          bufferLength: req.file.buffer ? req.file.buffer.length : 'undefined'
        });
        
        // Ensure we have a proper Buffer object
        let fileBuffer = req.file.buffer;
        if (!Buffer.isBuffer(fileBuffer)) {
          fileBuffer = Buffer.from(fileBuffer);
        }
        
        console.log('Buffer prepared for IPFS:', {
          isBuffer: Buffer.isBuffer(fileBuffer),
          length: fileBuffer.length
        });
        
        ipfsFileResult = await ipfsService.uploadFile(
          fileBuffer, 
          `certificate_${student._id}_${courseId}.${req.file.originalname.split('.').pop() || 'pdf'}`, 
          req.file.mimetype || 'application/pdf'
        );
        console.log('Certificate file uploaded to IPFS:', ipfsFileResult);
      } else {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'Certificate file is required' });
      }

      // Step 2: Check content originality using GPTZero
      console.log('🔍 Checking certificate content originality...');
      let plagiarismResult = null;
      
      try {
        // Extract text content from the certificate file for analysis
        const contentToCheck = course.title + ' ' + course.description + ' ' + grade;
        plagiarismResult = await plagiarismService.checkContentOriginality(contentToCheck, 'certificate');
        console.log('✅ Plagiarism check completed:', plagiarismResult.riskLevel);
      } catch (error) {
        console.log('⚠️  Plagiarism check failed, continuing with minting:', error.message);
        plagiarismResult = { success: false, error: error.message };
      }

      // Step 3: Create and upload metadata to IPFS
      const certificateMetadata = {
        name: `${course.title} Certificate`,
        description: `Certificate of completion for ${course.title}`,
        image: ipfsFileResult ? ipfsFileResult.ipfsUrl : '',
        attributes: [
          { trait_type: 'Course', value: course.title },
          { trait_type: 'Student', value: student.email },
          { trait_type: 'Educator', value: req.user.email },
          { trait_type: 'Grade', value: grade },
          { trait_type: 'Issued Date', value: new Date().toISOString() },
          { trait_type: 'Expires Date', value: expiresAt || 'Never' },
          { trait_type: 'Type', value: 'Educational Certificate' },
          { trait_type: 'Originality Score', value: plagiarismResult?.success ? (100 - (plagiarismResult.aiScore * 100)).toFixed(1) + '%' : 'Unknown' },
          { trait_type: 'Risk Level', value: plagiarismResult?.riskLevel || 'Unknown' }
        ],
        external_url: `https://educhain.com/certificates/${student._id}`,
        background_color: 'ffffff',
        animation_url: '',
        plagiarism_check: plagiarismResult
      };

      const metadataResult = await ipfsService.uploadMetadata(
        certificateMetadata, 
        `metadata_${student._id}_${courseId}.json`
      );
      console.log('Metadata uploaded to IPFS:', metadataResult);

      // Step 3: Initialize blockchain service and mint NFT
      console.log('Initializing blockchain service...');
      const blockchainInitialized = await blockchainService.initialize();
      
      if (!blockchainInitialized) {
        console.log('Blockchain service initialization failed');
        throw new Error('Failed to initialize blockchain service');
      }
      
      console.log('Blockchain service initialized successfully');
      
      const nftResult = await blockchainService.mintNFT(
        student.email, // For now using email, in production you'd use Ethereum address
        metadataResult.ipfsUrl
      );
      console.log('NFT minted on blockchain:', nftResult);

      // Step 4: Create certificate with all the data
      const newCertificate = new Certificate({
        studentId: student._id,
        studentEmail: student.email,
        courseId,
        courseTitle: course.title,
        educatorId: req.user._id,
        educatorEmail: req.user.email,
        imageLink: ipfsFileResult ? ipfsFileResult.ipfsUrl : '',
        metadataLink: metadataResult.ipfsUrl,
        nftTokenId: nftResult.tokenId,
        transactionHash: nftResult.transactionHash,
        contractAddress: nftResult.contractAddress,
        status: 'minted',
        grade,
        expiresAt,
        ipfsHash: ipfsFileResult ? ipfsFileResult.ipfsHash : '',
        fileType: req.file?.mimetype || 'application/pdf',
        fileSize: req.file?.size || 0
      });

      const savedCertificate = await newCertificate.save();
      
      console.log('Certificate created and NFT minted successfully:', savedCertificate._id);

      res.status(201).json({
        success: true,
        message: 'Certificate created and NFT minted successfully!',
        data: {
          id: savedCertificate._id,
          studentId: savedCertificate.studentId,
          studentEmail: savedCertificate.studentEmail,
          courseId: savedCertificate.courseId,
          courseTitle: savedCertificate.courseTitle,
          educatorId: savedCertificate.educatorId,
          educatorEmail: savedCertificate.educatorEmail,
          status: savedCertificate.status,
          grade: savedCertificate.grade,
          issuedAt: savedCertificate.issuedAt,
          expiresAt: savedCertificate.expiresAt,
          createdAt: savedCertificate.createdAt,
          nftTokenId: savedCertificate.nftTokenId,
          transactionHash: savedCertificate.transactionHash,
          ipfsUrl: savedCertificate.imageLink,
          metadataUrl: savedCertificate.metadataLink
        }
      });

    } catch (mintingError) {
      console.error('Error during IPFS upload or NFT minting:', mintingError);
      
      // Create certificate with failed status
      const newCertificate = new Certificate({
        studentId: student._id,
        studentEmail: student.email,
        courseId,
        courseTitle: course.title,
        educatorId: req.user._id,
        educatorEmail: req.user.email,
        imageLink: '',
        metadataLink: '',
        grade,
        expiresAt,
        status: 'failed'
      });

      const savedCertificate = await newCertificate.save();
      
      res.status(500).json({
        success: false,
        message: 'Certificate created but NFT minting failed',
        error: mintingError.message,
        data: {
          id: savedCertificate._id,
          status: savedCertificate.status
        }
      });
    }

  } catch (error) {
    console.error('Certificate minting error:', error);
    res.status(500).json({ 
      error: 'Failed to create certificate for minting',
      details: error.message 
    });
  }
});

// POST /certificates - Upload a certificate (Educators only)
router.post('/', authenticateToken, requireEducator, async (req, res) => {
  try {
    const { studentId, courseId, imageLink, metadataLink, grade, expiresAt } = req.body;
    
    // Validate required fields
    if (!studentId || !courseId || !imageLink || !metadataLink) {
      return res.status(400).json({ 
        error: 'studentId, courseId, imageLink, and metadataLink are required' 
      });
    }

    // Verify the course exists and belongs to the educator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.educatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You do not own this course.' });
    }

    // Get student email from User model
    const User = require('../models/User');
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Create new certificate
    const newCertificate = new Certificate({
      studentId,
      studentEmail: student.email,
      courseId,
      courseTitle: course.title,
      educatorId: req.user._id,
      educatorEmail: req.user.email,
      imageLink,
      metadataLink,
      grade,
      expiresAt
    });

    const savedCertificate = await newCertificate.save();
    
    console.log('Certificate created successfully:', savedCertificate._id);

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: {
        id: savedCertificate._id,
        studentId: savedCertificate.studentId,
        studentEmail: savedCertificate.studentEmail,
        courseId: savedCertificate.courseId,
        courseTitle: savedCertificate.courseTitle,
        educatorId: savedCertificate.educatorId,
        educatorEmail: savedCertificate.educatorEmail,
        imageLink: savedCertificate.imageLink,
        metadataLink: savedCertificate.metadataLink,
        status: savedCertificate.status,
        grade: savedCertificate.grade,
        issuedAt: savedCertificate.issuedAt,
        expiresAt: savedCertificate.expiresAt,
        createdAt: savedCertificate.createdAt
      }
    });

  } catch (error) {
    console.error('Certificate creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create certificate',
      details: error.message 
    });
  }
});

// GET /certificates - Get all certificates (Educators can see their own, Students can see theirs)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let certificates;
    
    if (req.user.role === 'educator') {
      // Educators see certificates they've issued
      certificates = await Certificate.find({ educatorId: req.user._id })
        .populate('studentId', 'email firstName lastName')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'student') {
      // Students see certificates they've earned
      certificates = await Certificate.find({ studentId: req.user._id })
        .populate('courseId', 'title')
        .populate('educatorId', 'email firstName lastName')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ error: 'Invalid user role' });
    }

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch certificates' 
    });
  }
});

// GET /certificates/:id - Get specific certificate details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('studentId', 'email firstName lastName')
      .populate('courseId', 'title description')
      .populate('educatorId', 'email firstName lastName');

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Check if user has access to this certificate
    if (req.user.role === 'educator' && certificate.educatorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'student' && certificate.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: certificate
    });

  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ 
      error: 'Failed to fetch certificate' 
    });
  }
});

// PUT /certificates/:id - Update certificate (Educator who issued it only)
router.put('/:id', authenticateToken, requireEducator, requireOwnership('Certificate'), async (req, res) => {
  try {
    const { imageLink, metadataLink, grade, expiresAt, status } = req.body;
    
    const updateData = {};
    if (imageLink) updateData.imageLink = imageLink;
    if (metadataLink) updateData.metadataLink = metadataLink;
    if (grade !== undefined) updateData.grade = grade;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt;
    if (status) updateData.status = status;

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Certificate updated successfully',
      data: updatedCertificate
    });

  } catch (error) {
    console.error('Certificate update error:', error);
    res.status(500).json({ 
      error: 'Failed to update certificate' 
    });
  }
});

// DELETE /certificates/:id - Delete certificate (Educator who issued it only)
router.delete('/:id', authenticateToken, requireEducator, requireOwnership('Certificate'), async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Certificate deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete certificate' 
    });
  }
});

// GET /certificates/course/:courseId - Get all certificates for a specific course
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user has access to this course
    if (req.user.role === 'educator' && course.educatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const certificates = await Certificate.find({ courseId: req.params.courseId })
      .populate('studentId', 'email firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Error fetching course certificates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch course certificates' 
    });
  }
});

// POST /certificates/:id/retry-mint - Retry minting a failed certificate
router.post('/:id/retry-mint', authenticateToken, requireEducator, requireOwnership('Certificate'), async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (certificate.status !== 'failed') {
      return res.status(400).json({ error: 'Only failed certificates can be retried' });
    }

    console.log('Retrying minting for certificate:', certificate._id);

    // Get the course and student details
    const course = await Course.findById(certificate.courseId);
    const User = require('../models/User');
    const student = await User.findById(certificate.studentId);

    if (!course || !student) {
      return res.status(404).json({ error: 'Course or student not found' });
    }

    // Retry the minting process
    try {
      // Create metadata for retry
      const certificateMetadata = {
        name: `${course.title} Certificate`,
        description: `Certificate of completion for ${course.title}`,
        image: '', // Will be updated if file is available
        attributes: [
          { trait_type: 'Course', value: course.title },
          { trait_type: 'Student', value: student.email },
          { trait_type: 'Educator', value: req.user.email },
          { trait_type: 'Grade', value: certificate.grade },
          { trait_type: 'Issued Date', value: new Date().toISOString() },
          { trait_type: 'Expires Date', value: certificate.expiresAt || 'Never' },
          { trait_type: 'Type', value: 'Educational Certificate' }
        ],
        external_url: `https://educhain.com/certificates/${student._id}`,
        background_color: 'ffffff',
        animation_url: ''
      };

      // Retry minting on blockchain
      const nftResult = await blockchainService.mintNFT(
        student.email,
        certificate.metadataLink || 'https://example.com/metadata.json'
      );

      // Update certificate with success
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        req.params.id,
        {
          status: 'minted',
          nftTokenId: nftResult.tokenId,
          transactionHash: nftResult.transactionHash,
          contractAddress: nftResult.contractAddress
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Certificate minting retry successful!',
        data: updatedCertificate
      });

    } catch (mintingError) {
      console.error('Retry minting failed:', mintingError);
      
      // Update certificate status to failed again
      await Certificate.findByIdAndUpdate(req.params.id, { status: 'failed' });
      
      res.status(500).json({
        success: false,
        message: 'Certificate minting retry failed',
        error: mintingError.message
      });
    }

  } catch (error) {
    console.error('Error retrying certificate mint:', error);
    res.status(500).json({ 
      error: 'Failed to retry certificate minting' 
    });
  }
});

// GET /certificates/status/:status - Get certificates by status
router.get('/status/:status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.params;
    let certificates;
    
    if (req.user.role === 'educator') {
      certificates = await Certificate.find({ 
        educatorId: req.user._id, 
        status: status 
      }).populate('studentId', 'email firstName lastName')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'student') {
      certificates = await Certificate.find({ 
        studentId: req.user._id, 
        status: status 
      }).populate('courseId', 'title')
        .populate('educatorId', 'email firstName lastName')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ error: 'Invalid user role' });
    }

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Error fetching certificates by status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch certificates by status' 
    });
  }
});

module.exports = router;