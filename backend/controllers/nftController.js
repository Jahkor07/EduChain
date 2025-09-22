const nftService = require('../services/nftService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, SVG) and PDF files are allowed'));
    }
  }
});

/**
 * Initialize NFT service
 */
const initializeNFTService = async (req, res, next) => {
  try {
    const initialized = await nftService.initialize();
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize NFT service'
      });
    }
    next();
  } catch (error) {
    console.error('NFT service initialization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize NFT service'
    });
  }
};

/**
 * Test all NFT services
 */
const testServices = async (req, res) => {
  try {
    console.log('🧪 Testing NFT services...');
    
    const results = await nftService.testServices();
    
    res.json({
      success: true,
      message: 'Service test completed',
      results: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Service test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test services',
      error: error.message
    });
  }
};

/**
 * Mint NFT for educator
 */
const mintNFT = async (req, res) => {
  try {
    const {
      recipient,
      name,
      description,
      attributes = [],
      externalUrl = "https://educhain.com",
      animationUrl = "",
      backgroundColor = "",
      youtubeUrl = "",
      royaltyReceiver,
      royaltyBPS = 500 // Default 5%
    } = req.body;

    // Validate required fields
    if (!recipient || !name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Recipient, name, and description are required'
      });
    }

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum address format'
      });
    }

    // Validate royalty percentage (max 10%)
    if (royaltyBPS > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Royalty cannot exceed 10% (1000 basis points)'
      });
    }

    console.log('🎨 Minting NFT for educator...');
    console.log('👤 Recipient:', recipient);
    console.log('📝 Name:', name);

    // Prepare NFT data
    const nftData = {
      name,
      description,
      image: req.file ? `ipfs://${req.file.ipfsHash}` : 'https://via.placeholder.com/400x400/6366f1/ffffff?text=EduChain+NFT',
      attributes,
      externalUrl,
      animationUrl,
      backgroundColor,
      youtubeUrl
    };

    // Prepare royalty settings
    const royaltySettings = {
      royaltyReceiver: royaltyReceiver || recipient,
      royaltyBPS: parseInt(royaltyBPS)
    };

    // Mint the NFT
    const result = await nftService.mintNFT(recipient, nftData, royaltySettings);

    console.log('✅ NFT minted successfully:', result.tokenId);

    res.status(201).json({
      success: true,
      message: 'NFT minted successfully',
      data: result
    });

  } catch (error) {
    console.error('NFT minting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mint NFT',
      error: error.message
    });
  }
};

/**
 * Upload image for NFT
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('📤 Uploading image to IPFS...');
    console.log('📁 File:', req.file.originalname);
    console.log('📏 Size:', req.file.size, 'bytes');

    // Upload file to IPFS
    const result = await nftService.ipfsService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Store IPFS hash in request for use in minting
    req.file.ipfsHash = result.ipfsHash;

    res.json({
      success: true,
      message: 'Image uploaded to IPFS successfully',
      data: {
        ipfsHash: result.ipfsHash,
        ipfsUrl: result.ipfsUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

/**
 * Get NFT metadata
 */
const getNFTMetadata = async (req, res) => {
  try {
    const { ipfsHash } = req.params;

    if (!ipfsHash) {
      return res.status(400).json({
        success: false,
        message: 'IPFS hash is required'
      });
    }

    const metadata = await nftService.getNFTMetadata(ipfsHash);

    res.json({
      success: true,
      data: metadata
    });

  } catch (error) {
    console.error('Get metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT metadata',
      error: error.message
    });
  }
};

/**
 * Get user's NFTs
 */
const getUserNFTs = async (req, res) => {
  try {
    const { userAddress } = req.params;

    if (!userAddress || !/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Ethereum address is required'
      });
    }

    const nfts = await nftService.getUserNFTs(userAddress);

    res.json({
      success: true,
      data: nfts,
      count: nfts.length
    });

  } catch (error) {
    console.error('Get user NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user NFTs',
      error: error.message
    });
  }
};

/**
 * Set default royalty
 */
const setDefaultRoyalty = async (req, res) => {
  try {
    const { receiver, feeNumerator } = req.body;

    if (!receiver || !/^0x[a-fA-F0-9]{40}$/.test(receiver)) {
      return res.status(400).json({
        success: false,
        message: 'Valid receiver address is required'
      });
    }

    if (feeNumerator > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Royalty cannot exceed 10% (1000 basis points)'
      });
    }

    const result = await nftService.setDefaultRoyalty(receiver, feeNumerator);

    res.json({
      success: true,
      message: 'Default royalty set successfully',
      data: result
    });

  } catch (error) {
    console.error('Set default royalty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default royalty',
      error: error.message
    });
  }
};

/**
 * Withdraw contract funds
 */
const withdraw = async (req, res) => {
  try {
    const result = await nftService.withdraw();

    res.json({
      success: true,
      message: 'Funds withdrawn successfully',
      data: result
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw funds',
      error: error.message
    });
  }
};

module.exports = {
  initializeNFTService,
  testServices,
  mintNFT,
  uploadImage,
  getNFTMetadata,
  getUserNFTs,
  setDefaultRoyalty,
  withdraw,
  upload // Export multer upload middleware
};