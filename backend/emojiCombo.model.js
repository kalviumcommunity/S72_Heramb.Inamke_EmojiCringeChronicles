const mongoose = require("mongoose");

const emojiComboSchema = new mongoose.Schema({
  emojis: { type: String, required: true }, // Stores emoji combo as a string (e.g., "😂💀🤡")
  description: { type: String, required: true }, // Short description of the combo
  createdAt: { type: Date, default: Date.now } // Timestamp for when the combo was created
});

const EmojiCombo = mongoose.model("EmojiCombo", emojiComboSchema);

module.exports = EmojiCombo;
