const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate random class code
const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// GET /profile - Get full user profile (requires authentication)
router.get('/profile', auth, async (req, res) => {
  try {
    // Find user by ID and return all fields except password
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /profile - Update user profile (name, email, password)
router.patch('/profile', auth, async (req, res) => {
  try {
    const updates = {};
    const { name, email, password, oldPassword } = req.body;
    if (name) updates.name = name;
    if (email) updates.email = email;

    // Only update fields that are provided
    if (!name && !email && !password) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    // Password change logic
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({ error: 'oldPassword is required to change password.' });
      }
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Old password is incorrect.' });
      }
      user.password = password;
    }

    await user.save();

    // Return updated profile (excluding password)
    const userProfile = await User.findById(req.user._id).select('-password');
    res.json({ message: 'Profile updated successfully', user: userProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user account (student or teacher)
router.delete('/delete-user', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove user from classrooms (if student)
    if (user.role === 'student') {
      const Classroom = require('../models/Classroom');
      const Progress = require('../models/Progress');
      await Classroom.updateMany(
        { students: req.user._id },
        { $pull: { students: req.user._id } }
      );
      await Progress.deleteMany({ studentId: req.user._id });
    }
    // Delete all owned data (if teacher)
    if (user.role === 'teacher') {
      const Classroom = require('../models/Classroom');
      const Subject = require('../models/Subject');
      const Material = require('../models/Material');
      const Assignment = require('../models/Assignment');
      await Classroom.deleteMany({ teacherId: req.user._id });
      await Subject.deleteMany({ teacherId: req.user._id });
      await Material.deleteMany({ teacherId: req.user._id });
      await Assignment.deleteMany({ teacherId: req.user._id });
    }
    await user.deleteOne();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
