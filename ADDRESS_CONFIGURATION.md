# 🔧 Address Configuration Guide

This document explains how Ethereum addresses are managed in the EduChain project after the refactoring to centralize all hardcoded addresses.

## 📁 Centralized Configuration

All Ethereum addresses are now centralized in `client/src/config/addresses.js`:

```javascript
// Main NFT Contract Address
export const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Default royalty receiver address
export const DEFAULT_ROYALTY_RECEIVER = process.env.REACT_APP_DEFAULT_ROYALTY_RECEIVER || "0x0000000000000000000000000000000000000000";
```

## 🔄 Changes Made

### ✅ Removed Hardcoded Addresses

1. **Old Hardhat Address Removed**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
   - Removed from `client/src/eduChainConfig.js`
   - Updated documentation references

2. **Centralized Configuration**:
   - Created `client/src/config/addresses.js`
   - Added validation functions
   - Environment variable support

3. **Updated Files**:
   - `client/src/eduChainConfig.js` - Now imports from centralized config
   - `backend/config/contract.js` - Uses environment variables
   - `TECHNICAL_DOCUMENTATION.md` - Updated references
   - `NFT_MINTING_README.md` - Updated example addresses

## 🌐 Environment Variables

### Frontend (.env.local)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
REACT_APP_DEFAULT_ROYALTY_RECEIVER=0xYourRoyaltyReceiverAddress
REACT_APP_CHAIN_ID=31337
REACT_APP_NETWORK_NAME=localhost
REACT_APP_RPC_URL=http://localhost:8545
```

### Backend (.env)
```bash
NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
DEFAULT_ROYALTY_RECEIVER=0xYourRoyaltyReceiverAddress
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/your_project_id
CHAIN_ID=11155111
```

## 🚀 Usage

### In Frontend Components
```javascript
import { getContractAddress, NETWORK_CONFIG } from './config/addresses.js';

// Get validated contract address
const contractAddress = getContractAddress();

// Get network configuration
const chainId = NETWORK_CONFIG.CHAIN_ID;
```

### In Backend Services
```javascript
// Contract address from environment
const contractAddress = process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
```

## 🔍 Validation Functions

The centralized config includes validation functions:

```javascript
// Check if address is valid Ethereum format
isValidAddress("0x742d35Cc6634C0532925a3b8D0C0C1C0C1C0C1C0"); // true

// Check if address is not zero address
isNotZeroAddress("0x0000000000000000000000000000000000000000"); // false

// Get contract address with validation
const address = getContractAddress(); // Returns null if invalid
```

## 🧹 Cleanup Scripts

Use the provided cleanup scripts to remove old build artifacts:

### Windows (PowerShell)
```bash
npm run cleanup
# or
.\cleanup-local.ps1
```

### Unix/Linux/macOS
```bash
npm run cleanup:unix
# or
./cleanup-local.sh
```

## ⚠️ Important Notes

1. **No Hardcoded Addresses**: All addresses should now come from environment variables or the centralized config
2. **Zero Address Fallback**: Default to `0x0000000000000000000000000000000000000000` if not set
3. **Validation**: Always validate addresses before use
4. **Environment Files**: Create `.env` files with your actual deployed contract addresses

## 🔧 Migration Steps

1. **Deploy your contract** and get the actual address
2. **Update environment variables** with real addresses
3. **Remove any remaining hardcoded addresses** in your code
4. **Test the application** to ensure addresses are loaded correctly

## 📝 Example Addresses

### Development (Localhost)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_CHAIN_ID=31337
```

### Production (Sepolia Testnet)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0xYourActualDeployedAddress
REACT_APP_CHAIN_ID=11155111
```

This refactoring ensures that your project is more maintainable, secure, and ready for different deployment environments! 🎉

This document explains how Ethereum addresses are managed in the EduChain project after the refactoring to centralize all hardcoded addresses.

## 📁 Centralized Configuration

All Ethereum addresses are now centralized in `client/src/config/addresses.js`:

```javascript
// Main NFT Contract Address
export const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Default royalty receiver address
export const DEFAULT_ROYALTY_RECEIVER = process.env.REACT_APP_DEFAULT_ROYALTY_RECEIVER || "0x0000000000000000000000000000000000000000";
```

## 🔄 Changes Made

### ✅ Removed Hardcoded Addresses

1. **Old Hardhat Address Removed**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
   - Removed from `client/src/eduChainConfig.js`
   - Updated documentation references

2. **Centralized Configuration**:
   - Created `client/src/config/addresses.js`
   - Added validation functions
   - Environment variable support

3. **Updated Files**:
   - `client/src/eduChainConfig.js` - Now imports from centralized config
   - `backend/config/contract.js` - Uses environment variables
   - `TECHNICAL_DOCUMENTATION.md` - Updated references
   - `NFT_MINTING_README.md` - Updated example addresses

## 🌐 Environment Variables

### Frontend (.env.local)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
REACT_APP_DEFAULT_ROYALTY_RECEIVER=0xYourRoyaltyReceiverAddress
REACT_APP_CHAIN_ID=31337
REACT_APP_NETWORK_NAME=localhost
REACT_APP_RPC_URL=http://localhost:8545
```

### Backend (.env)
```bash
NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
DEFAULT_ROYALTY_RECEIVER=0xYourRoyaltyReceiverAddress
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/your_project_id
CHAIN_ID=11155111
```

## 🚀 Usage

### In Frontend Components
```javascript
import { getContractAddress, NETWORK_CONFIG } from './config/addresses.js';

// Get validated contract address
const contractAddress = getContractAddress();

// Get network configuration
const chainId = NETWORK_CONFIG.CHAIN_ID;
```

