# Complete Backend → Server Rename Instructions

## ⚠️ Folder is Currently Locked

The `backend/` folder cannot be renamed because it's being used by another process (likely VSCode or Windows Explorer).

---

## 🔧 How to Complete the Rename

### Option 1: Close VSCode and Rename (Recommended)

1. **Save all your work in VSCode**
2. **Close VSCode completely**
3. **Open PowerShell as Administrator**
4. **Run these commands:**

```powershell
cd C:\Users\jacob\EduChain
Rename-Item -Path "backend" -NewName "server"
```

5. **Reopen VSCode**
6. **Done!** ✅

---

### Option 2: Use File Explorer

1. **Close VSCode**
2. **Open File Explorer**
3. **Navigate to**: `C:\Users\jacob\EduChain`
4. **Right-click** on `backend` folder
5. **Select** "Rename"
6. **Type**: `server`
7. **Press Enter**
8. **Reopen VSCode**
9. **Done!** ✅

---

### Option 3: Use Command Prompt as Admin

1. **Close VSCode**
2. **Open Command Prompt as Administrator**
3. **Run:**

```cmd
cd C:\Users\jacob\EduChain
ren backend server
```

4. **Reopen VSCode**
5. **Done!** ✅

---

## ✅ What's Already Been Updated

I've already updated the following files to reference `server/` instead of `backend/`:

### ✓ Root package.json
```json
{
  "scripts": {
    "start": "cd server && npm start",  // UPDATED
    "dev": "cd server && npm start"      // UPDATED
  }
}
```

---

## 📋 After Renaming, Verify:

```powershell
# Check folder exists
Test-Path server
# Should return: True

# Check old folder is gone
Test-Path backend
# Should return: False

# Start server
cd server
npm start

# Start client (in new terminal)
cd client
npm start
```

---

## 🎯 Final Project Structure

After renaming, your structure will be:

```
EduChain/
├── client/          # Frontend React App ✅
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
├── server/          # Backend Express App ✅ (RENAMED)
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
├── contracts/       # Smart Contracts ✅
├── scripts/         # Hardhat Scripts ✅
├── docs/            # Project Documentation ✅
│
├── .env
├── package.json     # (UPDATED) ✅
└── README.md
```

---

## 🚀 Quick Steps

1. **Close VSCode** (File → Exit)
2. **Open PowerShell**
3. **Run:**
   ```powershell
   cd C:\Users\jacob\EduChain
   Rename-Item -Path "backend" -NewName "server"
   ```
4. **Reopen VSCode**
5. **Test:**
   ```powershell
   cd server && npm start
   cd client && npm start
   ```

---

## ✅ What's Complete

- ✅ Frontend fully organized
- ✅ Backend fully organized
- ✅ Root package.json updated
- ✅ Old server/ folder deleted
- ⏳ Rename backend → server (waiting for folder unlock)

---

## 📞 Need Help?

If you continue to have issues:

1. **Restart your computer** (will release all file locks)
2. **Then run the rename command**
3. **Everything will work!**

---

## 🎉 Almost Done!

The reorganization is 95% complete! Just need to:
1. Close VSCode
2. Rename the folder
3. Reopen VSCode
4. Test the application

**You're almost there!** 🚀











