# 🚀 How to Start the EduChain Application

## Prerequisites
- MongoDB running on `localhost:27017`
- Node.js installed
- Two terminal windows

---

## Step 1: Start the Backend Server

Open Terminal 1:
```bash
cd backend
npm start
```

You should see:
```
✅ Server running on port 5000
✅ MongoDB connected successfully
```

---

## Step 2: Start the Frontend (React)

Open Terminal 2:
```bash
cd client
npm start
```

The app will open at: `http://localhost:3000`

---

## Step 3: Create Admin User (First Time Only)

In Terminal 1 (or a new terminal):
```bash
cd backend
node scripts/createAdmin.js
```

You'll get:
```
✅ Admin user created successfully!
📧 Email:    admin@educhain.com
🔑 Password: admin123
```

---

## Step 4: Login

Go to `http://localhost:3000/login` and use:

### Admin Login:
- Email: `admin@educhain.com`
- Password: `admin123`

### Test Student Login:
- Email: `student@educhain.com`  
- Password: `student123`

### Test Educator Login:
- Email: `educator@educhain.com`
- Password: `educator123`

---

## Troubleshooting

### "Cannot connect to server"
- Make sure backend is running on port 5000
- Check MongoDB is running

### "Module not found" errors
```bash
cd client
npm install
```

### "Port 3000 already in use"
```bash
# Kill the process
npx kill-port 3000
# Then restart
npm start
```

### Backend port 5000 in use
```bash
# Kill the process
npx kill-port 5000
# Then restart
npm start
```

---

## Quick Commands

### Install all dependencies:
```bash
# Backend
cd backend && npm install

# Frontend
cd client && npm install
```

### Reset everything:
```bash
# Stop all servers (Ctrl+C in both terminals)
# Delete node_modules
rm -rf backend/node_modules client/node_modules
# Reinstall
cd backend && npm install
cd ../client && npm install
```

---

## Admin Dashboard Features

Once logged in as admin, you can:

1. **📊 Overview** - View platform statistics
2. **👨‍🏫 Educator Verification** - Approve/reject educator applications  
3. **⚙️ Platform Config** - Configure platform settings
4. **🏪 Marketplace** - Moderate marketplace items
5. **🚨 Reports** - Handle user reports

---

## Default Ports

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

---

## Need Help?

Check the console logs in both terminals for error messages.



