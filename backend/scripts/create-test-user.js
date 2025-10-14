const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain');
    console.log('✅ Connected to MongoDB');

    // Create test users
    const testUsers = [
      {
        email: 'student@educhain.com',
        password: 'learn123',
        role: 'student',
        firstName: 'Test',
        lastName: 'Student',
        username: 'teststudent'
      },
      {
        email: 'educator@educhain.com',
        password: 'teach123',
        role: 'educator',
        firstName: 'Test',
        lastName: 'Educator',
        username: 'testeducator'
      },
      {
        email: 'admin@educhain.com',
        password: 'admin123',
        role: 'admin',
        firstName: 'Test',
        lastName: 'Admin',
        username: 'testadmin'
      }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`👤 User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = new User({
        email: userData.email,
        passwordHash,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username
      });

      await user.save();
      console.log(`✅ Created ${userData.role} user: ${userData.email}`);
    }

    console.log('\n🎯 Test users created successfully!');
    console.log('📋 Test Credentials:');
    console.log('   Student: student@educhain.com / learn123');
    console.log('   Educator: educator@educhain.com / teach123');
    console.log('   Admin: admin@educhain.com / admin123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestUser();


