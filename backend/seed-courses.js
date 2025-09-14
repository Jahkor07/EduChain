const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample educator data
const sampleEducators = [
  {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    username: 'sarah_johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    role: 'educator',
    department: 'Computer Science',
    phoneNumber: '+260123456789'
  },
  {
    firstName: 'Prof. Michael',
    lastName: 'Chen',
    username: 'michael_chen',
    email: 'michael.chen@example.com',
    password: 'password123',
    role: 'educator',
    department: 'Blockchain Technology',
    phoneNumber: '+260123456790'
  },
  {
    firstName: 'Dr. Emily',
    lastName: 'Williams',
    username: 'emily_williams',
    email: 'emily.williams@example.com',
    password: 'password123',
    role: 'educator',
    department: 'Web Development',
    phoneNumber: '+260123456791'
  }
];

// Sample courses data
const sampleCourses = [
  {
    title: 'Introduction to Blockchain Technology',
    description: 'Learn the fundamentals of blockchain technology, including distributed ledgers, consensus mechanisms, and smart contracts.',
    educatorEmail: 'sarah.johnson@example.com',
    price: 99.99,
    currency: 'ZMW',
    duration: '4 weeks',
    category: 'Blockchain',
    tags: ['blockchain', 'cryptocurrency', 'distributed-systems'],
    status: 'active'
  },
  {
    title: 'Smart Contract Development with Solidity',
    description: 'Master smart contract development using Solidity programming language for Ethereum blockchain.',
    educatorEmail: 'michael.chen@example.com',
    price: 149.99,
    currency: 'ZMW',
    duration: '6 weeks',
    category: 'Programming',
    tags: ['solidity', 'ethereum', 'smart-contracts', 'web3'],
    status: 'active'
  },
  {
    title: 'Web3 Development Fundamentals',
    description: 'Build decentralized applications (dApps) using modern web3 technologies and frameworks.',
    educatorEmail: 'emily.williams@example.com',
    price: 199.99,
    currency: 'ZMW',
    duration: '8 weeks',
    category: 'Web Development',
    tags: ['web3', 'dapp', 'javascript', 'react'],
    status: 'active'
  },
  {
    title: 'Digital Marketing for Educators',
    description: 'Learn how to effectively market your online courses and educational content.',
    educatorEmail: 'sarah.johnson@example.com',
    price: 79.99,
    currency: 'ZMW',
    duration: '3 weeks',
    category: 'Marketing',
    tags: ['marketing', 'social-media', 'content-creation'],
    status: 'active'
  },
  {
    title: 'Python Programming for Beginners',
    description: 'Start your programming journey with Python - one of the most popular programming languages.',
    educatorEmail: 'michael.chen@example.com',
    price: 89.99,
    currency: 'ZMW',
    duration: '5 weeks',
    category: 'Programming',
    tags: ['python', 'programming', 'beginner', 'coding'],
    status: 'active'
  },
  {
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning using Python and popular libraries.',
    educatorEmail: 'emily.williams@example.com',
    price: 179.99,
    currency: 'ZMW',
    duration: '10 weeks',
    category: 'Data Science',
    tags: ['python', 'data-science', 'machine-learning', 'pandas'],
    status: 'active'
  }
];

// Function to seed courses
async function seedCourses() {
  try {
    console.log('🌱 Starting to seed courses...');
    
    // First, create or find educators
    console.log('👨‍🏫 Creating educators...');
    const educators = [];
    
    for (const educatorData of sampleEducators) {
      let educator = await User.findOne({ email: educatorData.email });
      
      if (!educator) {
        // Hash password (simple hash for demo - in production use bcrypt)
        educatorData.password = require('crypto').createHash('md5').update(educatorData.password).digest('hex');
        educator = new User(educatorData);
        await educator.save();
        console.log(`✅ Created educator: ${educator.email}`);
      } else {
        console.log(`👤 Found existing educator: ${educator.email}`);
      }
      
      educators.push(educator);
    }
    
    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');
    
    // Create sample courses with proper educatorId
    const coursesWithEducatorIds = sampleCourses.map(courseData => {
      const educator = educators.find(edu => edu.email === courseData.educatorEmail);
      return {
        ...courseData,
        educatorId: educator._id
      };
    });
    
    const createdCourses = await Course.insertMany(coursesWithEducatorIds);
    console.log(`✅ Successfully created ${createdCourses.length} courses`);
    
    // Display created courses
    createdCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - ${course.price} ${course.currency}`);
    });
    
    console.log('🎉 Course seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedCourses();



