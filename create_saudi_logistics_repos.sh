#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# ==============================================================
# create_saudi_logistics_repos.sh
# Creates three repos: backend (MERN), control-center (React/Vite), driver-app (static)
# Exits on error and prints verification steps.
# ==============================================================

ROOT_DIR="$(pwd)/saudi-logistics-projects-$(date +%s)"
echo "Creating project root at: $ROOT_DIR"
mkdir -p "$ROOT_DIR"
cd "$ROOT_DIR"

# Helper to write file safely
write_file() {
  local path="$1"; shift
  local content="$*"
  mkdir -p "$(dirname "$path")"
  cat > "$path" <<'EOF'
'"$content"'
EOF
}

# --- Pre-checks ---
echo "STEP 0 — running pre-checks..."
echo "Checking Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found. Install Node.js >= 18 and re-run."
  exit 1
fi
NODE_VER="$(node -v)"
echo "Node found: $NODE_VER"

echo "Checking npm..."
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found. Install npm and re-run."
  exit 1
fi
echo "npm: $(npm -v)"

echo "Checking git..."
if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git not found. Install git and re-run."
  exit 1
fi
echo "git: $(git --version)"

echo "Checking MongoDB (mongod)..."
if ! command -v mongod >/dev/null 2>&1 && ! command -v mongo >/dev/null 2>&1; then
  echo "WARNING: MongoDB command-line tools not found. If you plan to run backend locally, install MongoDB or use a cloud MongoDB (Atlas)."
else
  # try to connect (best-effort)
  if command -v mongo >/dev/null 2>&1; then
    if mongo --eval "db.getMongo()" >/dev/null 2>&1; then
      echo "MongoDB appears reachable locally."
    else
      echo "MongoDB CLI present but could not connect to default local instance. Ensure mongod is running."
    fi
  fi
fi

echo "Pre-checks done."
echo

# -----------------------
# Create backend repo
# -----------------------
echo "STEP 1 — creating backend repo..."
BACKEND_DIR="$ROOT_DIR/saudi-logistics-backend"
mkdir -p "$BACKEND_DIR"
cd "$BACKEND_DIR"

cat > package.json <<'JSON'
{
  "name": "saudi-logistics-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.5.0",
    "socket.io": "^4.7.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
JSON

cat > .env.example <<'ENV'
MONGO_URI=mongodb://localhost:27017/saudi_logistics
PORT=5000
JWT_SECRET=supersecret123
JWT_EXPIRES=7d
ENV

cat > server.js <<'JS'
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { initSocket } from './socket.js';
import vehicleRoutes from './routes/vehicles.routes.js';
import tripRoutes from './routes/trips.routes.js';
import authRoutes from './routes/auth.routes.js';
import fuelRoutes from './routes/fuel.routes.js';
import vendorRoutes from './routes/vendors.routes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/vendors', vendorRoutes);
app.get('/health', (req,res)=>res.json({ok:true, time: new Date().toISOString()}));
const server = http.createServer(app);
initSocket(server);
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/saudi_logistics';
mongoose.connect(MONGO)
  .then(()=> server.listen(PORT, ()=> console.log('Server running on', PORT)))
  .catch(err=> { console.error('MongoDB connection error', err); process.exit(1); });
JS

cat > socket.js <<'JS'
import { Server } from 'socket.io';
let io;
export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', socket => {
    console.log('Socket connected', socket.id);
    socket.on('vehicle:update', data => io.emit('vehicle:location', data));
    socket.on('trip:update', data => io.emit('trip:status', data));
    socket.on('fuel:request', data => io.emit('fuel:new', data));
    socket.on('disconnect', ()=> console.log('Socket disconnected', socket.id));
  });
};
export const getIO = ()=> io;
JS

