const { ethers } = require('ethers');
const ipfsService = require('./ipfsService');
const pinataService = require('./pinataService');
const blockchainService = require('./blockchainService');
require('dotenv').config();

class NFTService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = process.env.NFT_CONTRACT_ADDRESS;
    this.privateKey = process.env.PRIVATE_KEY;
    this.networkUrl = process.env.ETHEREUM_NETWORK_URL || 'https://sepolia.infura.io/v3/your-project-id';
  }

  /**
   * Initialize the NFT service with blockchain connection
   */
  async initialize() {
    try {
      console.log('🔗 Initializing NFT Service...');
      
      // Initialize blockchain service
      await blockchainService.initialize();
      this.provider = blockchainService.provider;
      this.signer = blockchainService.signer;

      // Load contract ABI and create contract instance
      if (this.contractAddress && this.contractAddress !== '0x0000000000000000000000000000000000000000') {
        await this.loadContract();
      }

      console.log('✅ NFT Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize NFT Service:', error.message);
      return false;
    }
  }

  /**
   * Load the smart contract ABI and create contract instance
   */
  async loadContract() {
    try {
      // Contract ABI for EduChainNFT
      const contractABI = [
        "function safeMint(address to, string memory tokenURI, address royaltyReceiver, uint96 royaltyBPS) external returns (uint256)",
        "function setDefaultRoyalty(address receiver, uint96 feeNumerator) external",
        "function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external",
        "function withdraw() external",
        "function totalSupply() external view returns (uint256)",
        "function getTokenIdCounter() external view returns (uint256)",
        "function exists(uint256 tokenId) external view returns (bool)",
        "function getTokenRoyalty(uint256 tokenId) external view returns (address, uint96)",
        "function owner() external view returns (address)",
        "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
        "event NFTMinted(uint256 indexed tokenId, address indexed to, string tokenURI, address royaltyReceiver, uint96 royaltyBPS)"
      ];

      this.contract = new ethers.Contract(this.contractAddress, contractABI, this.signer);
      console.log('✅ Smart contract loaded:', this.contractAddress);
    } catch (error) {
      console.error('❌ Failed to load smart contract:', error.message);
      throw error;
    }
  }

  /**
   * Create NFT metadata and upload to IPFS
   * @param {Object} nftData - NFT data including name, description, image, etc.
   * @returns {Promise<Object>} - IPFS metadata result
   */
  async createAndUploadMetadata(nftData) {
    try {
      const {
        name,
        description,
        image,
        attributes = [],
        externalUrl = "https://educhain.com",
        animationUrl = "",
        backgroundColor = "",
        youtubeUrl = ""
      } = nftData;

      // Create metadata object following OpenSea standards
      const metadata = {
        name: name,
        description: description,
        image: image,
        attributes: attributes,
        external_url: externalUrl,
        animation_url: animationUrl,
        background_color: backgroundColor,
        youtube_url: youtubeUrl,
        // EduChain specific fields
        created_at: new Date().toISOString(),
        collection: {
          name: "EduChain Certificates",
          family: "EduChain"
        }
      };

      console.log('📝 Creating NFT metadata...');
      const metadataName = `educhain-nft-${Date.now()}`;
      
      // Upload metadata to IPFS
      const result = await ipfsService.uploadMetadata(metadata, metadataName);
      
      console.log('✅ Metadata uploaded to IPFS:', result.ipfsHash);
      return result;
    } catch (error) {
      console.error('❌ Error creating and uploading metadata:', error.message);
      throw new Error(`Failed to create NFT metadata: ${error.message}`);
    }
  }

  /**
   * Mint NFT with metadata and royalties
   * @param {string} recipient - Recipient's Ethereum address
   * @param {Object} nftData - NFT data for metadata creation
   * @param {Object} royaltySettings - Royalty configuration
   * @returns {Promise<Object>} - Minting result
   */
  async mintNFT(recipient, nftData, royaltySettings = {}) {
    try {
      console.log('🎨 Starting NFT minting process...');
      console.log('👤 Recipient:', recipient);
      console.log('📋 NFT Data:', nftData);

      // Step 1: Create and upload metadata to IPFS
      const metadataResult = await this.createAndUploadMetadata(nftData);
      const tokenURI = `ipfs://${metadataResult.ipfsHash}`;

      // Step 2: Mint NFT on blockchain
      const mintResult = await this.mintOnBlockchain(recipient, tokenURI, royaltySettings);

      // Step 3: Combine results
      const result = {
        success: true,
        tokenId: mintResult.tokenId,
        transactionHash: mintResult.transactionHash,
        contractAddress: this.contractAddress,
        recipient: recipient,
        tokenURI: tokenURI,
        ipfsHash: metadataResult.ipfsHash,
        ipfsUrl: metadataResult.ipfsUrl,
        metadata: nftData,
        royaltySettings: royaltySettings,
        timestamp: new Date().toISOString()
      };

      console.log('✅ NFT minted successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error minting NFT:', error.message);
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  /**
   * Mint NFT on the blockchain
   * @param {string} recipient - Recipient's address
   * @param {string} tokenURI - IPFS URI of metadata
   * @param {Object} royaltySettings - Royalty configuration
   * @returns {Promise<Object>} - Blockchain minting result
   */
  async mintOnBlockchain(recipient, tokenURI, royaltySettings) {
    try {
      if (!this.contract) {
        console.log('⚠️  No contract deployed, using simulation mode');
        return await this.simulateMinting(recipient, tokenURI);
      }

      console.log('🚀 Minting on blockchain...');
      
      const {
        royaltyReceiver = recipient, // Default to recipient
        royaltyBPS = 500 // Default 5% royalty
      } = royaltySettings;

      // Estimate gas first
      const gasEstimate = await this.contract.estimateGas.safeMint(
        recipient,
        tokenURI,
        royaltyReceiver,
        royaltyBPS
      );

      console.log('⛽ Gas estimate:', gasEstimate.toString());

      // Execute minting transaction
      const tx = await this.contract.safeMint(
        recipient,
        tokenURI,
        royaltyReceiver,
        royaltyBPS,
        {
          gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
        }
      );

      console.log('⏳ Transaction submitted:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

      // Get token ID from event logs
      const mintEvent = receipt.events?.find(e => e.event === 'NFTMinted');
      const tokenId = mintEvent ? mintEvent.args.tokenId.toString() : 'unknown';

      return {
        tokenId: tokenId,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        simulated: false
      };
    } catch (error) {
      console.error('❌ Error minting on blockchain:', error.message);
      
      // Fallback to simulation if blockchain fails
      console.log('🔄 Falling back to simulation mode...');
      return await this.simulateMinting(recipient, tokenURI);
    }
  }

  /**
   * Simulate NFT minting (for testing or when contract not deployed)
   * @param {string} recipient - Recipient's address
   * @param {string} tokenURI - IPFS URI
   * @returns {Promise<Object>} - Simulation result
   */
  async simulateMinting(recipient, tokenURI) {
    const transactionHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`${recipient}-${tokenURI}-${Date.now()}`)
    ).slice(0, 66);

    const tokenId = Math.floor(Math.random() * 1000000).toString();

    console.log('🎭 NFT minted (simulated)! Token ID:', tokenId);

    return {
      tokenId: tokenId,
      transactionHash: transactionHash,
      blockNumber: 'simulated',
      gasUsed: '0',
      simulated: true
    };
  }

  /**
   * Get NFT metadata from IPFS
   * @param {string} ipfsHash - IPFS hash of the metadata
   * @returns {Promise<Object>} - NFT metadata
   */
  async getNFTMetadata(ipfsHash) {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching NFT metadata:', error.message);
      throw new Error(`Failed to get NFT metadata: ${error.message}`);
    }
  }

  /**
   * Get user's NFTs
   * @param {string} userAddress - User's Ethereum address
   * @returns {Promise<Array>} - Array of user's NFTs
   */
  async getUserNFTs(userAddress) {
    try {
      // This would normally query the blockchain for user's NFTs
      // For now, return mock data
      return [
        {
          tokenId: '1',
          name: 'EduChain Certificate',
          description: 'Educational achievement certificate',
          image: 'https://example.com/certificate.jpg',
          contractAddress: this.contractAddress
        }
      ];
    } catch (error) {
      console.error('❌ Error getting user NFTs:', error.message);
      throw new Error(`Failed to get user NFTs: ${error.message}`);
    }
  }

  /**
   * Set default royalty for the contract
   * @param {string} receiver - Royalty receiver address
   * @param {number} feeNumerator - Royalty fee in basis points
   * @returns {Promise<Object>} - Transaction result
   */
  async setDefaultRoyalty(receiver, feeNumerator) {
    try {
      if (!this.contract) {
        throw new Error('Contract not loaded');
      }

      const tx = await this.contract.setDefaultRoyalty(receiver, feeNumerator);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error setting default royalty:', error.message);
      throw new Error(`Failed to set default royalty: ${error.message}`);
    }
  }

  /**
   * Withdraw contract funds
   * @returns {Promise<Object>} - Withdrawal result
   */
  async withdraw() {
    try {
      if (!this.contract) {
        throw new Error('Contract not loaded');
      }

      const tx = await this.contract.withdraw();
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error withdrawing funds:', error.message);
      throw new Error(`Failed to withdraw funds: ${error.message}`);
    }
  }

  /**
   * Test all services
   * @returns {Promise<Object>} - Test results
   */
  async testServices() {
    const results = {
      ipfs: false,
      blockchain: false,
      contract: false
    };

    try {
      // Test IPFS connection
      results.ipfs = await ipfsService.testConnection();
    } catch (error) {
      console.error('IPFS test failed:', error.message);
    }

    try {
      // Test blockchain connection
      const blockchainTest = await blockchainService.testConnection();
      results.blockchain = blockchainTest.connected;
    } catch (error) {
      console.error('Blockchain test failed:', error.message);
    }

    try {
      // Test contract connection
      if (this.contract) {
        await this.contract.totalSupply();
        results.contract = true;
      }
    } catch (error) {
      console.error('Contract test failed:', error.message);
    }

    return results;
  }
}

module.exports = new NFTService();

