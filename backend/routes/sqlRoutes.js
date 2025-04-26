const express = require("express");
const router = express.Router();
const { User, EmojiCombo, sequelize } = require("../Models/sqlModels");
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const { validateEmojiCombo } = require('../middleware/validation');

// Middleware to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Auth routes
// Register new user
router.post("/auth/register", asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
        where: {
            [Op.or]: [{ email }, { username }]
        }
    });
    
    if (existingUser) {
        return res.status(400).json({
            error: 'User with this email or username already exists'
        });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Set cookie with token
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
}));

// Login user
router.post("/auth/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Set cookie with token
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
}));

// Logout
router.post("/auth/logout", (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.json({ message: 'Logged out successfully' });
});

// Emoji Combo routes
// Create a new emoji combo
router.post("/emoji-combos", authMiddleware, validateEmojiCombo, asyncHandler(async (req, res) => {
    const { emojis, description } = req.body;
    
    const newCombo = await EmojiCombo.create({
        emojis,
        description,
        created_by: req.user.userId,
        username: req.user.username
    });
    
    res.status(201).json(newCombo);
}));

// Get all emoji combos with pagination
router.get("/emoji-combos", asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const createdBy = req.query.createdBy;
    const offset = (page - 1) * limit;
    
    const whereClause = createdBy ? { created_by: createdBy } : {};
    
    const { count, rows } = await EmojiCombo.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        offset,
        limit
    });
    
    res.status(200).json({
        combos: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count
    });
}));

// Get all users
router.get("/users", asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: ['id', 'username']
    });
    res.status(200).json(users);
}));

// Get user's emoji combos
router.get("/my-emoji-combos", authMiddleware, asyncHandler(async (req, res) => {
    const combos = await EmojiCombo.findAll({
        where: { created_by: req.user.userId },
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json(combos);
}));

// Get a single emoji combo by ID
router.get("/emoji-combos/:id", asyncHandler(async (req, res) => {
    const combo = await EmojiCombo.findByPk(req.params.id);
    if (!combo) {
        return res.status(404).json({ error: "Emoji combo not found" });
    }
    res.status(200).json(combo);
}));

// Update an emoji combo
router.put("/emoji-combos/:id", authMiddleware, validateEmojiCombo, asyncHandler(async (req, res) => {
    const { emojis, description } = req.body;
    
    const combo = await EmojiCombo.findOne({
        where: {
            id: req.params.id,
            created_by: req.user.userId
        }
    });
    
    if (!combo) {
        return res.status(404).json({ error: "Emoji combo not found or unauthorized" });
    }
    
    combo.emojis = emojis || combo.emojis;
    combo.description = description || combo.description;
    
    await combo.save();
    res.status(200).json(combo);
}));

// Delete an emoji combo
router.delete("/emoji-combos/:id", authMiddleware, asyncHandler(async (req, res) => {
    const numDeleted = await EmojiCombo.destroy({
        where: {
            id: req.params.id,
            created_by: req.user.userId
        }
    });
    
    if (numDeleted === 0) {
        return res.status(404).json({ error: "Emoji combo not found or unauthorized" });
    }
    
    res.status(200).json({ message: "Emoji combo deleted successfully" });
}));

// Get emoji combos by user
router.get("/user/:userId/emoji-combos", asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    const combos = await EmojiCombo.findAll({
        where: { created_by: userId },
        order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
        user: {
            id: user.id,
            username: user.username
        },
        combos
    });
}));

module.exports = router; 