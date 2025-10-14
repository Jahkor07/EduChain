const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain');
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('email role firstName lastName username');
    
    console.log(`\n👥 Found ${users.length} users in database:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.firstName} ${user.lastName} (@${user.username})`);
    });

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkUsers();


