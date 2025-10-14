import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['plagiarism', 'inappropriate', 'spam', 'fraud', 'other'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending',
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reportedItem: {
    itemType: {
      type: String,
      enum: ['nft', 'user', 'content', 'other'],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  resolution: {
    type: String,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ reportedUser: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;










