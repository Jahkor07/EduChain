# 🔧 MetaMask Connection Troubleshooting Guide

## 🚨 **Quick Fix Steps**

### **Step 1: Create Environment File Manually**

Since we can't create the `.env` file automatically, please create it manually:

1. **Navigate to:** `client/` folder
2. **Create a new file** called `.env` (no extension)
3. **Add this content:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_USE_TESTNET=false
```

### **Step 2: Start Hardhat Node**

Open a **new terminal** and run:
```bash
cd C:\Users\jacob\EduChain
npx hardhat node
```

**Keep this terminal running!** You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### **Step 3: Configure MetaMask**

1. **Open MetaMask** in your browser
2. **Click the network dropdown** (top left)
3. **Click "Add Network"** → "Add a network manually"
4. **Enter these details:**
   - **Network Name:** `Hardhat Localhost`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
5. **Click "Save"**

### **Step 4: Import Test Account (Optional)**

For testing, import the Hardhat test account:

1. **In MetaMask:** Click account icon → "Import Account"
2. **Paste this private key:**
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
3. **Click "Import"**

This account has **10,000 ETH** for testing!

### **Step 5: Start the Application**

Open **another terminal** and run:
```bash
cd C:\Users\jacob\EduChain\client
npm start
```

### **Step 6: Connect MetaMask**

1. **Open the app** in your browser (usually http://localhost:3000)
2. **Click "Connect Wallet"**
3. **MetaMask should open** with a connection request
4. **Click "Connect"**
5. **Select the Hardhat Localhost network** if prompted
6. **✅ You should be connected!**

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "MetaMask is not installed"**
**Solution:**
- Install MetaMask extension from https://metamask.io
- Refresh the page after installation

### **Issue 2: "User rejected the request"**
**Solution:**
- Click "Connect Wallet" again
- When MetaMask opens, click "Connect" (don't click "Cancel")

### **Issue 3: "Wrong Network"**
**Solution:**
- In MetaMask, switch to "Hardhat Localhost" network
- Or let the app auto-switch (it should prompt you)

### **Issue 4: "No accounts found"**
**Solution:**
- Import the test account (Step 4 above)
- Or create a new account in MetaMask

### **Issue 5: "Connection failed"**
**Solution:**
- Make sure Hardhat node is running (Step 2)
- Check that port 8545 is not blocked
- Try refreshing the page

### **Issue 6: "Cannot read properties of null"**
**Solution:**
- This usually means the environment file is missing
- Create the `.env` file manually (Step 1)

---

## 🔍 **Debug Steps**

### **Check if MetaMask is Working:**

Open browser console (F12) and run:
```javascript
// Check if MetaMask is installed
console.log('MetaMask:', window.ethereum?.isMetaMask);

// Try to connect
window.ethereum.request({ method: 'eth_requestAccounts' })
  .then(accounts => console.log('✅ Connected:', accounts[0]))
  .catch(error => console.error('❌ Error:', error));
```

### **Check Network:**
```javascript
// Check current network
window.ethereum.request({ method: 'eth_chainId' })
  .then(chainId => console.log('Chain ID:', parseInt(chainId, 16)))
  .catch(error => console.error('Error:', error));
```

Should show `31337` for Hardhat localhost.

---

## 📋 **Checklist**

Before connecting MetaMask, make sure:

- [ ] MetaMask extension is installed
- [ ] MetaMask is unlocked (not locked)
- [ ] Hardhat node is running (`npx hardhat node`)
- [ ] Hardhat network is added to MetaMask
- [ ] You're on Hardhat Localhost network in MetaMask
- [ ] `.env` file exists in `client/` folder
- [ ] Frontend app is running (`npm start`)

---

## 🚀 **Expected Behavior**

When everything works correctly:

1. **Click "Connect Wallet"**
2. **MetaMask popup appears**
3. **Shows "Connect with MetaMask"**
4. **Click "Connect"**
5. **Select account if multiple accounts**
6. **Popup closes**
7. **Wallet address appears in UI** (0x1234...5678)
8. **✅ Connected!**

---

## 💡 **Pro Tips**

1. **Keep Hardhat Running:** Don't close the Hardhat terminal while testing
2. **Use Test Account:** The provided private key has 10,000 ETH
3. **Clear Cache:** If issues persist, clear browser cache
4. **Check Console:** Always check browser console for error messages
5. **Restart Everything:** If stuck, restart Hardhat, browser, and app

---

## 🆘 **Still Not Working?**

If you're still having issues:

1. **Check the browser console** for error messages
2. **Make sure all terminals are running:**
   - Terminal 1: `npx hardhat node`
   - Terminal 2: `cd client && npm start`
3. **Try in incognito mode** to avoid cache issues
4. **Restart MetaMask extension**
5. **Check Windows Firewall** (might block localhost connections)

**Share the error message** from the browser console, and I'll help you fix it! 🔧