# models
mkdir -p models
cat > models/vehicle.model.js <<'M'
import mongoose from 'mongoose';
const VehicleSchema = new mongoose.Schema({
  reg: {type:String, required:true, unique:true},
  type: String,
  category: String,
  capacity: String,
  crane: {type:Boolean, default:false},
  status: {type:String, default:'idle'},
  location: { lat:Number, lon:Number },
  lastSeen: Date,
  meta: mongoose.Schema.Types.Mixed
},{ timestamps:true });
export default mongoose.model('Vehicle', VehicleSchema);
M

cat > models/driver.model.js <<'M'
import mongoose from 'mongoose';
const DriverSchema = new mongoose.Schema({
  name:String, phone:String, licenseNo:String, licenseExp:Date,
  role:{type:String, default:'driver'}, assignedVehicleId:{type:mongoose.Schema.Types.ObjectId, ref:'Vehicle'},
  status:{type:String, default:'active'}, onboarding: mongoose.Schema.Types.Mixed, meta: mongoose.Schema.Types.Mixed
},{ timestamps:true });
export default mongoose.model('Driver', DriverSchema);
M

cat > models/trip.model.js <<'M'
import mongoose from 'mongoose';
const TripSchema = new mongoose.Schema({
  ref:String, vehicleId:{type:mongoose.Schema.Types.ObjectId, ref:'Vehicle'}, driverId:{type:mongoose.Schema.Types.ObjectId, ref:'Driver'},
  pickup: mongoose.Schema.Types.Mixed, dropoff: mongoose.Schema.Types.Mixed, status:{type:String, default:'created'}, load: mongoose.Schema.Types.Mixed, updates: [mongoose.Schema.Types.Mixed]
},{ timestamps:true });
export default mongoose.model('Trip', TripSchema);
M

cat > models/fuel.model.js <<'M'
import mongoose from 'mongoose';
const FuelSchema = new mongoose.Schema({
  ref:String, vehicleId:{type:mongoose.Schema.Types.ObjectId, ref:'Vehicle'}, driverId:{type:mongoose.Schema.Types.ObjectId, ref:'Driver'},
  location: mongoose.Schema.Types.Mixed, qtyLitres:Number, status:String, assignedVendorId:{type:mongoose.Schema.Types.ObjectId, ref:'Vendor'}
},{ timestamps:true });
export default mongoose.model('FuelRequest', FuelSchema);
M

cat > models/vendor.model.js <<'M'
import mongoose from 'mongoose';
const VendorSchema = new mongoose.Schema({
  name:String, type:String, contact:String, location: mongoose.Schema.Types.Mixed, rating:Number, active:Boolean, serviceZones:[mongoose.Schema.Types.Mixed]
},{ timestamps:true });
export default mongoose.model('Vendor', VendorSchema);
M

# controllers
mkdir -p controllers
cat > controllers/vehicles.controller.js <<'C'
import Vehicle from '../models/vehicle.model.js';
import { getIO } from '../socket.js';
export const list = async (req,res)=> res.json(await Vehicle.find().lean());
export const getById = async (req,res)=> { const v= await Vehicle.findById(req.params.id); if(!v) return res.status(404).json({message:'not found'}); res.json(v); };
export const create = async (req,res)=> { const rec = await Vehicle.create(req.body); getIO()?.emit('vehicle:created', rec); res.status(201).json(rec); };
export const update = async (req,res)=> { const rec = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {new:true}); if(!rec) return res.status(404).json({message:'not found'}); getIO()?.emit('vehicle:updated', rec); res.json(rec); };
export const remove = async (req,res)=> { await Vehicle.findByIdAndDelete(req.params.id); res.json({success:true}); };
C

