import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ipfsHash: {
    type: String,
  },
  metadataUri: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  forSale: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['certificate', 'course', 'achievement', 'other'],
    default: 'certificate',
  },
  plagiarismScore: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  removedAt: {
    type: Date,
  },
  removalReason: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
nftSchema.index({ tokenId: 1 });
nftSchema.index({ owner: 1 });
nftSchema.index({ creator: 1 });
nftSchema.index({ forSale: 1, removed: 0 });

const NFT = mongoose.model('NFT', nftSchema);

export default NFT;
