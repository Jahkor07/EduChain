const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId }).populate('userId', 'email firstName lastName');
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ 
        userId, 
        courses: [],
        totalPrice: 0 
      });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Add course to cart
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId, title, price, quantity = 1 } = req.body;

    // Validate required fields
    if (!courseId || !title || price === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: courseId, title, and price are required' 
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Validate price and quantity
    if (price < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Price cannot be negative' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ 
        userId, 
        courses: [],
        totalPrice: 0 
      });
    }

    // Check if course already exists in cart
    const existingCourseIndex = cart.courses.findIndex(course => course.courseId === courseId);
    
    if (existingCourseIndex > -1) {
      // Update quantity if course already exists
      cart.courses[existingCourseIndex].quantity += quantity;
    } else {
      // Add new course to cart
      cart.courses.push({
        courseId,
        title,
        price,
        quantity,
        addedAt: new Date()
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Course added to cart successfully',
      data: cart
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Remove course from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Remove course from cart
    const courseIndex = cart.courses.findIndex(course => course.courseId === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found in cart' 
      });
    }

    cart.courses.splice(courseIndex, 1);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Course removed from cart successfully',
      data: cart
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Update course quantity in cart
const updateCartItem = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { quantity } = req.body;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Find and update course quantity
    const courseIndex = cart.courses.findIndex(course => course.courseId === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found in cart' 
      });
    }

    cart.courses[courseIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Checkout cart
const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    if (cart.courses.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Simulate payment processing
    // In a real application, you would integrate with a payment gateway here
    const paymentSuccess = true; // Simulate successful payment

    if (paymentSuccess) {
      // Clear the cart after successful payment
      cart.courses = [];
      cart.totalPrice = 0;
      await cart.save();

      res.status(200).json({
        success: true,
        message: 'Checkout successful',
        data: {
          orderId: `ORDER_${Date.now()}`,
          totalAmount: cart.totalPrice,
          courses: cart.courses
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment failed' 
      });
    }

  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Clear the cart
    cart.courses = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
  clearCart
};