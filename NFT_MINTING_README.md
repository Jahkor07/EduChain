# EduChain NFT Minting System

A complete NFT minting flow for Educators with metadata stored on IPFS and automatic royalties.

## 🚀 Features

- **Smart Contract**: ERC721 with ERC721URIStorage and ERC2981 royalties
- **IPFS Storage**: Metadata stored permanently on Pinata IPFS
- **Automatic Royalties**: Configurable royalty system for creators
- **Image Upload**: Support for various image formats (PNG, JPG, GIF, SVG)
- **Attributes System**: Custom traits for NFT metadata
- **Admin Controls**: Royalty management and fund withdrawal
- **Responsive UI**: Modern, user-friendly minting interface

## 📁 File Structure

```
├── contracts/
│   └── EduChainNFT.sol              # Smart contract
├── backend/
│   ├── services/
│   │   ├── nftService.js            # Main NFT service
│   │   ├── pinataService.js         # IPFS integration
│   │   └── blockchainService.js     # Blockchain interactions
│   ├── controllers/
│   │   └── nftController.js         # API controllers
│   └── routes/
│       └── nft.js                   # API routes
├── client/src/components/
│   └── NFTMinting.js                # Frontend minting interface
├── scripts/
│   └── deploy-nft.js                # Contract deployment script
└── NFT_ENV_SETUP.md                 # Environment setup guide
```

## 🛠️ Smart Contract Features

### EduChainNFT.sol
- **ERC721**: Standard NFT functionality
- **ERC721URIStorage**: Metadata URI management
- **ERC2981**: Royalty standard compliance
- **Ownable**: Access control for admin functions

### Key Functions
```solidity
// Mint NFT with custom royalty
function safeMint(address to, string memory tokenURI, address royaltyReceiver, uint96 royaltyBPS)

// Set default royalty for all future tokens
function setDefaultRoyalty(address receiver, uint96 feeNumerator)

// Set royalty for specific token
function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator)

// Withdraw contract funds
function withdraw()
```

## 🔧 Backend API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/nft/upload-image` | Upload image to IPFS |
| `POST` | `/api/nft/mint` | Mint NFT with metadata |
| `GET` | `/api/nft/metadata/:ipfsHash` | Get NFT metadata |
| `GET` | `/api/nft/user/:userAddress` | Get user's NFTs |
| `POST` | `/api/nft/set-royalty` | Set default royalty (admin) |
| `POST` | `/api/nft/withdraw` | Withdraw contract funds (admin) |
| `GET` | `/api/nft/test` | Test all services |

### Example Mint Request
```json
{
  "recipient": "0x742d35Cc6634C0532925a3b8D0C0C1C0C1C0C1C0",
  "name": "Advanced JavaScript Certificate",
  "description": "Certificate for completing Advanced JavaScript course",
  "attributes": [
    { "trait_type": "Course", "value": "JavaScript" },
    { "trait_type": "Level", "value": "Advanced" },
    { "trait_type": "Issuer", "value": "EduChain" }
  ],
  "royaltyReceiver": "0x742d35Cc6634C0532925a3b8D0C0C1C0C1C0C1C0",
  "royaltyBPS": 500
}
```

## 🎨 Frontend Features

### NFTMinting.js Component
- **Step-by-step wizard**: Guided minting process
- **Image upload**: Drag & drop with IPFS upload
- **Form validation**: Real-time validation with error messages
- **Attributes builder**: Dynamic trait management
- **Royalty configuration**: Visual royalty percentage setting
- **Success tracking**: Transaction and IPFS hash display

### UI Steps
1. **Basic Information**: Name, description, recipient
2. **Attributes & Royalties**: Traits and royalty settings
3. **Success**: Transaction confirmation and links

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp NFT_ENV_SETUP.md backend/.env

# Edit with your credentials
nano backend/.env
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd client
npm install