### In Backend Services
```javascript
// Contract address from environment
const contractAddress = process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
```

## 🔍 Validation Functions

The centralized config includes validation functions:

```javascript
// Check if address is valid Ethereum format
isValidAddress("0x742d35Cc6634C0532925a3b8D0C0C1C0C1C0C1C0"); // true

// Check if address is not zero address
isNotZeroAddress("0x0000000000000000000000000000000000000000"); // false

// Get contract address with validation
const address = getContractAddress(); // Returns null if invalid
```

## 🧹 Cleanup Scripts

Use the provided cleanup scripts to remove old build artifacts:

### Windows (PowerShell)
```bash
npm run cleanup
# or
.\cleanup-local.ps1
```

### Unix/Linux/macOS
```bash
npm run cleanup:unix
# or
./cleanup-local.sh
```

## ⚠️ Important Notes

1. **No Hardcoded Addresses**: All addresses should now come from environment variables or the centralized config
2. **Zero Address Fallback**: Default to `0x0000000000000000000000000000000000000000` if not set
3. **Validation**: Always validate addresses before use
4. **Environment Files**: Create `.env` files with your actual deployed contract addresses

## 🔧 Migration Steps

1. **Deploy your contract** and get the actual address
2. **Update environment variables** with real addresses
3. **Remove any remaining hardcoded addresses** in your code
4. **Test the application** to ensure addresses are loaded correctly

## 📝 Example Addresses

### Development (Localhost)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_CHAIN_ID=31337
```

### Production (Sepolia Testnet)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0xYourActualDeployedAddress
REACT_APP_CHAIN_ID=11155111
```

This refactoring ensures that your project is more maintainable, secure, and ready for different deployment environments! 🎉

This document explains how Ethereum addresses are managed in the EduChain project after the refactoring to centralize all hardcoded addresses.

## 📁 Centralized Configuration

All Ethereum addresses are now centralized in `client/src/config/addresses.js`:

```javascript
// Main NFT Contract Address
export const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Default royalty receiver address
export const DEFAULT_ROYALTY_RECEIVER = process.env.REACT_APP_DEFAULT_ROYALTY_RECEIVER || "0x0000000000000000000000000000000000000000";
```

## 🔄 Changes Made

### ✅ Removed Hardcoded Addresses

1. **Old Hardhat Address Removed**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
   - Removed from `client/src/eduChainConfig.js`
   - Updated documentation references

2. **Centralized Configuration**:
   - Created `client/src/config/addresses.js`
   - Added validation functions
   - Environment variable support

3. **Updated Files**:
   - `client/src/eduChainConfig.js` - Now imports from centralized config
   - `backend/config/contract.js` - Uses environment variables
   - `TECHNICAL_DOCUMENTATION.md` - Updated references
   - `NFT_MINTING_README.md` - Updated example addresses

## 🌐 Environment Variables

### Frontend (.env.local)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
REACT_APP_DEFAULT_ROYALTY_RECEIVER=0xYourRoyaltyReceiverAddress
REACT_APP_CHAIN_ID=31337
REACT_APP_NETWORK_NAME=localhost
REACT_APP_RPC_URL=http://localhost:8545
```

### Backend (.env)
```bash
NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
DEFAULT_ROYALTY_RECEIVER=0xYourRoyaltyReceiverAddress
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/your_project_id
CHAIN_ID=11155111
```

## 🚀 Usage

### In Frontend Components
```javascript
import { getContractAddress, NETWORK_CONFIG } from './config/addresses.js';

// Get validated contract address
const contractAddress = getContractAddress();

// Get network configuration
const chainId = NETWORK_CONFIG.CHAIN_ID;
```

### In Backend Services
```javascript
// Contract address from environment
const contractAddress = process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
```

## 🔍 Validation Functions

The centralized config includes validation functions:

```javascript
// Check if address is valid Ethereum format
isValidAddress("0x742d35Cc6634C0532925a3b8D0C0C1C0C1C0C1C0"); // true

// Check if address is not zero address
isNotZeroAddress("0x0000000000000000000000000000000000000000"); // false

// Get contract address with validation
const address = getContractAddress(); // Returns null if invalid
```

## 🧹 Cleanup Scripts

Use the provided cleanup scripts to remove old build artifacts:

### Windows (PowerShell)
```bash
npm run cleanup
# or
.\cleanup-local.ps1
```

### Unix/Linux/macOS
```bash
npm run cleanup:unix
# or
./cleanup-local.sh
```

## ⚠️ Important Notes

1. **No Hardcoded Addresses**: All addresses should now come from environment variables or the centralized config
2. **Zero Address Fallback**: Default to `0x0000000000000000000000000000000000000000` if not set
3. **Validation**: Always validate addresses before use
4. **Environment Files**: Create `.env` files with your actual deployed contract addresses

## 🔧 Migration Steps

1. **Deploy your contract** and get the actual address
2. **Update environment variables** with real addresses
3. **Remove any remaining hardcoded addresses** in your code
4. **Test the application** to ensure addresses are loaded correctly

## 📝 Example Addresses

### Development (Localhost)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_CHAIN_ID=31337
```

### Production (Sepolia Testnet)
```bash
REACT_APP_NFT_CONTRACT_ADDRESS=0xYourActualDeployedAddress
REACT_APP_CHAIN_ID=11155111
```

This refactoring ensures that your project is more maintainable, secure, and ready for different deployment environments! 🎉
