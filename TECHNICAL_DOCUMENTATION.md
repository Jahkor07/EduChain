# 🔧 EduChain Technical Documentation

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [API Specifications](#api-specifications)
4. [Smart Contract Details](#smart-contract-details)
5. [Security Implementation](#security-implementation)
6. [Deployment Guide](#deployment-guide)
7. [Performance Considerations](#performance-considerations)
8. [Error Handling](#error-handling)

## 🏗️ System Architecture

### High-Level Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Ethereum)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MetaMask      │    │     IPFS        │    │   Smart        │
│   (Wallet)      │    │   (Pinata)      │    │  Contracts     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18.x
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Blockchain Integration**: Ethers.js v6
- **Styling**: CSS3 with custom components

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Joi (recommended)

#### Blockchain
- **Network**: Ethereum (Local Hardhat, Sepolia Testnet)
- **Smart Contracts**: Solidity 0.8.x
- **Development**: Hardhat
- **Standards**: ERC-721, EIP-2981

#### Storage
- **Database**: MongoDB
- **File Storage**: IPFS via Pinata
- **Metadata**: IPFS JSON files

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['educator', 'student']),
  firstName: String,
  lastName: String,
  profileImage: String,
  walletAddress: String,
  createdAt: Date,
  updatedAt: Date,
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Course Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  price: Number (required, in ZMW),
  educatorId: ObjectId (ref: 'User'),
  category: String,
  level: String (enum: ['beginner', 'intermediate', 'advanced']),
  duration: Number, // in hours
  maxStudents: Number,
  enrolledStudents: [ObjectId], // ref: 'User'
  status: String (enum: ['active', 'inactive', 'completed']),
  createdAt: Date,
  updatedAt: Date,
  imageUrl: String,
  syllabus: [String],
  requirements: [String]
}
```

### Certificate Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User'),
  courseId: ObjectId (ref: 'Course'),
  educatorId: ObjectId (ref: 'User'),
  title: String (required),
  description: String,
  grade: String,
  studentEmail: String (required),
  courseTitle: String,
  expiresAt: Date,
  status: String (enum: ['pending', 'minted', 'failed']),
  imageLink: String, // IPFS hash
  metadataLink: String, // IPFS hash
  tokenId: String, // Blockchain token ID
  transactionHash: String,
  contractAddress: String,
  plagiarismResult: {
    riskLevel: String,
    score: Number,
    details: Object,
    recommendations: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User'),
  courseId: ObjectId (ref: 'Course'),
  enrolledAt: Date,
  completedAt: Date,
  status: String (enum: ['enrolled', 'in-progress', 'completed']),
  progress: Number, // 0-100
  grade: String,
  certificateId: ObjectId (ref: 'Certificate')
}
```

## 🌐 API Specifications

### Authentication Endpoints

#### POST /api/auth/signup
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/login
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "role": "educator"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/forgot-password
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset code sent to email"
}
```

### Course Endpoints

#### POST /api/courses
**Request Body:**
```json
{
  "title": "Advanced Blockchain Development",
  "description": "Learn advanced Solidity and smart contract development",
  "price": 1500,
  "category": "Technology",
  "level": "advanced",
  "duration": 40,
  "maxStudents": 50
}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET /api/courses
**Query Parameters:**
- `category`: Filter by category
- `level`: Filter by difficulty level
- `priceMin`: Minimum price
- `priceMax`: Maximum price
- `page`: Page number for pagination
- `limit`: Items per page

### Certificate Endpoints

#### POST /api/certificates/mint
**Request Body (FormData):**
```
studentEmail: "student@example.com"
courseId: "course_id_here"
grade: "A+"
expiresAt: "2025-12-31"
description: "Certificate for completing the course"
certificateFile: <file>
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate created and NFT minted successfully",
  "data": {
    "certificate": {
      "_id": "certificate_id",
      "status": "minted",
      "tokenId": "12345",
      "transactionHash": "0x...",
      "imageLink": "ipfs_hash_here"
    }
  }
}
```

#### POST /api/certificates/check-originality
**Request Body:**
```json
{
  "content": "Certificate content text here...",
  "fileType": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "riskLevel": "low",
    "score": 85,
    "details": {
      "vocabularyDiversity": 0.78,
      "sentenceVariety": 0.82,
      "repetitionScore": 0.15
    },
    "recommendations": [
      "Consider using more varied vocabulary",
      "Good sentence structure variety"
    ]
  }
}
```

## 📜 Smart Contract Details

### EduChainNFT Contract

#### Contract Address
```solidity
// Deployed on local Hardhat network
// Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

#### Key State Variables
```solidity
contract EduChainNFT is ERC721, ERC2981 {
    uint256 public defaultRoyaltyFee = 10; // 10%
    mapping(uint256 => address) public contentCreator;
    mapping(uint256 => string) public contentType;
    address public owner;
}
```

#### Core Functions

##### mintCourseNFT
```solidity
function mintCourseNFT(
    address recipient,
    string memory tokenURI,
    address creator
) external onlyOwner returns (uint256 tokenId)
```

**Parameters:**
- `recipient`: Address receiving the NFT
- `tokenURI`: IPFS URI for metadata
- `creator`: Educator's wallet address

**Returns:**
- `tokenId`: Unique identifier for the minted NFT

##### mintCertificateNFT
```solidity
function mintCertificateNFT(
    address recipient,
    string memory tokenURI,
    address creator
) external onlyOwner returns (uint256 tokenId)
```

**Parameters:**
- `recipient`: Student's wallet address
- `tokenURI`: IPFS URI for certificate metadata
- `creator`: Educator's wallet address

##### getRoyaltyInfo
```solidity
function getRoyaltyInfo(
    uint256 tokenId,
    uint256 salePrice
) external view returns (address receiver, uint256 royaltyAmount)
```

**Parameters:**
- `tokenId`: NFT identifier
- `salePrice`: Sale price in wei

**Returns:**
- `receiver`: Address receiving royalties
- `royaltyAmount`: Calculated royalty amount

#### Events
```solidity
event ContentMinted(
    uint256 indexed tokenId,
    address indexed creator,
    string contentType,
    string tokenURI
);

event RoyaltyUpdated(
    uint256 indexed tokenId,
    uint256 oldFee,
    uint256 newFee
);
```

## 🔒 Security Implementation

### Authentication & Authorization

#### JWT Implementation
```javascript
// Token generation
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### Role-Based Access Control
```javascript
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions' 
      });
    }
    next();
  };
};

// Usage in routes
router.post('/courses', 
  verifyToken, 
  requireRole(['educator']), 
  createCourse
);
```

### Password Security
```javascript
// Password hashing
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Password verification
const isValidPassword = await bcrypt.compare(password, hashedPassword);
```

### Input Validation
```javascript
// Course validation schema
const courseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('Technology', 'Business', 'Arts', 'Science'),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  duration: Joi.number().positive(),
  maxStudents: Joi.number().positive().max(1000)
});
```

### File Upload Security
```javascript
// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});
```

## 🚀 Deployment Guide

### Environment Setup

#### Production Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/educhain

# Security
JWT_SECRET=very_long_random_secret_key_here
NODE_ENV=production

# Email Service
EMAIL_USER=your_production_email@domain.com
EMAIL_PASS=your_app_specific_password

# IPFS
PINATA_API_KEY=your_pinata_production_key
PINATA_SECRET_API_KEY=your_pinata_production_secret

# Blockchain (Production Network)
ETHEREUM_NETWORK_URL=https://mainnet.infura.io/v3/your_project_id
NFT_CONTRACT_ADDRESS=your_deployed_mainnet_contract_address
PRIVATE_KEY=your_production_wallet_private_key

# Plagiarism Detection
COPYLEAKS_API_KEY=your_copyleaks_production_key
COPYLEAKS_BUSINESS_ID=your_copyleaks_business_id
```

#### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/educhain
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Deployment Steps

#### 1. Smart Contract Deployment
```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

#### 2. Backend Deployment
```bash
# Build and deploy
cd backend
npm run build
npm start
```

#### 3. Frontend Deployment
```bash
# Build for production
cd client
npm run build

# Deploy to hosting service (Netlify, Vercel, etc.)
```

#### 4. Database Migration
```bash
# Create indexes
mongo educhain --eval "
db.users.createIndex({email: 1}, {unique: true});
db.courses.createIndex({educatorId: 1});
db.certificates.createIndex({studentId: 1});
db.certificates.createIndex({status: 1});
"
```

## ⚡ Performance Considerations

### Database Optimization
```javascript
// Indexes for common queries
db.users.createIndex({ email: 1 });
db.courses.createIndex({ educatorId: 1, status: 1 });
db.certificates.createIndex({ studentId: 1, status: 1 });
db.certificates.createIndex({ courseId: 1 });

// Pagination for large datasets
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const courses = await Course.find()
  .skip(skip)
  .limit(limit)
  .populate('educatorId', 'firstName lastName');
```

### Caching Strategy
```javascript
// Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

const getCachedData = async (key) => {
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
};

const setCachedData = async (key, data, ttl = 3600) => {
  await client.setex(key, ttl, JSON.stringify(data));
};
```

### File Upload Optimization
```javascript
// Stream processing for large files
const processFileStream = (req, res) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    // Process buffer
  });
};
```

## 🚨 Error Handling

### Global Error Handler
```javascript
// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};
```

### API Error Responses
```javascript
// Standard error response format
const createErrorResponse = (statusCode, message, details = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  return response;
};

// Usage
res.status(400).json(createErrorResponse(400, 'Invalid input', validationErrors));
```

### Blockchain Error Handling
```javascript
// Smart contract interaction error handling
const handleBlockchainError = (error) => {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    throw new Error('Insufficient funds for transaction');
  }
  
  if (error.code === 'USER_REJECTED') {
    throw new Error('Transaction rejected by user');
  }
  
  if (error.code === 'NETWORK_ERROR') {
    throw new Error('Network connection failed');
  }
  
  throw new Error(`Blockchain error: ${error.message}`);
};
```

## 📊 Monitoring & Logging

### Logging Configuration
```javascript
// Winston logger setup
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Health Checks
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    // Check IPFS connection
    const ipfsStatus = await checkIPFSConnection();
    
    // Check blockchain connection
    const blockchainStatus = await checkBlockchainConnection();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        ipfs: ipfsStatus ? 'connected' : 'disconnected',
        blockchain: blockchainStatus ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});
```

---

*This technical documentation provides comprehensive details for developers, system administrators, and technical stakeholders involved in the EduChain project.*

