import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educhain';

async function makeUserAdmin() {
  try {
    // Get email from command line argument
    const email = process.argv[2];

    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node make-user-admin.js <email>');
      console.log('Example: node make-user-admin.js user@example.com');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log('❌ User not found with email:', email);
      mongoose.disconnect();
      process.exit(1);
    }

    // Update user to admin
    user.role = 'admin';
    user.verified = true;
    user.verifiedAt = new Date();
    await user.save();

    console.log('\n🎉 User successfully promoted to admin!\n');
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('🔐 Role:', user.role);
    console.log('✅ Verified:', user.verified);
    console.log('\n✅ You can now login at: http://localhost:3000/login\n');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

makeUserAdmin();










