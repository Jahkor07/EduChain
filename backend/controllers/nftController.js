const { ethers } = require('ethers');
const NFT = require('../models/NFT');
const { getContract, getProvider, CONTRACT_CONFIG } = require('../config/contract');
const pinataService = require('../services/pinataService');

class NFTController {
  // Mint NFT with file upload, IPFS storage, and smart contract interaction
  async mintNFT(req, res) {
    try {
      console.log('Starting NFT minting process...');
      
      // Validate request
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded' 
        });
      }

      const { 
        name, 
        description, 
        recipient, 
        courseId, 
        studentId, 
        certificateType = 'course_completion',
        attributes = []
      } = req.body;

      if (!name || !description || !recipient) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: name, description, recipient' 
        });
      }

      // Validate recipient address
      if (!ethers.isAddress(recipient)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid recipient address' 
        });
      }

      console.log('Uploading file to IPFS...');
      
      // Upload file to IPFS via Pinata
      const fileUploadResult = await pinataService.uploadFile(
        req.file.buffer, 
        req.file.originalname
      );

      console.log('Creating NFT metadata...');
      
      // Parse attributes if it's a string
      let parsedAttributes = [];
      if (typeof attributes === 'string') {
        try {
          parsedAttributes = JSON.parse(attributes);
        } catch (e) {
          parsedAttributes = [];
        }
      } else if (Array.isArray(attributes)) {
        parsedAttributes = attributes;
      }

      // Create NFT metadata
      const metadata = pinataService.createNFTMetadata(
        name,
        description,
        fileUploadResult.ipfsUrl,
        parsedAttributes
      );

      console.log('Uploading metadata to IPFS...');
      
      // Upload metadata to IPFS
      const metadataUploadResult = await pinataService.uploadMetadata(metadata);

      console.log('Preparing smart contract transaction...');
      
      // Get next token ID (for demo purposes, we'll use a simple counter)
      const newTokenId = Date.now(); // Simple token ID generation for demo

      console.log(`Preparing NFT with token ID: ${newTokenId}`);
      
      // Return transaction data for frontend to sign
      const response = {
        success: true,
        message: 'NFT metadata prepared successfully',
        data: {
          tokenId: newTokenId,
          tokenURI: metadataUploadResult.ipfsUrl,
          imageUrl: fileUploadResult.ipfsUrl,
          metadata: metadata,
          transaction: {
            to: CONTRACT_CONFIG.CONTRACT_ADDRESS,
            data: '0x', // Simplified for demo
            gasLimit: '500000',
            gasPrice: '20000000000',
            value: '0x0'
          },
          recipient: recipient,
          courseId: courseId || null,
          studentId: studentId || null,
          certificateType: certificateType
        }
      };

      res.json(response);

    } catch (error) {
      console.error('NFT minting error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to mint NFT',
        error: error.message 
      });
    }
  }

  // Complete NFT minting after transaction is signed
  async completeMinting(req, res) {
    try {
      const { 
        tokenId, 
        transactionHash, 
        blockNumber, 
        recipient, 
        courseId, 
        studentId, 
        certificateType,
        metadata 
      } = req.body;

      if (!tokenId || !transactionHash || !recipient) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      console.log(`Completing NFT minting for token ID: ${tokenId}`);

      // Create NFT record in MongoDB (using in-memory for demo)
      const nftRecord = {
        tokenId: tokenId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        metadata: JSON.stringify(metadata),
        transactionHash: transactionHash,
        blockNumber: blockNumber || 0,
        creator: recipient,
        owner: recipient,
        courseId: courseId,
        studentId: studentId,
        certificateType: certificateType,
        attributes: metadata.attributes || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in memory for demo (replace with actual MongoDB save)
      if (!global.nftDatabase) {
        global.nftDatabase = [];
      }
      global.nftDatabase.push(nftRecord);

      console.log(`NFT ${tokenId} saved to database`);

      res.json({
        success: true,
        message: 'NFT minting completed successfully',
        data: {
          tokenId: tokenId,
          transactionHash: transactionHash,
          nft: nftRecord
        }
      });

    } catch (error) {
      console.error('Error completing NFT minting:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to complete NFT minting',
        error: error.message 
      });
    }
  }

  // Get NFT by token ID
  async getNFT(req, res) {
    try {
      const { tokenId } = req.params;
      
      // Use in-memory database for demo
      const nftDatabase = global.nftDatabase || [];
      const nft = nftDatabase.find(n => n.tokenId.toString() === tokenId.toString());
      
      if (!nft) {
        return res.status(404).json({ 
          success: false, 
          message: 'NFT not found' 
        });
      }

      res.json({
        success: true,
        data: nft
      });

    } catch (error) {
      console.error('Error fetching NFT:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch NFT',
        error: error.message 
      });
    }
  }

  // Get all NFTs for a user
  async getUserNFTs(req, res) {
    try {
      const { address } = req.params;
      
      // Use in-memory database for demo
      const nftDatabase = global.nftDatabase || [];
      const nfts = nftDatabase.filter(n => 
        n.owner.toLowerCase() === address.toLowerCase()
      );
      
      res.json({
        success: true,
        data: nfts
      });

    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user NFTs',
        error: error.message 
      });
    }
  }

  // Get all NFTs
  async getAllNFTs(req, res) {
    try {
      const nftDatabase = global.nftDatabase || [];
      
      res.json({
        success: true,
        data: nftDatabase.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });

    } catch (error) {
      console.error('Error fetching all NFTs:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch NFTs',
        error: error.message 
      });
    }
  }

  // Test Pinata connection
  async testPinataConnection(req, res) {
    try {
      const isConnected = await pinataService.testConnection();
      
      res.json({
        success: true,
        connected: isConnected,
        message: isConnected ? 'Pinata connection successful' : 'Pinata connection failed'
      });

    } catch (error) {
      console.error('Pinata connection test error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to test Pinata connection',
        error: error.message 
      });
    }
  }
}

module.exports = new NFTController();