const express = require('express');
const multer = require('multer');
const nftController = require('../controllers/nftController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/nft/mint - Mint new NFT
router.post('/mint', upload.single('file'), nftController.mintNFT);

// POST /api/nft/complete - Complete NFT minting after transaction
router.post('/complete', nftController.completeMinting);

// GET /api/nft/:tokenId - Get NFT by token ID
router.get('/:tokenId', nftController.getNFT);

// GET /api/nft/user/:address - Get all NFTs for a user
router.get('/user/:address', nftController.getUserNFTs);

// GET /api/nft - Get all NFTs
router.get('/', nftController.getAllNFTs);

// GET /api/nft/test/pinata - Test Pinata connection
router.get('/test/pinata', nftController.testPinataConnection);

module.exports = router;





