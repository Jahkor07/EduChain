const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function resetTestUserPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain');
    console.log('✅ Connected to MongoDB');

    // Find the test user
    const user = await User.findOne({ email: 'teststudent@test.com' });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('👤 Found user:', user.email, 'Role:', user.role);

    // Set a known password
    const newPassword = 'test123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.passwordHash = passwordHash;
    await user.save();

    console.log('✅ Password updated successfully!');
    console.log('📋 Test credentials:');
    console.log('   Email: teststudent@test.com');
    console.log('   Password: test123');
    console.log('   Role: student');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

resetTestUserPassword();


