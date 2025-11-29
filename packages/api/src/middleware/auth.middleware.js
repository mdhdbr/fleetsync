import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fleetsync-secret-key-change-in-production';

// Verify JWT token
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

// Check if user has required role
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required roles: ${roles.join(', ')}`,
            });
        }

        next();
    };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = decoded;
            } catch (error) {
                // Token invalid, but continue without auth
            }
        }

        next();
    } catch (error) {
        next();
    }
};
