import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fleetsync-secret-key-change-in-production';

// Mock users for when MongoDB is not available
const MOCK_USERS = [
    {
        id: 'mock-admin-1',
        name: 'Admin User',
        email: 'admin@fleetsync.com',
        password: 'password123',
        role: 'admin',
    },
    {
        id: 'mock-dispatcher-1',
        name: 'Dispatcher Ali',
        email: 'dispatcher@fleetsync.com',
        password: 'password123',
        role: 'dispatcher',
    },
    {
        id: 'mock-driver-1',
        name: 'Driver Ahmed',
        email: 'ahmed@fleetsync.com',
        password: 'password123',
        role: 'driver',
    },
];

// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Register endpoint (mock)
router.post('/register', (req, res) => {
    res.status(501).json({ message: 'Registration not available in mock mode. Please use existing credentials.' });
});

// Profile endpoint (mock)
router.get('/profile', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = MOCK_USERS.find((u) => u.id === decoded.id);

        if (user) {
            res.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

export default router;
