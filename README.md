# FleetSync 🚗

A comprehensive fleet management monorepo with real-time tracking, driver management, and analytics.

## 📦 Project Structure

```
fleetsync/
├── packages/
│   ├── control-center/    # React + Vite admin dashboard
│   ├── mobile/            # PWA driver application
│   └── api/               # Node.js + Express backend
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
└── package.json           # Monorepo root
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- Yarn package manager

### Installation

```bash
# Install all dependencies
yarn install

# Set up Husky hooks
yarn prepare
```

### Environment Setup

Copy the example environment files and configure them:

```bash
# Control Center
cp packages/control-center/.env.example packages/control-center/.env

# Mobile App
cp packages/mobile/.env.example packages/mobile/.env

# API
cp packages/api/.env.example packages/api/.env
```

**Important:** Add your Mapbox token to `packages/control-center/.env`:
```
VITE_MAPBOX_TOKEN=your_actual_mapbox_token
```

### Development

Start all packages concurrently:

```bash
yarn dev
```

This will start:
- **Control Center**: http://localhost:3000
- **Mobile App**: http://localhost:3001
- **API Server**: http://localhost:4000

### Individual Package Commands

```bash
# Control Center only
yarn workspace @fleetsync/control-center dev

# Mobile App only
yarn workspace @fleetsync/mobile dev

# API Server only
yarn workspace @fleetsync/api dev
```

## 📱 Applications

### Control Center (Admin Dashboard)

- **Landing Page** (`/`) - Marketing and feature overview
- **Login** (`/login`) - Authentication (demo: admin@fleetsync.com / password)
- **Dashboard** (`/dashboard`) - Protected route with:
  - Real-time vehicle tracking with Mapbox
  - Fleet statistics
  - Active vehicle list
  - Live telemetry updates via Socket.IO

**Tech Stack:**
- React 18
- Vite
- TailwindCSS
- Redux Toolkit
- React Router
- Mapbox GL JS
- Socket.IO Client
- Axios

### Mobile App (Driver PWA)

- **Driver App** (`/driver-app`) - Progressive Web App with:
  - Duty status toggle
  - Geolocation tracking
  - Real-time telemetry transmission
  - Trip statistics
  - Installable on mobile devices

**Tech Stack:**
- React 18
- Vite
- TailwindCSS
- Vite PWA Plugin
- Socket.IO Client
- Axios

### API Server

RESTful API with WebSocket support:

**Endpoints:**
- `GET /health` - Health check
- `POST /auth/login` - Mock authentication
- `GET /trips` - Get all trips
- `POST /trips` - Create new trip
- `POST /telemetry` - Receive telemetry data (broadcasts via Socket.IO)
- `GET /vehicles` - Get all vehicles

**Tech Stack:**
- Node.js
- Express
- Socket.IO
- CORS enabled

## 🗂️ Mock Data

Located in `packages/api/mock-data/data.json`:

- **Vehicles**: 2 sample vehicles (sedan in Riyadh, truck in Jeddah)
- **Drivers**: 1 sample driver (Ali, on duty)
- **Trips**: Empty array (ready for new trips)

## 🛠️ Development Tools

### Linting & Formatting

```bash
# Run ESLint on all packages
yarn lint

# Format all files with Prettier
yarn format
```

### Pre-commit Hooks

Husky is configured to run lint-staged on commit:
- Auto-fixes ESLint issues
- Formats code with Prettier
- Ensures code quality before commits

### Building

```bash
# Build all packages
yarn build

# Build specific package
yarn workspace @fleetsync/control-center build
yarn workspace @fleetsync/mobile build
```

## 🔄 CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR:

1. **Build & Test Job**
   - Tests on Node.js 18.x and 20.x
   - Runs ESLint
   - Builds all packages

2. **Build Control Center Job**
   - Builds production bundle

3. **Build Mobile Job**
   - Builds PWA production bundle

## 📋 Environment Variables

### Control Center (`.env`)
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_API_URL=http://localhost:4000
```

### Mobile App (`.env`)
```env
VITE_API_URL=http://localhost:4000
```

### API (`.env`)
```env
PORT=4000
NODE_ENV=development
```

## 🎨 Features

### Core Fleet Management
✅ Monorepo architecture with Yarn workspaces  
✅ Real-time vehicle tracking with Mapbox  
✅ WebSocket communication via Socket.IO  
✅ Redux Toolkit state management  
✅ Protected routes with authentication  
✅ Mock API with realistic data  

### Phase 7: WMS Integration & Dock Scheduler
✅ Warehouse Management System with inventory tracking  
✅ ASN (Advanced Shipping Notice) inbound processing  
✅ Dock slot booking with conflict detection  
✅ Multi-warehouse support with capacity management  

### Phase 8: Driver Mobile App (PWA)
✅ Progressive Web App for drivers  
✅ Availability toggle and job assignment  
✅ COA (Complete On Arrival) workflow  
✅ POD (Proof of Delivery) upload with photo & signature  
✅ Real-time job notifications via Socket.IO  

### Phase 9: Notifications, Alerts & Safety Rules
✅ Real-time alert engine with severity filtering  
✅ Speeding detection (>120 km/h triggers alert)  
✅ Driver fatigue rules (10+ hours blocks assignment)  
✅ Alert acknowledgment workflow  
✅ Socket.IO-based real-time alert broadcasting  

### Phase 10: Analytics Dashboards & Reports
✅ KPI dashboard (Active Vehicles, Trips, Dead KM, Utilization, Revenue/KM)  
✅ Interactive charts (Line, Bar, Pie) using Recharts  
✅ Profitability trend analysis  
✅ Hub throughput visualization  
✅ CSV export functionality for all reports  
✅ Report template system  

### Additional Features
✅ COA Engine with auto-assignment logic  
✅ Freight booking (LTL/FTL) with multiple truck types  
✅ Shipper portal with shipment tracking  
✅ ESLint + Prettier code quality  
✅ Husky pre-commit hooks  
✅ GitHub Actions CI/CD  
✅ TailwindCSS styling  
✅ Responsive design  

## 🚀 Deployment

FleetSync uses a **split deployment strategy** for optimal performance:

### Frontend (Control Center & Mobile)
**Platform**: Vercel  
**Why**: Optimized for static sites and serverless functions, excellent CDN, zero-config deployments

📖 **Deployment Guide**: See [VERCEL_FIX_GUIDE.md](VERCEL_FIX_GUIDE.md) for detailed instructions

**Quick Deploy to Vercel:**
1. Import repository to Vercel
2. Set root directory to `./`
3. Add environment variables:
   - `VITE_API_URL` - Your API URL (from Railway/Render)
   - `VITE_MAPBOX_TOKEN` - Your Mapbox token
4. Deploy (vercel.json handles build configuration)

### API Server
**Platform**: Railway, Render, or Fly.io  
**Why**: Supports WebSocket connections required for Socket.IO

📖 **Deployment Guide**: See [packages/api/RAILWAY_DEPLOYMENT.md](packages/api/RAILWAY_DEPLOYMENT.md)

> [!IMPORTANT]
> **The API cannot be deployed to Vercel** because it uses Socket.IO, which requires persistent WebSocket connections that Vercel's serverless functions don't support.

### Deployment Architecture
```
Frontend (Vercel) ←→ API (Railway/Render/Fly.io)
     ↓                        ↓
  HTTPS/CDN            WebSocket + REST
```


## 📝 License

Private - All rights reserved

## 🤝 Contributing

This is a private monorepo. For questions or contributions, please contact the team.

---

Built with ❤️ using React, Node.js, and modern web technologies
