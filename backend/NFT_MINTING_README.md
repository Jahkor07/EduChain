# 🎓 EduChain NFT Minting System

## Overview
This system provides a complete NFT minting solution for EduChain, including file upload to IPFS, smart contract interaction, and MongoDB storage.

## 🚀 Features

### ✅ **Complete NFT Minting Pipeline**
- **File Upload**: Supports image files (PNG, JPG, GIF, SVG)
- **IPFS Storage**: Automatic upload to Pinata IPFS
- **Metadata Creation**: Standard NFT metadata with attributes
- **Smart Contract Integration**: Calls `mintNFT` function
- **Database Storage**: MongoDB storage with full NFT records
- **Transaction Tracking**: Complete transaction history

### 📋 **API Endpoints**

#### **POST `/api/nft/mint`**
Mint a new NFT with file upload and metadata creation.

**Request:**
```javascript
// FormData with file and JSON fields
{
  file: <image_file>,
  name: "Course Completion Certificate",
  description: "Certificate for completing Blockchain Fundamentals",
  recipient: "0x1234...",
  courseId: "CS101",
  studentId: "STU001",
  certificateType: "course_completion",
  attributes: [
    { trait_type: "Course", value: "Blockchain Fundamentals" },
    { trait_type: "Grade", value: "A+" }
  ]
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "NFT metadata prepared successfully",
  "data": {
    "tokenId": 1,
    "tokenURI": "https://gateway.pinata.cloud/ipfs/Qm...",
    "imageUrl": "https://gateway.pinata.cloud/ipfs/Qm...",
    "metadata": { /* NFT metadata */ },
    "transaction": {
      "to": "0x...",
      "data": "0x...",
      "gasLimit": "500000",
      "gasPrice": "20000000000",
      "value": "0x0"
    },
    "recipient": "0x...",
    "courseId": "CS101",
    "studentId": "STU001",
    "certificateType": "course_completion"
  }
}
```

#### **POST `/api/nft/complete`**
Complete NFT minting after transaction is signed.

**Request:**
```javascript
{
  "tokenId": 1,
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "recipient": "0x...",
  "courseId": "CS101",
  "studentId": "STU001",
  "certificateType": "course_completion",
  "metadata": { /* NFT metadata */ }
}
```

#### **GET `/api/nft/:tokenId`**
Get NFT by token ID.

#### **GET `/api/nft/user/:address`**
Get all NFTs for a specific wallet address.

#### **GET `/api/nft`**
Get all NFTs in the system.

#### **GET `/api/nft/test/pinata`**
Test Pinata IPFS connection.

## 🔧 Setup Instructions

### 1. **Install Dependencies**
```bash
npm install ethers@6.11.1 axios@1.6.7 form-data@4.0.0
```

### 2. **Environment Variables**
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/educhain

# Smart Contract Configuration
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NETWORK_NAME=sepolia
CHAIN_ID=11155111
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Pinata IPFS Configuration
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
```

### 3. **Pinata Setup**
1. Go to [Pinata](https://pinata.cloud/)
2. Create an account and get your API keys
3. Add the API keys to your `.env` file

### 4. **Smart Contract Setup**
1. Deploy your NFT contract to your chosen network
2. Update `CONTRACT_ADDRESS` in `.env`
3. Ensure the contract has a `mintNFT(address to, string tokenURI)` function

### 5. **MongoDB Setup**
1. Install and start MongoDB
2. Update `MONGODB_URI` in `.env`
3. The NFT model will be created automatically

## 📁 File Structure

```
backend/
├── models/
│   └── NFT.js                 # MongoDB NFT schema
├── config/
│   └── contract.js            # Smart contract configuration
├── services/
│   └── pinataService.js       # IPFS upload service
├── controllers/
│   └── nftController.js       # NFT business logic
├── routes/
│   └── nft.js                 # NFT API routes
└── index.js                   # Main server file
```

## 🔄 Usage Flow

### **Frontend Integration**

1. **Upload File & Prepare NFT:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('name', 'Course Certificate');
formData.append('description', 'Certificate for completing course');
formData.append('recipient', walletAddress);

const response = await fetch('/api/nft/mint', {
  method: 'POST',
  body: formData
});

const { data } = await response.json();
```

2. **Sign Transaction:**
```javascript
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const tx = await signer.sendTransaction(data.transaction);
const receipt = await tx.wait();
```

3. **Complete Minting:**
```javascript
await fetch('/api/nft/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenId: data.tokenId,
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    recipient: walletAddress,
    metadata: data.metadata
  })
});
```

## 🛡️ Security Features

- **File Validation**: Only image files allowed
- **File Size Limits**: 10MB maximum
- **Address Validation**: Ethereum address format checking
- **Gas Estimation**: Automatic gas calculation
- **Error Handling**: Comprehensive error responses

## 🧪 Testing

### **Test Pinata Connection:**
```bash
curl http://localhost:5000/api/nft/test/pinata
```

### **Test NFT Creation (without minting):**
```bash
curl -X POST http://localhost:5000/api/nft/mint \
  -F "file=@test-image.png" \
  -F "name=Test NFT" \
  -F "description=Test description" \
  -F "recipient=0x1234567890123456789012345678901234567890"
```

## 🚨 Error Handling

The system handles various error scenarios:
- **File Upload Errors**: Invalid file types, size limits
- **IPFS Upload Errors**: Network issues, API key problems
- **Smart Contract Errors**: Gas estimation, transaction failures
- **Database Errors**: Connection issues, validation errors

## 🔮 Future Enhancements

- **Batch Minting**: Mint multiple NFTs at once
- **Metadata Templates**: Pre-defined certificate templates
- **Gas Optimization**: Dynamic gas price adjustment
- **Event Listening**: Real-time transaction monitoring
- **NFT Marketplace**: Integration with marketplace features

## 📞 Support

For issues or questions about the NFT minting system, check the logs in the backend console or contact the development team.


















