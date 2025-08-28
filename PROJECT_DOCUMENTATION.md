# 🎓 EduChain - Educational Blockchain Platform

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Backend Structure](#backend-structure)
- [Database Schema](#database-schema)
- [Blockchain Integration](#blockchain-integration)
- [Usage Guide](#usage-guide)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## 🎯 Project Overview

EduChain is a comprehensive educational blockchain platform that enables educators to create courses and issue verifiable certificates as NFTs (Non-Fungible Tokens). The platform combines traditional e-learning capabilities with blockchain technology to ensure certificate authenticity and ownership.

### Key Objectives
- **Course Management**: Allow educators to create, edit, and manage educational courses
- **Certificate Minting**: Convert course completion certificates into blockchain-based NFTs
- **User Authentication**: Secure role-based access (students/educators)
- **Blockchain Integration**: Leverage Ethereum blockchain for certificate verification
- **IPFS Storage**: Decentralized storage for certificate files and metadata

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with email/password
- Google OAuth integration
- Role-based access control (Student/Educator)
- Profile completion workflow
- Password reset via email verification
- JWT-based session management

### 📚 Course Management
- Create, edit, and delete courses
- Course pricing in Zambian Kwacha (ZMW)
- Course categorization and tagging
- Student enrollment tracking
- Course status management (active/inactive/draft)

### 🏆 Certificate System
- Issue completion certificates to students
- Convert certificates to NFTs on Ethereum blockchain
- IPFS integration for decentralized storage
- Certificate metadata management
- Grade assignment and expiration dates

### 💰 Blockchain Features
- MetaMask wallet integration
- ERC-721 NFT standard compliance
- Certificate ownership verification
- Transaction history tracking
- Smart contract interaction

## 🛠 Technology Stack

### Frontend
- **React.js** (v18.2.0) - User interface framework
- **React Router DOM** (v6.20.1) - Client-side routing
- **Ethers.js** (v5.7.2) - Ethereum blockchain interaction
- **Axios** - HTTP client for API calls
- **Context API** - Global state management
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt.js** - Password hashing
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing

### Blockchain & Storage
- **Ethereum** - Smart contract platform
- **MetaMask** - Web3 wallet integration
- **IPFS** - InterPlanetary File System
- **Pinata** - IPFS pinning service
- **Hardhat** - Ethereum development environment

### Development Tools
- **npm** - Package manager
- **Git** - Version control
- **PowerShell/Git Bash** - Terminal environments

## 🏗 Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend│    │   MongoDB       │
│                 │◄──►│                 │◄──►│   Database      │
│   - User Auth   │    │   - API Routes  │    │   - Users       │
│   - Dashboard   │    │   - Middleware  │    │   - Courses     │
│   - NFT Minting │    │   - Controllers │    │   - Certificates│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MetaMask      │    │   IPFS/Pinata   │    │   Ethereum      │
│   Wallet        │    │   Storage       │    │   Blockchain    │
│   Integration   │    │   - Files       │    │   - Smart       │
│                 │    │   - Metadata    │    │     Contracts   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Authentication**: Frontend → Backend → MongoDB
2. **Course Creation**: Educator → Backend → MongoDB
3. **Certificate Issuance**: Educator → Backend → MongoDB
4. **NFT Minting**: Backend → IPFS → Ethereum → Backend
5. **Certificate Verification**: Blockchain → IPFS → Frontend

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- MetaMask browser extension
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
MONGODB_URI=mongodb://localhost:27017/educhain
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

### Database Setup
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas cloud service
# Update MONGODB_URI in .env file
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "student"
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### PUT `/api/auth/profile`
Complete user profile after signup.
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+260123456789",
  "address": "Lusaka, Zambia"
}
```

#### POST `/api/auth/forgot-password`
Request password reset code.
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/reset-password`
Reset password using verification code.
```json
{
  "email": "user@example.com",
  "resetCode": "123456",
  "newPassword": "newpassword"
}
```

### Course Management Endpoints

#### POST `/api/courses`
Create a new course (Educator only).
```json
{
  "title": "Advanced Blockchain Development",
  "description": "Learn advanced Solidity and smart contract development",
  "price": 1500,
  "duration": "8 weeks",
  "category": "Programming",
  "tags": ["blockchain", "solidity", "ethereum"]
}
```

#### GET `/api/courses`
Retrieve all courses.
```json
{
  "success": true,
  "data": [
    {
      "_id": "course_id",
      "title": "Course Title",
      "description": "Course Description",
      "price": 1500,
      "currency": "ZMW",
      "educatorEmail": "educator@example.com"
    }
  ]
}
```

#### PUT `/api/courses/:id`
Update course details (Owner only).
```json
{
  "title": "Updated Course Title",
  "price": 2000
}
```

#### DELETE `/api/courses/:id`
Delete a course (Owner only).

### Certificate Management Endpoints

#### POST `/api/certificates/mint`
Create and queue certificate for NFT minting (Educator only).
```json
{
  "studentEmail": "student@example.com",
  "courseId": "course_id",
  "grade": "A+",
  "expiresAt": "2025-12-31",
  "certificateFile": {
    "url": "https://ipfs.io/ipfs/file_hash",
    "type": "application/pdf",
    "size": 1024000
  },
  "metadata": {
    "url": "https://ipfs.io/ipfs/metadata_hash"
  }
}
```

#### GET `/api/certificates`
Retrieve all certificates for the authenticated user.

#### GET `/api/certificates/course/:courseId`
Retrieve certificates for a specific course.

## 🎨 Frontend Components

### Core Components

#### App.js
- Main application component
- Global state management
- Routing configuration
- Wallet connection handling

#### Authentication Components
- **Login.js**: User login form with password reset
- **Signup.js**: User registration with Google OAuth
- **ProfileSetup.js**: Profile completion after signup
- **ForgotPassword.js**: Password reset initiation
- **ResetPassword.js**: Password reset completion

#### Dashboard Components
- **EducatorDashboard.js**: Course and certificate management
- **StudentDashboard.js**: Course enrollment and certificates
- **RoleSelect.js**: User role selection

#### Modal Components
- **CourseModal.js**: Course creation and editing
- **NFTMintingModal.js**: Certificate NFT minting
- **WalletConnectModal.js**: MetaMask wallet connection

### Component Hierarchy
```
App
├── Welcome
├── Login
├── Signup
├── ProfileSetup
├── RoleSelect
├── ProtectedRoute
│   ├── EducatorDashboard
│   │   ├── CourseModal
│   │   ├── NFTMintingModal
│   │   └── WalletConnectModal
│   └── StudentDashboard
└── ThemeProvider
```

## 🔧 Backend Structure

### Directory Structure
```
backend/
├── config/
│   ├── cloudinary.js      # File upload configuration
│   ├── multer.js          # File handling middleware
│   └── email.js           # Email service configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── userController.js   # User management
├── middleware/
│   └── roleCheck.js       # Authentication & authorization
├── models/
│   ├── User.js            # User data schema
│   ├── Course.js          # Course data schema
│   └── Certificate.js     # Certificate data schema
├── routes/
│   ├── auth.js            # Authentication endpoints
│   ├── courses.js         # Course management
│   └── certificates.js    # Certificate management
├── index.js               # Main server file
└── server.js              # Server configuration
```

### Middleware Functions

#### `authenticateToken`
- Verifies JWT token from Authorization header
- Attaches user data to request object
- Returns 401 for invalid/missing tokens

#### `requireEducator`
- Ensures user has educator role
- Returns 403 for unauthorized access

#### `requireStudent`
- Ensures user has student role
- Returns 403 for unauthorized access

#### `requireOwnership`
- Checks if user owns the resource
- Returns 403 for unauthorized access

## 🗄 Database Schema

### User Model
```javascript
{
  firstName: String,           // User's first name
  lastName: String,            // User's last name
  email: String,               // Unique email address
  passwordHash: String,        // Hashed password
  role: String,                // "student" or "educator"
  profilePhoto: String,        // Profile picture URL
  gender: String,              // "male" or "female"
  dateOfBirth: Date,          // Date of birth
  phoneNumber: String,         // Contact number
  address: String,             // Physical address
  resetCode: String,           // Password reset code
  resetCodeExpiry: Date,      // Reset code expiration
  createdAt: Date,            // Account creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### Course Model
```javascript
{
  title: String,               // Course title
  description: String,         // Course description
  educatorId: ObjectId,       // Reference to User model
  educatorEmail: String,      // Educator's email
  status: String,              // "active", "inactive", "draft"
  price: Number,               // Course price in ZMW
  currency: String,            // Currency (default: "ZMW")
  duration: String,            // Course duration
  category: String,            // Course category
  tags: [String],              // Course tags
  enrolledStudents: [ObjectId], // Array of student IDs
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### Certificate Model
```javascript
{
  studentId: ObjectId,         // Reference to User model
  studentEmail: String,        // Student's email
  courseId: ObjectId,          // Reference to Course model
  courseTitle: String,         // Course title
  educatorId: ObjectId,        // Reference to User model
  educatorEmail: String,       // Educator's email
  imageLink: String,           // Certificate file URL
  metadataLink: String,        // Metadata file URL
  nftTokenId: String,          // NFT token ID (unique)
  transactionHash: String,     // Blockchain transaction hash
  contractAddress: String,     // Smart contract address
  status: String,              // "pending", "minted", "failed"
  grade: String,               // Certificate grade
  issuedAt: Date,             // Issue timestamp
  expiresAt: Date,            // Expiration date
  completionDate: Date,        // Course completion date
  ipfsHash: String,            // IPFS file hash
  fileType: String,            // File type
  fileSize: Number,            // File size in bytes
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

## ⛓ Blockchain Integration

### MetaMask Integration
- Wallet connection detection
- Account switching handling
- Network validation
- Transaction signing

### NFT Minting Process
1. **File Upload**: Certificate file uploaded to IPFS via Pinata
2. **Metadata Creation**: Certificate metadata stored on IPFS
3. **Smart Contract Interaction**: NFT minted on Ethereum blockchain
4. **Database Update**: Certificate record updated with blockchain data

### Smart Contract Features
- ERC-721 standard compliance
- Certificate ownership tracking
- Metadata URI storage
- Transfer functionality

## 📖 Usage Guide

### For Educators

#### Creating a Course
1. Log in to your educator account
2. Navigate to the Educator Dashboard
3. Click "Add New Course"
4. Fill in course details (title, description, price)
5. Set course category and tags
6. Click "Create Course"

#### Issuing Certificates
1. Select a course from your dashboard
2. Click "Mint New NFT Certificate"
3. Enter student email and course details
4. Upload certificate file (PDF, JPG, PNG, etc.)
5. Set grade and expiration date
6. Click "Mint Certificate"

### For Students

#### Enrolling in Courses
1. Browse available courses
2. Click "Enroll" on desired course
3. Complete course requirements
4. Receive completion certificate

#### Viewing Certificates
1. Access your student dashboard
2. View earned certificates
3. Verify certificate authenticity on blockchain
4. Download certificate files

## 🔄 Development Workflow

### Development Process
1. **Feature Planning**: Define requirements and user stories
2. **Backend Development**: Create API endpoints and database models
3. **Frontend Development**: Build React components and user interface
4. **Integration Testing**: Test API connections and data flow
5. **Blockchain Testing**: Verify smart contract interactions
6. **User Testing**: Gather feedback and iterate

### Code Standards
- **JavaScript**: ES6+ syntax, async/await patterns
- **React**: Functional components with hooks
- **Backend**: RESTful API design, middleware pattern
- **Database**: Mongoose schemas, validation
- **Blockchain**: Ethers.js integration, error handling

## 🐛 Troubleshooting

### Common Issues

#### Frontend Compilation Errors
- **React Version Mismatch**: Ensure React 18.2.0 compatibility
- **Ethers.js Version**: Use v5.7.2 for React Scripts compatibility
- **Missing Dependencies**: Run `npm install` after package.json changes

#### Backend Connection Issues
- **MongoDB Connection**: Verify database URI and network access
- **Port Conflicts**: Ensure port 5000 is available
- **Environment Variables**: Check .env file configuration

#### MetaMask Issues
- **Wallet Connection**: Ensure MetaMask extension is installed
- **Network Selection**: Connect to appropriate Ethereum network
- **Account Permissions**: Grant necessary permissions to the site

#### API Errors
- **404 Not Found**: Verify endpoint URLs and server status
- **401 Unauthorized**: Check JWT token validity and expiration
- **500 Server Error**: Review server logs for detailed error information

### Debugging Tips
- Use browser developer tools for frontend debugging
- Check server console logs for backend errors
- Verify API responses with Postman or similar tools
- Test blockchain interactions on test networks first

## 🚀 Future Enhancements

### Planned Features
- **Advanced Course Management**: Video lessons, quizzes, progress tracking
- **Student Dashboard**: Course enrollment, progress monitoring
- **Payment Integration**: Stripe/PayPal for course purchases
- **Certificate Verification**: Public verification portal
- **Mobile Application**: React Native mobile app
- **Analytics Dashboard**: Course performance metrics
- **Multi-language Support**: Internationalization features

### Technical Improvements
- **Performance Optimization**: Code splitting, lazy loading
- **Security Enhancements**: Rate limiting, input validation
- **Testing Coverage**: Unit tests, integration tests
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Error tracking, performance monitoring

### Blockchain Enhancements
- **Layer 2 Solutions**: Polygon, Arbitrum for lower fees
- **Smart Contract Upgrades**: Advanced certificate features
- **Decentralized Storage**: Enhanced IPFS integration
- **Cross-chain Support**: Multi-blockchain compatibility

## 📞 Support & Contributing

### Getting Help
- Check this documentation first
- Review troubleshooting section
- Check GitHub issues for known problems
- Contact development team for support

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Project Status
- **Current Version**: 1.0.0
- **Development Phase**: Active Development
- **Last Updated**: December 2024
- **Maintainers**: EduChain Development Team

---

**EduChain** - Revolutionizing education through blockchain technology 🎓⛓

*Built with ❤️ for the future of learning*





