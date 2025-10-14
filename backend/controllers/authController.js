import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT Payload
    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };

    // Sign token (make sure you have JWT_SECRET in your .env)
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // Send token and user info (without password)
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        surname: user.surname,
        walletAddress: user.walletAddress,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
