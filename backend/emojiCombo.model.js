const mongoose = require("mongoose");

const emojiComboSchema = new mongoose.Schema({
    emojis: { 
        type: String, 
        required: [true, 'Emoji combination is required'],
        trim: true,
        maxlength: [50, 'Emoji combination cannot be longer than 50 characters']
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [200, 'Description cannot be longer than 200 characters']
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true // Add index for sorting
    }
}, {
    timestamps: true, // Adds updatedAt field automatically
    toJSON: { virtuals: true }, // Enable virtuals when converting to JSON
    toObject: { virtuals: true }
});

// Add index for better query performance
emojiComboSchema.index({ createdAt: -1 });

// Virtual for emoji count
emojiComboSchema.virtual('emojiCount').get(function() {
    return Array.from(this.emojis.match(/\p{Emoji}/gu) || []).length;
});

// Pre-save middleware to validate emoji content
emojiComboSchema.pre('save', function(next) {
    if (!/\p{Emoji}/gu.test(this.emojis)) {
        next(new Error('Emoji combination must contain at least one emoji'));
    }
    next();
});

const EmojiCombo = mongoose.model("EmojiCombo", emojiComboSchema);

module.exports = EmojiCombo;