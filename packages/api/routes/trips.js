import express from 'express';
const router = express.Router();

let trips = [
  { id: 1, passenger: "Crew A", driverId: 101, status: "assigned" },
  { id: 2, passenger: "Crew B", driverId: null, status: "unassigned" }
];

router.get('/', (req, res) => {
  res.json(trips);
});

router.get('/driver/:driverId', (req, res) => {
  const driverTrips = trips.filter(t => t.driverId == req.params.driverId);
  res.json(driverTrips);
});

export default router;
