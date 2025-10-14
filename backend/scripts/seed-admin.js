const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@educhain.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const adminUser = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@educhain.com',
      passwordHash: hashedPassword,
      role: 'admin',
      phoneVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@educhain.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
createAdminUser();
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Admin user data
const adminData = {
  firstName: 'Super',
  lastName: 'Admin',
  email: 'admin@educhain.com',
  passwordHash: '', // Will be hashed below
  role: 'admin',
  phoneNumber: '+260123456789',
  phoneVerified: true
};

// Function to seed admin user
async function seedAdmin() {
  try {
    console.log('🌱 Starting to seed admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }
    
    // Hash the password
    const saltRounds = 10;
    adminData.passwordHash = await bcrypt.hash('admin123', saltRounds);
    
    // Create admin user
    const admin = new User(adminData);
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👑 Role:', admin.role);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAdmin();
