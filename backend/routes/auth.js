const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const { validateAuth } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// Middleware to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Function to set consistent cookie options
const getCookieOptions = () => {
    return {
        httpOnly: true,
        secure: false, // Set to false for testing on localhost
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
    };
};

// Register new user
router.post('/register', validateAuth, asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({
            error: 'User with this email or username already exists'
        });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || 'fallback-jwt-secret-for-testing',
        { expiresIn: '24h' }
    );

    // Set cookie with token
    res.cookie('token', token, getCookieOptions());

    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}));

// Login user
router.post('/login', validateAuth, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
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
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || 'fallback-jwt-secret-for-testing',
        { expiresIn: '24h' }
    );

    // Set cookie with token
    res.cookie('token', token, getCookieOptions());

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}));

// Logout user
router.post('/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', getCookieOptions());

    res.json({ message: 'Logged out successfully' });
});

// Get current user's profile
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }
    });
}));

// Refresh token
router.post('/refresh-token', asyncHandler(async (req, res) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        // Verify token even if expired
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-jwt-secret-for-testing');
        } catch (error) {
            // Handle case where token is malformed or not a JWT
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            
            // For expired tokens, try to decode without verification
            try {
                decoded = jwt.decode(token);
                if (!decoded || !decoded.userId) {
                    return res.status(401).json({ error: 'Invalid token payload' });
                }
            } catch (decodeError) {
                return res.status(401).json({ error: 'Token cannot be decoded' });
            }
        }
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Generate a new JWT token
        const newToken = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback-jwt-secret-for-testing',
            { expiresIn: '24h' }
        );
        
        // Set cookie with the new token
        res.cookie('token', newToken, getCookieOptions());
        
        res.json({
            message: 'Token refreshed',
            token: newToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
}));

// Test route for JWT verification
router.get('/test-token', (req, res) => {
    try {
        // Log all cookies
        console.log('All cookies:', req.cookies);
        
        // Get token from cookies or authorization header
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            return res.status(401).json({ 
                error: 'No token provided',
                cookies: req.cookies,
                headers: req.headers
            });
        }
        
        // Get JWT secret
        const secret = process.env.JWT_SECRET || 'fallback-jwt-secret-for-testing';
        console.log('Using JWT secret:', secret.substring(0, 3) + '...');
        
        try {
            // Attempt to verify token
            const decoded = jwt.verify(token, secret);
            return res.json({ 
                success: true, 
                message: 'Token verified successfully',
                decoded
            });
        } catch (tokenError) {
            return res.status(401).json({
                error: 'Token verification failed',
                name: tokenError.name,
                message: tokenError.message,
                token: token.substring(0, 10) + '...',
                secret: secret.substring(0, 3) + '...'
            });
        }
    } catch (error) {
        console.error('Test token error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;