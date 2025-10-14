# 🚀 Hardhat Local Development Setup

This guide explains how to use the refactored Hardhat configuration for local development.

## 📋 Configuration Summary

The `hardhat.config.js` has been refactored with the following changes:

### ✅ **Changes Made**

1. **Solidity Version**: Set to `0.8.18` (as requested)
2. **Localhost Network**: Added `http://127.0.0.1:8545` with chainId `31337`
3. **Hardhat Network**: Uses chainId `31337` (consistent with localhost)
4. **Removed Unused Private Keys**: Cleaned up configuration
5. **Added Gas Reporting**: Optional gas usage tracking
6. **Path Configuration**: Explicit paths for better organization

### 🌐 **Network Configuration**

```javascript
networks: {
  // Local Hardhat network (default)
  hardhat: {
    chainId: 31337,
    // Hardhat will automatically create accounts for testing
  },
  // Localhost network for external clients
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
    // No accounts needed - will use the same accounts as hardhat
  },
  // Sepolia testnet (optional - only if needed)
  sepolia: {
    url: process.env.ETHEREUM_NETWORK_URL || "https://sepolia.infura.io/v3/your_project_id",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 11155111,
  }
}
```

## 🚀 **Quick Start**

### 1. Start Local Network
```bash
# Start Hardhat node (for external clients)
npm run hardhat:node

# Or directly with hardhat
npx hardhat node
```

### 2. Compile Contracts
```bash
npm run hardhat:compile

# Or directly
npx hardhat compile
```

### 3. Deploy Contracts
```bash
npm run hardhat:deploy

# Or directly
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Run Tests
```bash
npm run hardhat:test

# Or directly
npx hardhat test
```

## 🔧 **MetaMask Configuration**

To connect MetaMask to your local Hardhat network:

1. **Open MetaMask** and click the network dropdown
2. **Add Network** → **Add a network manually**
3. **Fill in the details**:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: (leave empty)

4. **Import Accounts**: Use the private keys from the Hardhat console output

## 💰 **Test Accounts**

When you start `npx hardhat node`, you'll see 20 test accounts with 10000 ETH each:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

## 🧪 **Testing Workflow**

### 1. Start the Network
```bash
# Terminal 1: Start Hardhat node
npm run hardhat:node
```

### 2. Deploy Contracts
```bash
# Terminal 2: Deploy contracts
npm run hardhat:deploy
```

### 3. Update Frontend
Update your frontend configuration with the deployed contract address:

```javascript
// In client/src/config/addresses.js
export const NFT_CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### 4. Test Frontend
```bash
# Terminal 3: Start frontend
cd client && npm start
```

## 🔍 **Troubleshooting**

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill process using port 8545
   npx kill-port 8545
   ```

2. **MetaMask Connection Issues**:
   - Ensure you're using the correct RPC URL: `http://127.0.0.1:8545`
   - Check Chain ID is `31337`
   - Reset MetaMask account if needed

3. **Contract Deployment Fails**:
   - Ensure Hardhat node is running
   - Check if you're using the correct network: `--network localhost`

### Debug Commands

```bash
# Check network status
npx hardhat console --network localhost

# Get account balance
await ethers.provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

# Get network info
await ethers.provider.getNetwork()
```

## 📝 **Environment Variables**

Create a `.env` file in the root directory (optional for local development):

```bash
# .env
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

## 🎯 **Best Practices**

1. **Always use localhost network** for development
2. **Keep test accounts separate** from main accounts
3. **Use gas reporting** to optimize contract gas usage
4. **Clean up artifacts** regularly with `npm run cleanup`
5. **Test thoroughly** before deploying to testnet

## 🚀 **Next Steps**

1. **Start the local network**: `npm run hardhat:node`
2. **Deploy your contracts**: `npm run hardhat:deploy`
3. **Update frontend config** with the deployed address
4. **Test your application** with MetaMask connected to localhost
5. **Deploy to testnet** when ready for testing

Your Hardhat setup is now clean, organized, and ready for local development! 🎉

This guide explains how to use the refactored Hardhat configuration for local development.

## 📋 Configuration Summary

The `hardhat.config.js` has been refactored with the following changes:

### ✅ **Changes Made**

1. **Solidity Version**: Set to `0.8.18` (as requested)
2. **Localhost Network**: Added `http://127.0.0.1:8545` with chainId `31337`
3. **Hardhat Network**: Uses chainId `31337` (consistent with localhost)
4. **Removed Unused Private Keys**: Cleaned up configuration
5. **Added Gas Reporting**: Optional gas usage tracking
6. **Path Configuration**: Explicit paths for better organization