cat > controllers/auth.controller.js <<'C'
import Driver from '../models/driver.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const register = async (req,res)=> {
  const {name, phone, password} = req.body;
  if(!phone || !password) return res.status(400).json({message:'phone+password required'});
  const hash = bcrypt.hashSync(password,10);
  const created = await Driver.create({name, phone, meta:{passwordHash:hash}});
  const token = jwt.sign({id:created._id, role:created.role}, JWT_SECRET);
  res.status(201).json({token, driver:created});
};
export const login = async (req,res)=> {
  const {phone,password} = req.body;
  const d = await Driver.findOne({phone});
  if(!d) return res.status(401).json({message:'invalid'});
  const ok = bcrypt.compareSync(password, d.meta?.passwordHash || '');
  if(!ok) return res.status(401).json({message:'invalid'});
  const token = jwt.sign({id:d._id, role:d.role}, JWT_SECRET);
  res.json({token, driver:d});
};
C

cat > controllers/trips.controller.js <<'C'
import Trip from '../models/trip.model.js';
import { getIO } from '../socket.js';
export const list = async (req,res)=> res.json(await Trip.find().lean());
export const create = async (req,res)=> { const t = await Trip.create(req.body); getIO()?.emit('trip:created', t); res.status(201).json(t); };
export const update = async (req,res)=> { const t = await Trip.findByIdAndUpdate(req.params.id, req.body, {new:true}); getIO()?.emit('trip:updated', t); res.json(t); };
C

cat > controllers/fuel.controller.js <<'C'
import Fuel from '../models/fuel.model.js';
import { getIO } from '../socket.js';
export const list = async (req,res)=> res.json(await Fuel.find().lean());
export const create = async (req,res)=> { const f = await Fuel.create(req.body); getIO()?.emit('fuel:new', f); res.status(201).json(f); };
export const update = async (req,res)=> { const f = await Fuel.findByIdAndUpdate(req.params.id, req.body, {new:true}); getIO()?.emit('fuel:updated', f); res.json(f); };
C

cat > controllers/vendors.controller.js <<'C'
import Vendor from '../models/vendor.model.js';
export const list = async (req,res)=> res.json(await Vendor.find().lean());
export const create = async (req,res)=> res.status(201).json(await Vendor.create(req.body));
C

# routes
mkdir -p routes
cat > routes/vehicles.routes.js <<'R'
import express from 'express';
import * as ctrl from '../controllers/vehicles.controller.js';
const router = express.Router();
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
export default router;
R

cat > routes/auth.routes.js <<'R'
import express from 'express';
import * as ctrl from '../controllers/auth.controller.js';
const router = express.Router();
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
export default router;
R

cat > routes/trips.routes.js <<'R'
import express from 'express';
import * as ctrl from '../controllers/trips.controller.js';
const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
export default router;
R

cat > routes/fuel.routes.js <<'R'
import express from 'express';
import * as ctrl from '../controllers/fuel.controller.js';
const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
export default router;
R

cat > routes/vendors.routes.js <<'R'
import express from 'express';
import * as ctrl from '../controllers/vendors.controller.js';
const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
export default router;
R

mkdir -p middleware
cat > middleware/auth.js <<'M'
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const protect = (req,res,next)=> {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({message:'no token'});
  const token = auth.split(' ')[1];
  try{ req.user = jwt.verify(token, JWT_SECRET); next(); }catch(e){ return res.status(401).json({message:'invalid'}); }
};
M

# README & git init
cat > README.md <<'R'
saudi-logistics-backend
MERN backend (express + mongoose + socket.io)
R

git init >/dev/null
git add -A >/dev/null
git commit -m "Initial backend scaffold" >/dev/null || true

echo "Installing backend npm deps (this may take a moment)..."
npm install --silent

# verify backend install
echo "Verifying backend by running a quick Node check..."
node -e "console.log('Node works, version: ' + process.version)"
echo "Backend created at $BACKEND_DIR"
cd "$ROOT_DIR"

# -----------------------
# Create control-center repo (React + Vite)
# -----------------------
echo
echo "STEP 2 — creating control-center (React + Vite) repo..."
CC_DIR="$ROOT_DIR/saudi-control-center"
mkdir -p "$CC_DIR"
cd "$CC_DIR"

