# 🔐 How to Login as Admin - Quick Guide

You have **3 options** to create/access an admin account:

---

## ✅ **Option 1: Create a New Admin User (Recommended)**

### Run this command in your terminal:

```bash
cd backend
node scripts/create-admin-user.js
```

### This will create:
- **Email:** `admin@educhain.com`
- **Password:** `admin123`
- **Role:** `admin`

### Then login:
1. Go to http://localhost:3000/role-select
2. Select **any role** (it will check your actual role from database)
3. Click "Continue"
4. Enter:
   - Email: `admin@educhain.com`
   - Password: `admin123`
5. You'll be redirected to `/admin-dashboard` 🎉

---

## ✅ **Option 2: Make an Existing User Admin**

If you already have an account and want to make it admin:

```bash
cd backend
node scripts/make-user-admin.js your@email.com
```

**Example:**
```bash
node scripts/make-user-admin.js john@example.com
```

This will:
- Change the user's role to `admin`
- Set `verified: true`
- Keep the existing password

Then login with your existing email and password!

---

## ✅ **Option 3: Manually Update in MongoDB**

If you prefer to do it manually:

### **Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database `educhain`
4. Select collection `users`
5. Find your user
6. Click "Edit Document"
7. Change `"role": "student"` to `"role": "admin"`
8. Change `"verified": false` to `"verified": true"`
9. Click "Update"

### **Using MongoDB Shell:**
```javascript
// Connect to MongoDB
mongosh

// Switch to educhain database
use educhain

// Update user to admin
db.users.updateOne(
  { email: "your@email.com" },
  { 
    $set: { 
      role: "admin",
      verified: true,
      verifiedAt: new Date()
    }
  }
)

// Verify the change
db.users.findOne({ email: "your@email.com" })
```

---

## 🚪 **Login Flow**

### Step-by-step:

1. **Go to Role Selection:**
   ```
   http://localhost:3000/role-select
   ```

2. **Select Any Role:**
   - It doesn't matter which role you select
   - The system will check your actual role from the database

3. **Click "Continue"** (goes to login page)

4. **Enter Credentials:**
   - Email: `admin@educhain.com` (or your email)
   - Password: `admin123` (or your password)

5. **You'll See:**
   - "Logging in as: admin" indicator
   - Toast notification: "Login successful!"
   - Automatic redirect to `/admin-dashboard`

---

## 🎯 **What You'll See in Admin Dashboard**

After logging in, you'll have access to:

### **Sidebar Navigation:**
- 📊 **Overview** - Platform statistics
- 👨‍🏫 **Educators** - Verify pending educators
- ⚙️ **Configuration** - Platform settings
- 🛒 **Marketplace** - Moderate NFT listings
- 📋 **Reports** - Handle user reports

### **Statistics Cards:**
- Total Users
- Total Educators
- Total Students
- Pending Verifications
- Total NFTs
- Active Reports

---

## 🔍 **Troubleshooting**

### **Problem: "Access denied" after login**

**Solution:** Check your user's role in the database
```bash
cd backend
node scripts/make-user-admin.js your@email.com
```

### **Problem: "Invalid email or password"**

**Solution:** Create a fresh admin account
```bash
cd backend
node scripts/create-admin-user.js
```

### **Problem: Still redirected to student/educator dashboard**

**Solution:** Clear localStorage and login again
```javascript
// Open browser console (F12)
localStorage.clear();
// Then refresh and login again
```

---

## 📝 **Quick Reference**

### **Default Admin Credentials:**
```
Email: admin@educhain.com
Password: admin123
URL: http://localhost:3000/admin-dashboard
```

### **Command Summary:**
```bash
# Create new admin
node scripts/create-admin-user.js

# Make existing user admin
node scripts/make-user-admin.js your@email.com

# Check if scripts work
cd backend
node scripts/create-admin-user.js
```

---

## ✅ **Verification**

After running the script, you should see:

```
✅ Connected to MongoDB
🎉 Admin user created successfully!

📧 Email: admin@educhain.com
🔑 Password: admin123
👤 Username: admin
🔐 Role: admin

✅ You can now login at: http://localhost:3000/login
```

---

## 🎉 **You're Ready!**

Choose your preferred option above and you'll be logged in as admin in **under 1 minute**!

**Recommended:** Use **Option 1** for the quickest setup! 🚀










