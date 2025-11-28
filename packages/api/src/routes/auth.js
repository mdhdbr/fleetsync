import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fleetsync_secret_key_2024';

// Mock Users
const USERS = [
    {
        id: 'u1',
        username: 'admin',
        password: 'pass',
        name: 'Admin User',
        role: 'admin',
        email: 'admin@fleetsync.com'
    },
    {
        id: 'u2',
        username: 'driver',
        password: 'pass',
        name: 'Ali Driver',
        role: 'driver',
        email: 'driver@fleetsync.com'
    }
];

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        // Create token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user info (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword,
            token
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Refresh endpoint (simple implementation)
router.post('/refresh', (req, res) => {
    // In a real app, we would verify a refresh token here
    // For POC, we'll just acknowledge the endpoint exists
    res.status(501).json({ message: 'Not implemented for POC' });
});

export default router;
