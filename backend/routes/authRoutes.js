const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT (fallback if .env not set)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

// POST /login - authenticate admin user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username }); // debug log
        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token (expires in 1 hour)
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        // Respond with token and basic user info
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
