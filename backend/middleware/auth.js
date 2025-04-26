const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Debug logs
        console.log('Auth middleware - Cookies:', req.cookies);
        console.log('Auth middleware - Authorization header:', req.headers.authorization);
        
        // Check for token in cookies first
        let token = req.cookies.token;
        
        // If not in cookies, check authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            console.log('Auth middleware - No token found');
            return res.status(401).json({ error: 'Authentication required' });
        }

        console.log('Auth middleware - Token found, verifying with secret:', 
            process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 3)}...` : 'using fallback');
        
        try {
            const jwtSecret = process.env.JWT_SECRET || 'fallback-jwt-secret-for-testing';
            const decoded = jwt.verify(token, jwtSecret);
            console.log('Auth middleware - Token verified successfully');
            req.user = decoded;
            next();
        } catch (tokenError) {
            // Handle different token verification errors
            console.log('Auth middleware - Token verification error:', tokenError.name, tokenError.message);
            if (tokenError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
            } else if (tokenError instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
            } else {
                return res.status(401).json({ error: 'Authentication failed', code: 'AUTH_FAILED' });
            }
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;