const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Increase JSON body size limit to handle base64 encoded files
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educhain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const certificateRoutes = require('./routes/certificates');
// const nftRoutes = require('./routes/nft');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/certificates', certificateRoutes);
// app.use('/api/nft', nftRoutes);

// Initialize blockchain service at startup
const blockchainService = require('./services/blockchainService');

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize blockchain service
  console.log('🔗 Initializing blockchain service...');
  try {
    const blockchainInitialized = await blockchainService.initialize();
    if (blockchainInitialized) {
      console.log('✅ Blockchain service initialized successfully');
    } else {
      console.log('⚠️  Blockchain service initialization failed');
    }
  } catch (error) {
    console.error('❌ Blockchain service initialization error:', error.message);
  }
});
