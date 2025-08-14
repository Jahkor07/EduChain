const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  metadata: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: false
  },
  studentId: {
    type: String,
    required: false
  },
  certificateType: {
    type: String,
    enum: ['course_completion', 'achievement', 'participation'],
    default: 'course_completion'
  },
  attributes: [{
    trait_type: String,
    value: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NFT', NFTSchema);


