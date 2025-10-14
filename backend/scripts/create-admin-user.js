import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educhain';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user details
    const adminData = {
      username: 'admin',
      firstName: 'Admin',
      lastName: 'EduChain',
      email: 'admin@educhain.com',
      password: 'admin123', // Change this to a secure password
      role: 'admin',
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      console.log('🔑 Role:', existingAdmin.role);
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.verified = true;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
      
      mongoose.disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      username: adminData.username,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      passwordHash: passwordHash,
      role: 'admin',
      verified: true,
      verifiedAt: new Date(),
    });

    await admin.save();

    console.log('\n🎉 Admin user created successfully!\n');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Username:', adminData.username);
    console.log('🔐 Role:', adminData.role);
    console.log('\n✅ You can now login at: http://localhost:3000/login\n');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();










