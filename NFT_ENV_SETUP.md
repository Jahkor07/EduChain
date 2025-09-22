# EduChain NFT Environment Setup

## Required Environment Variables

Add these variables to your `backend/.env` file:

```bash
# ===========================================
# BLOCKCHAIN CONFIGURATION
# ===========================================

# Ethereum network URL (use testnet for development)
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
# Alternative networks:
# ETHEREUM_NETWORK_URL=https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
# ETHEREUM_NETWORK_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key for contract interactions (NEVER commit this to version control)
PRIVATE_KEY=your_private_key_here

# NFT Contract Address (set after deployment)
NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# ===========================================
# IPFS CONFIGURATION (Pinata)
# ===========================================

# Pinata API credentials
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here

# Alternative: Pinata SDK credentials
PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here

# ===========================================
# JWT CONFIGURATION
# ===========================================

# JWT secret for token generation
JWT_SECRET=your_jwt_secret_here

# ===========================================
# DATABASE CONFIGURATION
# ===========================================

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/educhain

# ===========================================
# SERVER CONFIGURATION
# ===========================================

# Server port
PORT=5000

# ===========================================
# EXTERNAL API KEYS
# ===========================================

# Google Books API (for book search)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here

# ===========================================
# ROYALTY CONFIGURATION
# ===========================================

# Default royalty percentage (in basis points: 500 = 5%)
DEFAULT_ROYALTY_BPS=500

# Default royalty receiver (contract owner)
DEFAULT_ROYALTY_RECEIVER=0x0000000000000000000000000000000000000000
```

## Setup Instructions

### 1. Deploy Smart Contract
```bash
# Install dependencies
npm install

# Deploy to testnet
npx hardhat run scripts/deploy-nft.js --network sepolia

# Deploy to local network
npx hardhat run scripts/deploy-nft.js --network localhost
```

### 2. Set Up Pinata IPFS
1. Create account at [Pinata.cloud](https://pinata.cloud)
2. Get your API key and secret from the dashboard
3. Add credentials to your `.env` file

### 3. Configure Ethereum Network
1. Get Infura project ID from [Infura.io](https://infura.io)
2. Add network URL to your `.env` file
3. Add your private key (use a test account for development)

### 4. Test the Complete Flow
1. Start the backend server: `npm start`
2. Start the frontend: `npm start` (in client directory)
3. Navigate to the NFT minting page
4. Test minting an NFT

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific `.env` files (.env.development, .env.production)
- Rotate your API keys regularly
- Use a hardware wallet for production private keys
- Test thoroughly on testnets before mainnet deployment

## API Endpoints

The NFT functionality provides these endpoints:

- `POST /api/nft/upload-image` - Upload image to IPFS
- `POST /api/nft/mint` - Mint NFT with metadata
- `GET /api/nft/metadata/:ipfsHash` - Get NFT metadata
- `GET /api/nft/user/:userAddress` - Get user's NFTs
- `POST /api/nft/set-royalty` - Set default royalty (admin)
- `POST /api/nft/withdraw` - Withdraw contract funds (admin)
- `GET /api/nft/test` - Test all services

