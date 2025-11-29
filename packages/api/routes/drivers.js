import express from 'express';
const router = express.Router();

const drivers = [
  { id: 101, name: "John Driver", status: "active" },
  { id: 102, name: "Adam Driver", status: "active" }
];

router.get('/', (req, res) => {
  res.json(drivers);
});

export default router;