### 🌐 **Network Configuration**

```javascript
networks: {
  // Local Hardhat network (default)
  hardhat: {
    chainId: 31337,
    // Hardhat will automatically create accounts for testing
  },
  // Localhost network for external clients
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
    // No accounts needed - will use the same accounts as hardhat
  },
  // Sepolia testnet (optional - only if needed)
  sepolia: {
    url: process.env.ETHEREUM_NETWORK_URL || "https://sepolia.infura.io/v3/your_project_id",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 11155111,
  }
}
```

## 🚀 **Quick Start**

### 1. Start Local Network
```bash
# Start Hardhat node (for external clients)
npm run hardhat:node

# Or directly with hardhat
npx hardhat node
```

### 2. Compile Contracts
```bash
npm run hardhat:compile

# Or directly
npx hardhat compile
```

### 3. Deploy Contracts
```bash
npm run hardhat:deploy

# Or directly
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Run Tests
```bash
npm run hardhat:test

# Or directly
npx hardhat test
```

## 🔧 **MetaMask Configuration**

To connect MetaMask to your local Hardhat network:

1. **Open MetaMask** and click the network dropdown
2. **Add Network** → **Add a network manually**
3. **Fill in the details**:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: (leave empty)

4. **Import Accounts**: Use the private keys from the Hardhat console output

## 💰 **Test Accounts**

When you start `npx hardhat node`, you'll see 20 test accounts with 10000 ETH each:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

## 🧪 **Testing Workflow**

### 1. Start the Network
```bash
# Terminal 1: Start Hardhat node
npm run hardhat:node
```

### 2. Deploy Contracts
```bash
# Terminal 2: Deploy contracts
npm run hardhat:deploy
```

### 3. Update Frontend
Update your frontend configuration with the deployed contract address:

```javascript
// In client/src/config/addresses.js
export const NFT_CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### 4. Test Frontend
```bash
# Terminal 3: Start frontend
cd client && npm start
```

## 🔍 **Troubleshooting**

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill process using port 8545
   npx kill-port 8545
   ```

2. **MetaMask Connection Issues**:
   - Ensure you're using the correct RPC URL: `http://127.0.0.1:8545`
   - Check Chain ID is `31337`
   - Reset MetaMask account if needed

3. **Contract Deployment Fails**:
   - Ensure Hardhat node is running
   - Check if you're using the correct network: `--network localhost`

### Debug Commands

```bash
# Check network status
npx hardhat console --network localhost

# Get account balance
await ethers.provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

# Get network info
await ethers.provider.getNetwork()
```

## 📝 **Environment Variables**

Create a `.env` file in the root directory (optional for local development):

```bash
# .env
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

## 🎯 **Best Practices**

1. **Always use localhost network** for development
2. **Keep test accounts separate** from main accounts
3. **Use gas reporting** to optimize contract gas usage
4. **Clean up artifacts** regularly with `npm run cleanup`
5. **Test thoroughly** before deploying to testnet

## 🚀 **Next Steps**

1. **Start the local network**: `npm run hardhat:node`
2. **Deploy your contracts**: `npm run hardhat:deploy`
3. **Update frontend config** with the deployed address
4. **Test your application** with MetaMask connected to localhost
5. **Deploy to testnet** when ready for testing

Your Hardhat setup is now clean, organized, and ready for local development! 🎉

This guide explains how to use the refactored Hardhat configuration for local development.

## 📋 Configuration Summary

The `hardhat.config.js` has been refactored with the following changes:

### ✅ **Changes Made**

1. **Solidity Version**: Set to `0.8.18` (as requested)
2. **Localhost Network**: Added `http://127.0.0.1:8545` with chainId `31337`
3. **Hardhat Network**: Uses chainId `31337` (consistent with localhost)
4. **Removed Unused Private Keys**: Cleaned up configuration
5. **Added Gas Reporting**: Optional gas usage tracking
6. **Path Configuration**: Explicit paths for better organization

