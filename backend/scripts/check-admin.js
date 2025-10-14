import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educhain';

async function checkAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('❌ No admin user found!\n');
      console.log('Run: node scripts/create-admin-user.js');
      mongoose.disconnect();
      return;
    }

    console.log('🎉 Admin user found!\n');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username || 'Not set');
    console.log('👤 Name:', `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Not set');
    console.log('🔐 Role:', admin.role);
    console.log('✅ Verified:', admin.verified);
    console.log('📅 Created:', admin.createdAt);
    console.log('\n💡 Login URL: http://localhost:3000/login');
    console.log('📝 If you forgot the password, run: node scripts/reset-admin-password.js\n');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.disconnect();
  }
}

checkAdmin();










