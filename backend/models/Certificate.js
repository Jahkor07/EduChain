const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  educatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  educatorEmail: {
    type: String,
    required: true
  },
  
  // Certificate content
  imageLink: {
    type: String,
    required: false,
    default: ''
  },
  metadataLink: {
    type: String,
    required: false,
    default: ''
  },
  
  // NFT blockchain data
  nftTokenId: {
    type: String,
    unique: true,
    sparse: true
  },
  transactionHash: {
    type: String,
    unique: true,
    sparse: true
  },
  contractAddress: {
    type: String
  },
  
  // Certificate details
  status: {
    type: String,
    enum: ['pending', 'minted', 'failed'],
    default: 'pending'
  },
  grade: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  completionDate: {
    type: Date,
    default: Date.now
  },
  
  // IPFS and file data
  ipfsHash: {
    type: String
  },
  fileType: {
    type: String
  },
  fileSize: {
    type: Number
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
certificateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);


