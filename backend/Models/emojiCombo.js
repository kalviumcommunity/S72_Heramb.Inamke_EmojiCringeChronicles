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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

emojiComboSchema.index({ createdAt: -1 });

emojiComboSchema.virtual('emojiCount').get(function() {
    return Array.from(this.emojis.match(/\p{Emoji}/gu) || []).length;
});

emojiComboSchema.pre('save', function(next) {
    if (!/\p{Emoji}/gu.test(this.emojis)) {
        next(new Error('Emoji combination must contain at least one emoji'));
    }
    next();
});

const EmojiCombo = mongoose.model("EmojiCombo", emojiComboSchema);

module.exports = EmojiCombo;