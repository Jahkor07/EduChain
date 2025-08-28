# 🚀 EduChain Deployment Guide

## 📋 Prerequisites
- Node.js 18+ installed
- MongoDB running locally or Atlas account
- Git installed
- MetaMask browser extension
- Hardhat development environment

## 🔧 Local Development Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd EduChain
npm install
cd backend && npm install
cd ../client && npm install
cd ..
```

### 2. Environment Configuration
Create `.env` files in both `backend/` and `client/` directories:

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/educhain
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
COPYLEAKS_API_KEY=your_copyleaks_key
COPYLEAKS_BUSINESS_ID=your_business_id
ETHEREUM_NETWORK_URL=http://127.0.0.1:8545
NFT_CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_test_wallet_key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BLOCKCHAIN_NETWORK=localhost
```

### 3. Start Local Blockchain
```bash
npx hardhat node
```

### 4. Deploy Smart Contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Start Services
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd client
npm start
```

## 🌐 Production Deployment

### 1. Smart Contract Deployment
```bash
# Testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

### 2. Backend Deployment
```bash
cd backend
npm run build
npm start
```

### 3. Frontend Deployment
```bash
cd client
npm run build
# Deploy build folder to hosting service
```

## 📊 Testing Checklist
- [ ] User registration/login
- [ ] Course creation
- [ ] Certificate minting
- [ ] IPFS uploads
- [ ] Blockchain transactions
- [ ] Plagiarism detection
- [ ] Email notifications

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
```bash
# Start MongoDB service
net start MongoDB
```

### Hardhat Network Issues
```bash
# Clear Hardhat cache
npx hardhat clean
# Restart Hardhat node
npx hardhat node
```

## 🔒 Security Checklist
- [ ] Environment variables secured
- [ ] JWT secret is strong
- [ ] Database access restricted
- [ ] File upload limits set
- [ ] CORS configured properly
- [ ] Rate limiting implemented

## 📈 Performance Optimization
- [ ] Database indexes created
- [ ] File compression enabled
- [ ] Caching implemented
- [ ] CDN configured
- [ ] Load balancing setup

---

*For detailed technical documentation, see TECHNICAL_DOCUMENTATION.md*

