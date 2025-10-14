const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // Google Books API data
  googleBooksId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  title: {
    type: String,
    required: true
  },
  authors: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  publishedDate: {
    type: String,
    default: ''
  },
  pageCount: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  categories: [{
    type: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  previewLink: {
    type: String,
    default: ''
  },
  infoLink: {
    type: String,
    default: ''
  },
  
  // EduChain specific data
  educatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  educatorPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookSchema.index({ educatorId: 1, isActive: 1 });
bookSchema.index({ googleBooksId: 1 });
bookSchema.index({ title: 'text', authors: 'text', description: 'text' });

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Book', bookSchema);

