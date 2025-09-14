const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
  clearCart
} = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// Apply authentication middleware to all cart routes
router.use(auth);

// GET /api/cart/:userId - Get user's cart
router.get('/:userId', getCart);

// POST /api/cart/:userId - Add course to cart
router.post('/:userId', addToCart);

// PUT /api/cart/:userId/:courseId - Update course quantity in cart
router.put('/:userId/:courseId', updateCartItem);

// DELETE /api/cart/:userId/:courseId - Remove course from cart
router.delete('/:userId/:courseId', removeFromCart);

// POST /api/cart/checkout/:userId - Checkout cart (simulate payment)
router.post('/checkout/:userId', checkoutCart);

// DELETE /api/cart/:userId - Clear entire cart
router.delete('/:userId', clearCart);

module.exports = router;





