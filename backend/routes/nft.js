const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const { auth } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Initialize NFT service for all routes
router.use(nftController.initializeNFTService);

// Test all services
router.get('/test', nftController.testServices);

// Upload image for NFT
router.post('/upload-image', nftController.upload.single('image'), nftController.uploadImage);

// Mint NFT
router.post('/mint', nftController.upload.single('image'), nftController.mintNFT);

// Get NFT metadata
router.get('/metadata/:ipfsHash', nftController.getNFTMetadata);

// Get user's NFTs
router.get('/user/:userAddress', nftController.getUserNFTs);

// Admin routes (require educator role)
router.post('/set-royalty', nftController.setDefaultRoyalty);
router.post('/withdraw', nftController.withdraw);

module.exports = router;