cat > package.json <<'JSON'
{
  "name": "saudi-control-center",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
JSON

mkdir -p src
cat > index.html <<'HTML'
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Control Center</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HTML

cat > src/main.jsx <<'JS'
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
createRoot(document.getElementById('root')).render(<App />);
JS

cat > src/App.jsx <<'JS'
import React, {useEffect, useState} from 'react';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
export default function App(){
  const [vehicles, setVehicles] = useState([]);
  useEffect(()=> {
    socket.on('connect', ()=> console.log('socket connected', socket.id));
    socket.on('vehicle:created', v=> setVehicles(prev=>[v,...prev]));
    socket.on('vehicle:updated', v=> setVehicles(prev=> prev.map(x=> x._id===v._id? v : x)));
    return ()=> socket.disconnect();
  },[]);
  return (<div style={{padding:20,fontFamily:'Arial'}}><h1>Control Center</h1><div style={{display:'flex',gap:12}}><div style={{flex:1}}><h3>Vehicles</h3><ul>{vehicles.map(v=> <li key={v._id}>{v.reg} — {v.type}</li>)}</ul></div><div style={{width:400}}><h3>Map</h3><div style={{height:300,background:'#021017',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>Map placeholder</div></div></div></div>);
}
JS

cat > src/index.css <<'CSS'
body{margin:0;background:#061426;color:#e6eef6;}
CSS

cat > README.md <<'R'
saudi-control-center
React + Vite control center prototype
R

git init >/dev/null
git add -A >/dev/null
git commit -m "Initial control-center scaffold" >/dev/null || true

echo "Installing control-center npm deps..."
npm install --silent

cd "$ROOT_DIR"

# -----------------------
# Create driver app (static)
# -----------------------
echo
echo "STEP 3 — creating driver-app (static HTML)"
DA_DIR="$ROOT_DIR/saudi-driver-app"
mkdir -p "$DA_DIR"
cat > "$DA_DIR/index.html" <<'HTML'
<!doctype html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Driver App</title></head>
<body style="font-family:Arial;background:#0a0a0a;color:#fff;padding:16px">
  <h2>Driver App Prototype</h2>
  <div style="background:#111;padding:12px;border-radius:8px">
    <h3>Current Trip</h3>
    <p><b>Pickup:</b> Dammam Port Gate 3</p>
    <p><b>Drop:</b> Riyadh Yard</p>
    <button onclick="alert('Start trip')" style="padding:10px">Start Trip</button>
  </div>
</body>
</html>
HTML

cat > "$DA_DIR/README.md" <<'R'
saudi-driver-app
Static driver app prototype - open index.html in browser
R

# -----------------------
# Final verification & test runs
# -----------------------
echo
echo "All repos created under: $ROOT_DIR"
echo
echo "STEP 4 — quick verification (do these manually or run below commands)"

cat <<'VERIFY'

A) Backend (start & health-check)
---------------------------------
cd $BACKEND_DIR
# copy .env.example to .env and edit if needed
cp .env.example .env
# start backend (in a separate terminal)
npm run dev
# verify health:
curl http://localhost:5000/health

If the curl returns JSON { "ok": true }, backend is running and connected to MongoDB.

Common issues:
- MongoDB not running -> start mongod or update MONGO_URI in .env to a reachable DB
- Port in use -> change PORT in .env

B) Control Center (React)
-------------------------
cd $CC_DIR
npm run dev
# open the printed Vite URL (usually http://localhost:5173)

C) Driver App (static)
----------------------
cd $DA_DIR
# open index.html in browser directly, or serve via a static server:
npx serve . -l 3000
# then open http://localhost:3000

D) GitHub push
--------------
# create five GitHub repos (or one each) and push
cd $BACKEND_DIR
git remote add origin git@github.com:<your-username>/saudi-logistics-backend.git
git branch -M main
git push -u origin main

Repeat for control-center and driver-app.

VERIFY

echo
echo "SCRIPT COMPLETE. Follow the verification steps above."
echo "If any step fails, read the 'Common issues' notes above or paste the error here and I will guide you how to fix it."

exit 0
