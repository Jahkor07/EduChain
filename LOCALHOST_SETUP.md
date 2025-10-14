# 🔧 EduChain Localhost Setup Guide

## ✅ Quick Setup for Local Testing

The EduChain app is now configured to **automatically use localhost** for testing. You don't need to change any environment variables!

---

## 🚀 How It Works

### **Default Configuration:**
- **Development Mode**: Automatically uses Hardhat localhost (Chain ID: 31337)
- **MetaMask**: Will connect to `http://127.0.0.1:8545`
- **No Configuration Needed**: Works out of the box!

---

## 📋 Setup Steps

### **1. Start Hardhat Local Node**
```bash
# In the root directory
npx hardhat node
```

Keep this terminal running!

### **2. Add Hardhat Network to MetaMask**

MetaMask should automatically prompt you to add the network, OR you can add it manually:

1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: `Hardhat Localhost`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
5. Click "Save"

### **3. Import Test Account (Optional)**

Hardhat provides a test account with 10,000 ETH:

1. Open MetaMask
2. Click account icon → "Import Account"
3. Paste this private key:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
4. Click "Import"

### **4. Start the App**

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd client
npm start
```

### **5. Connect MetaMask**

1. Open the app in your browser
2. Click "Connect Wallet"
3. MetaMask will open
4. Select the Hardhat Localhost network
5. Click "Connect"
6. ✅ You're connected!

---

## 🎯 What You Get

### **Automatic Network Detection:**
- ✅ Automatically detects you're in development mode
- ✅ Uses localhost by default
- ✅ No environment variables needed
- ✅ Works immediately after setup

### **Features:**
- ✅ Connect to MetaMask
- ✅ Mint NFT certificates
- ✅ Test all blockchain features
- ✅ 10,000 test ETH per account
- ✅ Instant transactions (no gas fees!)

---

## 🔄 Switching Networks

### **To Use Sepolia Testnet Instead:**

1. Add to `client/.env`:
   ```env
   REACT_APP_USE_TESTNET=true
   ```

2. Restart the frontend:
   ```bash
   cd client
   npm start
   ```

### **Back to Localhost:**

1. Remove or set to false in `client/.env`:
   ```env
   REACT_APP_USE_TESTNET=false
   ```

2. Restart the frontend

---

## 🐛 Troubleshooting

### **"MetaMask is not installed"**
- Install MetaMask extension from https://metamask.io
- Refresh the page

### **"Wrong Network"**
- Click MetaMask network dropdown
- Select "Hardhat Localhost"
- If not in list, add it manually (see Step 2 above)

### **"Connection Failed"**
- Make sure Hardhat node is running (`npx hardhat node`)
- Check that port 8545 is not blocked
- Try refreshing the page

### **"No Accounts"**
- Import the test account (see Step 3 above)
- Or create a new account in MetaMask

---

## 📊 Network Comparison

| Feature | Localhost | Sepolia Testnet |
|---------|-----------|-----------------|
| **Setup** | Run `npx hardhat node` | Just connect |
| **Speed** | Instant | ~15 seconds |
| **Gas Fees** | Free | Free (testnet ETH) |
| **Accounts** | 20 pre-funded | Need testnet ETH |
| **Persistence** | Resets on restart | Permanent |
| **Best For** | Development | Testing |

---

## 🎉 You're All Set!

Your EduChain app is now configured for local testing with Hardhat. Just run:

```bash
# Terminal 1
npx hardhat node

# Terminal 2
cd backend && npm start

# Terminal 3
cd client && npm start
```

Then connect your MetaMask and start testing! 🚀

---

## 💡 Pro Tips

1. **Keep Hardhat Running**: Don't close the Hardhat terminal while testing
2. **Use Test Account**: Import the provided private key for 10,000 ETH
3. **Reset Anytime**: Restart Hardhat to reset all blockchain state
4. **Fast Testing**: Transactions are instant on localhost
5. **No Gas Worries**: All transactions are free on localhost

---

## 🔗 Quick Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [MetaMask Documentation](https://docs.metamask.io)
- [EduChain Project Docs](./PROJECT_DOCUMENTATION.md)

---

**Happy Testing! 🎓**


