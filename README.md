# FleetSync - Unified Ride-Hailing + Logistics Platform

A comprehensive fleet management system combining ride-hailing (RideSync) and logistics (LogiSync) operations with real-time tracking, analytics, and AI-powered optimization.

## 🚀 Project Structure

This is a **monorepo** containing multiple packages:

```
Fleet Sync/
├── packages/
│   ├── control-center/    # Main dashboard (Vite + React + TypeScript)
│   ├── api/              # Backend API (Node.js + Express)
│   └── shared/           # Shared utilities and types
├── package.json          # Root workspace configuration
└── vercel.json          # Vercel deployment configuration
```

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Mapping**: Leaflet.js, React Leaflet
- **Backend**: Node.js, Express (API package)
- **Build System**: npm workspaces

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install all workspace dependencies
npm install
```

### Running Locally

```bash
# Run control center (frontend) only
npm run start:ui

# Run API server only
npm run start:api

# Run both concurrently
npm run dev:all
```

### Building

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build --workspace=control-center
```

## 🌐 Deployment to Vercel

This project is configured for Vercel deployment with the following settings:

### Option 1: Using vercel.json (Recommended)

The `vercel.json` file is already configured. Simply:

1. Import the repository in Vercel
2. Vercel will automatically detect the configuration
3. Deploy!

### Option 2: Manual Configuration

If you prefer to configure manually in the Vercel dashboard:

1. **Root Directory**: Leave as `.` (root)
2. **Build Command**: `npm run build --workspace=control-center`
3. **Output Directory**: `packages/control-center/dist`
4. **Install Command**: `npm install`
5. **Development Command**: `npm run dev --workspace=control-center`

### Important Notes for Monorepo Deployment

- ✅ The `vercel.json` handles monorepo complexity automatically
- ✅ Build command targets only the `control-center` workspace
- ✅ Output directory points to the correct dist folder
- ✅ npm workspaces are properly supported

## 📋 Features

### Current Implementation
- ✅ Modern dark UI with glassmorphism design
- ✅ Interactive Saudi Arabia map with real-time tracking
- ✅ Weather and road conditions monitoring
- ✅ KPI dashboard with live metrics
- ✅ Vehicle status visualization
- ✅ Responsive design

### Planned Features
- 🔄 RideSync passenger booking interface
- 🔄 LogiSync truck booking and tracking
- 🔄 Advanced analytics and reporting
- 🔄 AI-powered route optimization
- 🔄 Driver management and safety monitoring
- 🔄 Mobile PWA applications

## 📄 License

Private - All rights reserved

## 👥 Author

**mdhdbr** - [GitHub](https://github.com/mdhdbr)

---

**Live Demo**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/mdhdbr/fleetsync)
