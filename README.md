# 🎓 EduChain - Blockchain-Based Education Platform

A comprehensive blockchain-powered education platform that enables educators to create courses, mint certificates as NFTs, and provides students with verifiable digital credentials. Built with React, Node.js, Solidity, and IPFS.

## ✨ Features

### 🎯 Core Functionality
- **Course Management**: Create, edit, and manage educational courses
- **NFT Certificate Minting**: Mint verifiable certificates as ERC-721 NFTs
- **IPFS Integration**: Decentralized file storage for certificates and metadata
- **Blockchain Verification**: Ethereum-based certificate verification
- **Role-Based Access**: Separate dashboards for educators and students
- **Plagiarism Detection**: Built-in content originality checking with optional API integration

### 🔐 Security & Authentication
- **JWT Authentication**: Secure user authentication and authorization
- **Role-Based Access Control**: Educator and student role management
- **Password Reset System**: Email-based password recovery with verification codes
- **Protected Routes**: Secure access to dashboard and features

### 💰 Payment & Economics
- **Zambian Kwacha (ZMW)**: Local currency support for course pricing
- **Smart Contract Royalties**: EIP-2981 compliant NFT royalties for educators
- **Automated Royalty Distribution**: 10% default royalty fee system

### 📱 User Experience
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Live status updates for minting processes
- **Error Handling**: Comprehensive error messages and user feedback
- **Dark/Light Theme**: Customizable user interface themes

## 🏗️ Architecture

### Frontend (React)
```
client/src/
├── components/          # React components
│   ├── EducatorDashboard.js    # Educator course & certificate management
│   ├── StudentDashboard.js     # Student course enrollment & certificates
│   ├── NFTMintingModal.js      # Certificate NFT minting interface
│   ├── PlagiarismTest.js       # Content originality checking
│   └── ...                     # Other UI components
├── contexts/            # React Context for state management
├── services/            # API service layer
└── utils/               # Utility functions
```

### Backend (Node.js + Express)
```
backend/
├── controllers/         # Business logic controllers
├── models/             # Mongoose data models
├── routes/             # API route definitions
├── services/           # Core business services
│   ├── blockchainService.js    # Ethereum blockchain interaction
│   ├── ipfsService.js          # IPFS file storage
│   ├── plagiarismService.js    # Content originality detection
│   └── emailService.js         # Email notifications
└── middleware/         # Express middleware
```

### Smart Contracts (Solidity)
```
contracts/
├── EduChainNFT.sol     # ERC-721 NFT contract with royalties
└── Lock.sol            # Hardhat template contract
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- MetaMask browser extension
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd EduChain
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install

# Install blockchain dependencies
cd ..
npm install
```

### 3. Environment Configuration

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/educhain

# Authentication
JWT_SECRET=your_jwt_secret_here

# Email Service (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# IPFS (Pinata)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret

# Plagiarism Detection (Optional)
COPYLEAKS_API_KEY=your_copyleaks_api_key
COPYLEAKS_BUSINESS_ID=your_copyleaks_business_id

# Blockchain
ETHEREUM_NETWORK_URL=http://127.0.0.1:8545
NFT_CONTRACT_ADDRESS=your_deployed_contract_address
PRIVATE_KEY=your_test_wallet_private_key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BLOCKCHAIN_NETWORK=localhost
```

### 4. Start Local Blockchain
```bash
# Start Hardhat local network
npx hardhat node
```

### 5. Deploy Smart Contract
```bash
# Deploy NFT contract to local network
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Start Backend Server
```bash
cd backend
npm start
```

### 7. Start Frontend Application
```bash
cd client
npm start
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create database: `educhain`
3. Update `MONGODB_URI` in backend `.env`

### IPFS Configuration (Pinata)
1. Sign up at [Pinata](https://pinata.cloud/)
2. Generate API keys
3. Add keys to backend `.env`

### Blockchain Network
- **Development**: Local Hardhat network (http://127.0.0.1:8545)
- **Testnet**: Sepolia testnet (requires Infura/Alchemy key)
- **Mainnet**: Ethereum mainnet (requires real ETH)

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup          # User registration
POST /api/auth/login           # User login
POST /api/auth/forgot-password # Password reset request
POST /api/auth/reset-password  # Password reset with code
```

### Course Endpoints
```
GET    /api/courses            # Get all courses
POST   /api/courses            # Create new course
PUT    /api/courses/:id        # Update course
DELETE /api/courses/:id        # Delete course
POST   /api/courses/:id/enroll # Enroll student in course
GET    /api/courses/enrolled   # Get enrolled courses
POST   /api/courses/:id/complete # Mark course as completed
```

