const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  courses: [{
    courseId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalPrice: {
    type: Number,
    default: 0
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

// Update totalPrice before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.courses.reduce((total, course) => total + (course.price * course.quantity), 0);
  this.updatedAt = Date.now();
  next();
});

// Update totalPrice before updating
cartSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.courses) {
    update.totalPrice = update.courses.reduce((total, course) => total + (course.price * course.quantity), 0);
  }
  update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);







