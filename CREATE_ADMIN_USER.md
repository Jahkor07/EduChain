# How to Create an Admin User

You can't login to the admin dashboard because there's no admin user in the database. Here's how to create one:

## Method 1: Using MongoDB Compass or Shell

1. Open MongoDB Compass or MongoDB Shell
2. Connect to your database
3. Select the `educhain` database (or your database name)
4. Select the `users` collection
5. Insert a new document:

```javascript
{
  "email": "admin@educhain.com",
  "password": "$2a$10$YourHashedPasswordHere", // You'll need to hash this
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "username": "admin",
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

## Method 2: Using Backend Script (Recommended)

Create a file `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/educhain', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@educhain.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new User({
      email: 'admin@educhain.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@educhain.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
```

Then run:
```bash
cd backend
node scripts/createAdmin.js
```

## Method 3: Quick Test (Temporary)

If you just want to test quickly, you can modify the signup to allow admin role:

1. Go to Signup page
2. Sign up with:
   - Email: `admin@educhain.com`
   - Password: `admin123`
   - Role: You'll need to manually change this in the database to `admin` after signup

## Method 4: Use Existing Signup API

You can make a POST request to create an admin:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@educhain.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

## After Creating Admin:

Login with:
- **Email**: `admin@educhain.com`
- **Password**: `admin123` (or whatever you set)

The system will now redirect you to `/admin-dashboard` after login!

---

## Security Note:

⚠️ **IMPORTANT**: After creating the admin account:
1. Change the default password immediately
2. Never commit admin credentials to version control
3. Use strong passwords in production
4. Consider implementing 2FA for admin accounts