### Certificate Endpoints
```
POST   /api/certificates/mint              # Mint certificate NFT
GET    /api/certificates                   # Get all certificates
GET    /api/certificates/:id               # Get specific certificate
POST   /api/certificates/:id/retry-mint    # Retry failed minting
GET    /api/certificates/status/:status    # Get certificates by status
POST   /api/certificates/check-originality # Check content originality
```

### User Endpoints
```
GET    /api/users/profile      # Get user profile
PUT    /api/users/profile      # Update user profile
GET    /api/users/courses      # Get user's courses
```

## 🎨 Smart Contract Features

### EduChainNFT Contract
- **ERC-721 Compliance**: Standard NFT functionality
- **EIP-2981 Royalties**: Automatic royalty distribution
- **Content Creator Tracking**: Educator ownership verification
- **Flexible Minting**: Support for both course and certificate NFTs
- **Royalty Management**: Configurable royalty percentages

### Key Functions
```solidity
function mintCourseNFT(address recipient, string memory tokenURI, address creator)
function mintCertificateNFT(address recipient, string memory tokenURI, address creator)
function getRoyaltyInfo(uint256 tokenId, uint256 salePrice)
function isContentCreator(uint256 tokenId, address creator)
```

## 🔍 Plagiarism Detection

### Built-in Analysis
- **Vocabulary Diversity**: Analyzes word variety and complexity
- **Sentence Structure**: Examines sentence length and variety
- **Repetition Detection**: Identifies excessive word/phrase repetition
- **Common Phrase Analysis**: Detects overused expressions

### External API Integration
- **Copyleaks API**: Professional plagiarism detection (20 pages/month free)
- **Fallback System**: Automatic fallback to built-in analysis
- **Risk Assessment**: Multi-level risk categorization
- **Recommendations**: Actionable improvement suggestions

## 💡 Usage Examples

### Creating a Course
1. Login as educator
2. Navigate to Educator Dashboard
3. Click "Add New Course"
4. Fill in course details (title, description, price in ZMW)
5. Save course

### Minting a Certificate
1. Select student and course
2. Upload certificate file (PDF, image, or document)
3. Fill in certificate details (grade, expiry, description)
4. Click "Check Originality" for plagiarism detection
5. Review results and proceed with minting
6. Confirm MetaMask transaction
7. Certificate NFT created on blockchain

### Verifying a Certificate
1. Use certificate ID or blockchain address
2. View on blockchain explorer
3. Verify IPFS metadata
4. Check educator signature

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Smart Contract Testing
```bash
npx hardhat test
```

### Frontend Testing
```bash
cd client
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Course creation and management
- [ ] Certificate NFT minting
- [ ] Plagiarism detection
- [ ] Blockchain transaction verification
- [ ] IPFS file upload and retrieval
- [ ] Email notifications
- [ ] Role-based access control

## 🚨 Troubleshooting

### Common Issues

#### "Failed to upload file to IPFS"
- Check Pinata API keys in `.env`
- Verify internet connection
- Check file size limits

#### "Blockchain service not initialized"
- Ensure `.env` has `PRIVATE_KEY`
- Check `ETHEREUM_NETWORK_URL`
- Verify Hardhat node is running

#### "Certificate validation failed"
- Check required fields in form
- Verify file upload success
- Check MongoDB connection

#### "MetaMask connection failed"
- Ensure MetaMask is installed
- Check network configuration
- Verify account permissions

### Debug Mode
Enable detailed logging in backend:
```env
DEBUG=true
LOG_LEVEL=debug
```

## 🔮 Future Enhancements

### Planned Features
- **Multi-chain Support**: Polygon, BSC, Solana integration
- **Advanced Analytics**: Learning progress tracking
- **Social Features**: Student collaboration tools
- **Mobile App**: React Native mobile application
- **AI Integration**: Personalized learning recommendations
- **DeFi Integration**: Token-based rewards system

### Technical Improvements
- **Layer 2 Scaling**: Optimistic rollups for gas optimization
- **Zero-Knowledge Proofs**: Privacy-preserving verification
- **Decentralized Identity**: Self-sovereign identity integration
- **Cross-chain Bridges**: Interoperability between blockchains

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@educhain.com

## 🙏 Acknowledgments

- **Hardhat**: Ethereum development environment
- **Pinata**: IPFS pinning service
- **Ethers.js**: Ethereum library
- **React**: Frontend framework
- **Node.js**: Backend runtime
- **MongoDB**: Database solution

---

**Built with ❤️ for the future of education on the blockchain**

*Last updated: December 2024*
