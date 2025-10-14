import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educhain';

async function resetAdminPassword() {
  try {
    // Get new password from command line or use default
    const newPassword = process.argv[2] || 'admin123';

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('❌ No admin user found!');
      console.log('Run: node scripts/create-admin-user.js');
      mongoose.disconnect();
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password and username if missing
    admin.passwordHash = passwordHash;
    if (!admin.username) {
      admin.username = 'admin';
    }
    await admin.save();

    console.log('\n🎉 Admin password reset successfully!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔑 New Password:', newPassword);
    console.log('👤 Username:', admin.username || 'Not set');
    console.log('\n✅ You can now login at: http://localhost:3000/login\n');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.disconnect();
  }
}

resetAdminPassword();

