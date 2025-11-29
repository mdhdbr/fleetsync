import express from 'express';
const router = express.Router();

const users = [
  { id: 1, username: 'dispatcher', password: '1234', role: 'dispatcher' },
  { id: 2, username: 'driver1', password: '1234', role: 'driver', driverId: 101 }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    driverId: user.driverId || null
  });
});

export default router;
