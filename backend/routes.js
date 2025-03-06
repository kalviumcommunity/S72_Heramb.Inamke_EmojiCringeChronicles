const express = require("express");
const router = express.Router();
const EmojiCombo = require("./Models/emojiCombo.js");

// Middleware to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new emoji combo
router.post("/emoji-combos", asyncHandler(async (req, res) => {
    const { emojis, description } = req.body;
    
    if (!emojis || !description) {
        return res.status(400).json({ error: "Emojis and description are required" });
    }
    
    const newCombo = new EmojiCombo({ emojis, description });
    await newCombo.save();
    res.status(201).json(newCombo);
}));

// Get all emoji combos with pagination
router.get("/emoji-combos", asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [combos, total] = await Promise.all([
        EmojiCombo.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        EmojiCombo.countDocuments()
    ]);
    
    res.status(200).json({
        combos,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
}));

// Get a single emoji combo by ID
router.get("/emoji-combos/:id", asyncHandler(async (req, res) => {
    const combo = await EmojiCombo.findById(req.params.id);
    if (!combo) {
        return res.status(404).json({ error: "Emoji combo not found" });
    }
    res.status(200).json(combo);
}));

// Update an emoji combo
router.put("/emoji-combos/:id", asyncHandler(async (req, res) => {
    const { emojis, description } = req.body;
    
    if (!emojis && !description) {
        return res.status(400).json({ error: "At least one field to update is required" });
    }
    
    const updatedCombo = await EmojiCombo.findByIdAndUpdate(
        req.params.id,
        { $set: { emojis, description } },
        { new: true, runValidators: true }
    );
    
    if (!updatedCombo) {
        return res.status(404).json({ error: "Emoji combo not found" });
    }
    
    res.status(200).json(updatedCombo);
}));

// Delete an emoji combo
router.delete("/emoji-combos/:id", asyncHandler(async (req, res) => {
    const deletedCombo = await EmojiCombo.findByIdAndDelete(req.params.id);
    if (!deletedCombo) {
        return res.status(404).json({ error: "Emoji combo not found" });
    }
    res.status(200).json({ message: "Emoji combo deleted successfully" });
}));

module.exports = router;