# Smart contracts
npm install
```

### 3. Deploy Smart Contract
```bash
# Deploy to testnet
npx hardhat run scripts/deploy-nft.js --network sepolia

# Update .env with contract address
echo "NFT_CONTRACT_ADDRESS=0x..." >> backend/.env
```

### 4. Start Services
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd client
npm start
```

### 5. Test Minting
1. Navigate to NFT minting page
2. Fill in NFT details
3. Upload image
4. Configure royalties
5. Mint NFT

## 🔐 Security Features

- **Input validation**: All inputs validated on frontend and backend
- **File type restrictions**: Only allowed image formats
- **File size limits**: 10MB maximum upload size
- **Address validation**: Ethereum address format checking
- **Royalty limits**: Maximum 10% royalty enforcement
- **Access control**: Admin-only functions protected

## 📊 Royalty System

### How It Works
1. **Default Royalty**: Set for all future tokens (5% default)
2. **Token-specific Royalty**: Override for individual tokens
3. **Automatic Distribution**: Royalties sent to specified receiver
4. **ERC-2981 Compliance**: Standard royalty interface

### Royalty Configuration
- **Basis Points**: 100 BPS = 1%
- **Maximum**: 1000 BPS (10%)
- **Default**: 500 BPS (5%)
- **Receiver**: Can be different from token owner

## 🌐 IPFS Integration

### Pinata Service
- **File Upload**: Images stored on IPFS
- **Metadata Upload**: JSON metadata stored on IPFS
- **Permanent Storage**: Content pinned for reliability
- **Gateway Access**: Multiple IPFS gateways supported

### Metadata Format
```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "ipfs://QmHash...",
  "attributes": [
    { "trait_type": "Type", "value": "Certificate" }
  ],
  "external_url": "https://educhain.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

### Test Services
```bash
# Test all services
curl -X GET http://localhost:5000/api/nft/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Minting
```bash
# Upload image
curl -X POST http://localhost:5000/api/nft/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.png"

# Mint NFT
curl -X POST http://localhost:5000/api/nft/mint \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "0x...",
    "name": "Test NFT",
    "description": "Test description"
  }'
```

## 🔧 Configuration

### Environment Variables
- `ETHEREUM_NETWORK_URL`: Blockchain RPC URL
- `PRIVATE_KEY`: Wallet private key for transactions
- `NFT_CONTRACT_ADDRESS`: Deployed contract address
- `PINATA_API_KEY`: Pinata API credentials
- `JWT_SECRET`: Authentication secret

### Smart Contract Parameters
- **Name**: "EduChain Certificates"
- **Symbol**: "EDUCHAIN"
- **Default Royalty**: 5% (500 basis points)
- **Max Royalty**: 10% (1000 basis points)

## 📈 Monitoring

### Transaction Tracking
- **Gas Usage**: Monitored and logged
- **Transaction Hashes**: Stored for verification
- **IPFS Hashes**: Metadata verification
- **Error Logging**: Comprehensive error tracking

### Admin Functions
- **Royalty Management**: Change default royalties
- **Fund Withdrawal**: Withdraw contract earnings
- **Service Health**: Monitor IPFS and blockchain connections

## 🚨 Troubleshooting

### Common Issues
1. **IPFS Upload Fails**: Check Pinata credentials
2. **Minting Fails**: Verify contract address and private key
3. **Image Upload Fails**: Check file size and format
4. **Royalty Issues**: Verify address format and percentage

### Debug Commands
```bash
# Test IPFS connection
curl -X GET http://localhost:5000/api/nft/test

# Check contract deployment
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# View contract on Etherscan
# https://sepolia.etherscan.io/address/CONTRACT_ADDRESS
```

## 🔄 Future Enhancements

- **Batch Minting**: Mint multiple NFTs at once
- **Auction System**: Built-in marketplace functionality
- **Metadata Templates**: Pre-defined certificate templates
- **Analytics Dashboard**: Minting statistics and analytics
- **Multi-chain Support**: Deploy on multiple blockchains

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

