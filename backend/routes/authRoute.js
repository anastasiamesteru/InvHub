import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { verifyToken } from '../middleware/authMiddleware.js'; 
import 'dotenv/config';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving to the database (corrected)
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the number of salt rounds

    // Create the new user and save it to the database
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Send success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials: User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials: Password does not match' });
    }

    // Create a JWT token if login is successful
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login', error });
  }
});

// Validate Token Route (example for token validation)
router.post('/validate-token', verifyToken, (req, res) => {
  res.json({ message: 'Valid token', user: req.user });
});

export default router;
