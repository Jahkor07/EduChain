import mongoose from 'mongoose';

const platformConfigSchema = new mongoose.Schema({
  mintingFee: {
    type: Number,
    default: 0.001,
    required: true,
  },
  maxFileSize: {
    type: Number,
    default: 10, // in MB
    required: true,
  },
  allowedFileTypes: {
    type: [String],
    default: ['pdf', 'docx', 'txt'],
  },
  plagiarismThreshold: {
    type: Number,
    default: 15, // percentage
    required: true,
  },
  autoApproveEducators: {
    type: Boolean,
    default: false,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Ensure only one config document exists
platformConfigSchema.index({}, { unique: true });

const PlatformConfig = mongoose.model('PlatformConfig', platformConfigSchema);

export default PlatformConfig;










