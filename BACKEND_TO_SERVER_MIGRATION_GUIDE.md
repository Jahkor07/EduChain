# Backend → Server Migration Guide

## 🎯 Goal
Rename `backend/` folder to `server/` and update all references throughout the EduChain project.

---

## ⚠️ Important: Stop All Running Processes First

Before renaming, you must stop all Node.js processes:

```bash
# Stop all node processes
taskkill /F /IM node.exe

# Or stop specific processes:
# - Stop backend server (Ctrl+C in terminal)
# - Stop frontend dev server (Ctrl+C in terminal)
# - Stop Hardhat node (Ctrl+C in terminal)
```

---

## 📋 Step-by-Step Migration

### Step 1: Stop All Servers
```bash
# In terminal where backend is running
Ctrl+C

# In terminal where frontend is running  
Ctrl+C

# In terminal where Hardhat is running
Ctrl+C
```

### Step 2: Rename Folder
```bash
cd C:\Users\jacob\EduChain
Rename-Item -Path "backend" -NewName "server"
```

### Step 3: Update Root package.json

**File**: `package.json`

**Find and replace:**
```json
// OLD
"scripts": {
  "start": "cd backend && npm start",
  "dev": "cd backend && npm run dev"
}

// NEW
"scripts": {
  "start": "cd server && npm start",
  "dev": "cd server && npm run dev"
}
```

### Step 4: Update Client API Calls

**Files to check**: `client/src/`

**Find and replace in all files:**
```javascript
// OLD
http://localhost:5000

// NEW  
http://localhost:5000
// (No change needed - API calls use localhost, not folder names)
```

**Note**: Client API calls use `localhost:5000`, not folder paths, so no changes needed!

### Step 5: Update Documentation References

**Files**: All `*.md` files

**Find and replace:**
```markdown
// OLD
backend/routes/
backend/services/
cd backend

// NEW
server/routes/
server/services/
cd server
```

### Step 6: Update .gitignore (if exists)

**File**: `.gitignore`

**Find and replace:**
```
// OLD
backend/node_modules
backend/.env
backend/uploads

// NEW
server/node_modules
server/.env
server/uploads
```

### Step 7: Update Deployment Scripts (if any)

**Files**: Deployment scripts, Docker files, CI/CD configs

**Find and replace:**
```bash
// OLD
cd backend
./backend/index.js

// NEW
cd server
./server/index.js
```

---

## 🔍 Files That Need Updates

### Root Level
- ✅ `package.json` - Update scripts
- ✅ `.gitignore` - Update paths (if exists)
- ✅ `README.md` - Update folder references
- ⚠️ Any deployment scripts

### Documentation
- ✅ All `*.md` files - Update folder references
- ✅ Setup guides - Update cd commands

### Client
- ✅ **No changes needed** - API calls use localhost, not folder paths

### Server (formerly backend)
- ✅ **No changes needed** - Internal imports use relative paths

---

## ✅ Verification Checklist

After renaming, verify:

- [ ] `server/` folder exists
- [ ] Old `backend/` folder is gone
- [ ] `server/index.js` exists
- [ ] `server/package.json` exists
- [ ] Root `package.json` scripts updated
- [ ] Documentation references updated
- [ ] `.gitignore` paths updated
- [ ] Backend starts: `cd server && npm start`
- [ ] Frontend starts: `cd client && npm start`
- [ ] API calls work from frontend to backend
- [ ] Database connections work
- [ ] File uploads work
- [ ] All features functional

---

## 🚀 Quick Migration Commands

```powershell
# Navigate to project root
cd C:\Users\jacob\EduChain

# Stop all processes
taskkill /F /IM node.exe

# Rename folder
Rename-Item -Path "backend" -NewName "server"

# Update root package.json (manual edit)
# Change "cd backend" to "cd server" in scripts

# Test backend
cd server
npm start

# Test frontend (in new terminal)
cd client  
npm start
```

---

## 🐛 Troubleshooting

### Issue: "Cannot rename - file in use"
**Solution**: Stop all Node.js processes first
```powershell
taskkill /F /IM node.exe
```

### Issue: "Module not found" after renaming
**Solution**: Check if any absolute paths reference "backend"
```bash
# Search for hardcoded paths
grep -r "backend" package.json
grep -r "backend" client/src/
```

### Issue: API calls fail after renaming
**Solution**: API calls use localhost:5000, not folder names
- No changes needed in client API calls
- Verify server is running on port 5000

### Issue: Database connection fails
**Solution**: Check `.env` file is in server/ folder
```bash
# Verify .env location
ls server/.env
```

---

## 📊 Impact Analysis

### Zero Impact (No changes needed):
- ✅ Client API calls (use localhost)
- ✅ Server internal imports (use relative paths)
- ✅ Database connections (use .env)
- ✅ Smart contracts (separate folder)

### Low Impact (Simple text updates):
- ⚠️ Root package.json scripts
- ⚠️ Documentation references
- ⚠️ README.md instructions

### Medium Impact (Need careful update):
- ⚠️ Deployment scripts (if any)
- ⚠️ CI/CD configs (if any)
- ⚠️ Docker files (if any)

---

## 🎯 Final Structure After Migration

```
EduChain/
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── tests/         # Test files
│   │   ├── docs/          # Documentation
│   │   ├── utils/         # Utilities
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # React contexts
│   │   ├── config/        # Configuration
│   │   ├── assets/        # Images & icons
│   │   └── layouts/       # Layouts
│   ├── package.json
│   └── README.md
│
├── server/                 # Backend Express App (RENAMED)
│   ├── controllers/       # Route handlers
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Auth & validation
│   ├── services/          # External APIs
│   ├── config/            # Configuration
│   ├── utils/             # Helper functions
│   ├── tests/             # Test files
│   ├── scripts/           # Utility scripts
│   ├── docs/              # Documentation
│   ├── uploads/           # Temporary files
│   ├── index.js           # Entry point
│   ├── package.json
│   └── .env
│
├── contracts/              # Smart Contracts
├── scripts/                # Hardhat Scripts
├── test/                   # Hardhat Tests
├── docs/                   # Project Documentation
│
├── .env
├── .gitignore
├── hardhat.config.js
├── package.json            # Root package (UPDATED)
└── README.md               # Project README (UPDATED)
```

---

## ⚡ Ready to Execute

I've created this comprehensive guide. To complete the migration:

1. **Stop all Node processes** (close terminals or Ctrl+C)
2. **Run the rename command**
3. **Update root package.json**
4. **Update documentation**
5. **Test the application**

Would you like me to:
- **Wait for you to stop the servers** and then continue?
- **Provide the exact commands** to run manually?
- **Create a PowerShell script** to automate the migration?

Let me know and I'll proceed! 🚀











