const express = require('express');
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

// Import mock routes
const authRoutes = require('./auth-mock');

// Use routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📝 Test credentials:`);
  console.log(`   Educator: educator@test.com / password`);
  console.log(`   Student: student@test.com / password`);
});