### 🌐 **Network Configuration**

```javascript
networks: {
  // Local Hardhat network (default)
  hardhat: {
    chainId: 31337,
    // Hardhat will automatically create accounts for testing
  },
  // Localhost network for external clients
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
    // No accounts needed - will use the same accounts as hardhat
  },
  // Sepolia testnet (optional - only if needed)
  sepolia: {
    url: process.env.ETHEREUM_NETWORK_URL || "https://sepolia.infura.io/v3/your_project_id",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 11155111,
  }
}
```

## 🚀 **Quick Start**

### 1. Start Local Network
```bash
# Start Hardhat node (for external clients)
npm run hardhat:node

# Or directly with hardhat
npx hardhat node
```

### 2. Compile Contracts
```bash
npm run hardhat:compile

# Or directly
npx hardhat compile
```

### 3. Deploy Contracts
```bash
npm run hardhat:deploy

# Or directly
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Run Tests
```bash
npm run hardhat:test

# Or directly
npx hardhat test
```

## 🔧 **MetaMask Configuration**

To connect MetaMask to your local Hardhat network:

1. **Open MetaMask** and click the network dropdown
2. **Add Network** → **Add a network manually**
3. **Fill in the details**:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: (leave empty)

4. **Import Accounts**: Use the private keys from the Hardhat console output

## 💰 **Test Accounts**

When you start `npx hardhat node`, you'll see 20 test accounts with 10000 ETH each:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

## 🧪 **Testing Workflow**

### 1. Start the Network
```bash
# Terminal 1: Start Hardhat node
npm run hardhat:node
```

### 2. Deploy Contracts
```bash
# Terminal 2: Deploy contracts
npm run hardhat:deploy
```

### 3. Update Frontend
Update your frontend configuration with the deployed contract address:

```javascript
// In client/src/config/addresses.js
export const NFT_CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### 4. Test Frontend
```bash
# Terminal 3: Start frontend
cd client && npm start
```

## 🔍 **Troubleshooting**

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill process using port 8545
   npx kill-port 8545
   ```

2. **MetaMask Connection Issues**:
   - Ensure you're using the correct RPC URL: `http://127.0.0.1:8545`
   - Check Chain ID is `31337`
   - Reset MetaMask account if needed

3. **Contract Deployment Fails**:
   - Ensure Hardhat node is running
   - Check if you're using the correct network: `--network localhost`

### Debug Commands

```bash
# Check network status
npx hardhat console --network localhost

# Get account balance
await ethers.provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

# Get network info
await ethers.provider.getNetwork()
```

## 📝 **Environment Variables**

Create a `.env` file in the root directory (optional for local development):

```bash
# .env
ETHEREUM_NETWORK_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

## 🎯 **Best Practices**

1. **Always use localhost network** for development
2. **Keep test accounts separate** from main accounts
3. **Use gas reporting** to optimize contract gas usage
4. **Clean up artifacts** regularly with `npm run cleanup`
5. **Test thoroughly** before deploying to testnet

## 🚀 **Next Steps**

1. **Start the local network**: `npm run hardhat:node`
2. **Deploy your contracts**: `npm run hardhat:deploy`
3. **Update frontend config** with the deployed address
4. **Test your application** with MetaMask connected to localhost
5. **Deploy to testnet** when ready for testing

Your Hardhat setup is now clean, organized, and ready for local development! 🎉
