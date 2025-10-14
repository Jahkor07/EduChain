const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@educhain.com' });
    
    if (existingAdmin) {
      console.log('');
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@educhain.com');
      console.log('');
      console.log('If you forgot the password, you can:');
      console.log('1. Delete the existing admin from MongoDB');
      console.log('2. Run this script again');
      console.log('');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new User({
      email: 'admin@educhain.com',
      passwordHash: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      phoneNumber: ''
    });

    await admin.save();
    
    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@educhain.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('You can now login at: http://localhost:3000/login');
    console.log('');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();



