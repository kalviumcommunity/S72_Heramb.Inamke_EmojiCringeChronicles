const validateEmojiCombo = (req, res, next) => {
    const { emojis, description } = req.body;

    // Validate emojis
    if (!emojis || typeof emojis !== 'string' || emojis.trim().length === 0) {
        return res.status(400).json({ error: 'Emojis field is required and must be a non-empty string' });
    }

    if (emojis.length > 50) {
        return res.status(400).json({ error: 'Emoji combination cannot be longer than 50 characters' });
    }

    // Check if string contains at least one emoji
    const emojiRegex = /\p{Emoji}/gu;
    if (!emojiRegex.test(emojis)) {
        return res.status(400).json({ error: 'Emoji combination must contain at least one emoji' });
    }

    // Validate description
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
    }

    if (description.length > 200) {
        return res.status(400).json({ error: 'Description cannot be longer than 200 characters' });
    }

    // If all validations pass, continue
    next();
};

const validateAuth = (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate username for registration
    if (username !== undefined) {
        if (typeof username !== 'string' || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }
        if (username.length > 30) {
            return res.status(400).json({ error: 'Username cannot be longer than 30 characters' });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return res.status(400).json({ error: 'Username can only contain letters, numbers, underscores, and hyphens' });
        }
    }

    // Validate email
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Validate password
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    if (password.length > 128) {
        return res.status(400).json({ error: 'Password cannot be longer than 128 characters' });
    }

    next();
};

module.exports = {
    validateEmojiCombo,
    validateAuth
};