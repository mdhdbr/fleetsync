# FleetSync On-Call Runbook

## System Overview
FleetSync is a unified fleet management platform consisting of:
- **Frontend**: React + Vite (Port 3000)
- **Backend**: Node.js + Express (Port 4000)
- **Database**: In-memory store (for POC)

## Quick Start
```bash
# Start all services
npm run dev
```

## Common Issues & Debugging

### 1. Login Failed
- **Symptoms**: User sees "Login Failed" or "Network Error".
- **Check**:
  - Is the API server running? (`curl http://localhost:4000/health`)
  - Are dependencies installed? (`npm install`)
  - Is the database seeded? (`npm run seed`)

### 2. Map Not Loading
- **Symptoms**: Map area is blank or gray.
- **Check**:
  - Verify `VITE_MAPBOX_TOKEN` in `packages/control-center/.env`.
  - Check browser console for API key errors.

### 3. Real-time Updates Not Working
- **Symptoms**: Vehicle positions or alerts not updating.
- **Check**:
  - Is Socket.IO connected? (Check browser console for "Socket connected").
  - Restart the API server to reset socket connections.

## Deployment
1. **Build**: `npm run build`
2. **Serve**:
   - Frontend: Serve `packages/control-center/dist`
   - Backend: Run `node packages/api/src/index.js`

## Emergency Contacts
- **Dev Team**: dev-team@fleetsync.com
- **Infra Team**: infra@fleetsync.com
