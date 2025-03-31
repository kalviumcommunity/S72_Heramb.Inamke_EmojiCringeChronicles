const express = require("express");
const router = express.Router();
const EmojiCombo = require("./Models/emojiCombo.js");
const User = require("./Models/user.js");
const authMiddleware = require('./middleware/auth');
const { validateEmojiCombo } = require('./middleware/validation');

// Middleware to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new emoji combo (protected route)
router.post("/emoji-combos", authMiddleware, validateEmojiCombo, asyncHandler(async (req, res) => {
    const { emojis, description } = req.body;
    
    const newCombo = new EmojiCombo({
        emojis,
        description,
        userId: req.user.userId,
        username: req.user.username,
        created_by: req.user.userId
    });
    
    await newCombo.save();
    res.status(201).json(newCombo);
}));

// Get all emoji combos with pagination
router.get("/emoji-combos", asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const createdBy = req.query.createdBy;
    const skip = (page - 1) * limit;
    
    const query = createdBy ? { created_by: createdBy } : {};
    
    const [combos, total] = await Promise.all([
        EmojiCombo.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        EmojiCombo.countDocuments(query)
    ]);
    
    res.status(200).json({
        combos,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
}));

// Get all users
router.get("/users", asyncHandler(async (req, res) => {
    const users = await User.find({}, { username: 1, _id: 1 });
    res.status(200).json(users);
}));

// Get user's emoji combos
router.get("/my-emoji-combos", authMiddleware, asyncHandler(async (req, res) => {
    const combos = await EmojiCombo.find({ userId: req.user.userId })
        .sort({ createdAt: -1 });
    res.status(200).json(combos);
}));

// Get a single emoji combo by ID
router.get("/emoji-combos/:id", asyncHandler(async (req, res) => {
    const combo = await EmojiCombo.findById(req.params.id);
    if (!combo) {
        return res.status(404).json({ error: "Emoji combo not found" });
    }
    res.status(200).json(combo);
}));

// Update an emoji combo (protected route)
router.put("/emoji-combos/:id", authMiddleware, validateEmojiCombo, asyncHandler(async (req, res) => {
    const { emojis, description } = req.body;
    
    const combo = await EmojiCombo.findOne({
        _id: req.params.id,
        userId: req.user.userId
    });
    
    if (!combo) {
        return res.status(404).json({ error: "Emoji combo not found or unauthorized" });
    }
    
    if (emojis) combo.emojis = emojis;
    if (description) combo.description = description;
    
    await combo.save();
    res.status(200).json(combo);
}));

// Delete an emoji combo (protected route)
router.delete("/emoji-combos/:id", authMiddleware, asyncHandler(async (req, res) => {
    const combo = await EmojiCombo.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
    });
    
    if (!combo) {
        return res.status(404).json({ error: "Emoji combo not found or unauthorized" });
    }
    
    res.status(200).json({ message: "Emoji combo deleted successfully" });
}));

module.exports = router;