const express = require("express");
const router = express.Router();
const EmojiCombo = require("./emojiCombo.model");

// Create a new emoji combo
router.post("/emoji-combos", async (req, res) => {
  try {
    const { emojis, description } = req.body;
    const newCombo = new EmojiCombo({ emojis, description });
    await newCombo.save();
    res.status(201).json(newCombo);
  } catch (error) {
    res.status(500).json({ error: "Error adding emoji combo" });
  }
});

// Get all emoji combos
router.get("/emoji-combos", async (req, res) => {
  try {
    const combos = await EmojiCombo.find();
    res.status(200).json(combos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching emoji combos" });
  }
});

// Get a single emoji combo by ID
router.get("/emoji-combos/:id", async (req, res) => {
  try {
    const combo = await EmojiCombo.findById(req.params.id);
    if (!combo) return res.status(404).json({ error: "Emoji combo not found" });
    res.status(200).json(combo);
  } catch (error) {
    res.status(500).json({ error: "Error fetching emoji combo" });
  }
});

// Update an emoji combo
router.put("/emoji-combos/:id", async (req, res) => {
  try {
    const updatedCombo = await EmojiCombo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCombo) return res.status(404).json({ error: "Emoji combo not found" });
    res.status(200).json(updatedCombo);
  } catch (error) {
    res.status(500).json({ error: "Error updating emoji combo" });
  }
});

// Delete an emoji combo
router.delete("/emoji-combos/:id", async (req, res) => {
  try {
    const deletedCombo = await EmojiCombo.findByIdAndDelete(req.params.id);
    if (!deletedCombo) return res.status(404).json({ error: "Emoji combo not found" });
    res.status(200).json({ message: "Emoji combo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting emoji combo" });
  }
});

module.exports = router;
