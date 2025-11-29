# Vercel Deployment Guide

## Overview

FleetSync uses a **split deployment strategy**:
- **Frontend (Control Center)** → Vercel
- **API Server** → Railway, Render, or Fly.io

> [!WARNING]
> **The API cannot be deployed to Vercel** because it uses Socket.IO, which requires persistent WebSocket connections. Vercel's serverless functions don't support WebSockets.

## Current Configuration

### ✅ Root `vercel.json` (Frontend)
Located at the repository root, this file is correctly configured to deploy the Control Center:
- Builds `packages/control-center`
- Outputs to `packages/control-center/dist`
- Handles SPA routing (all routes redirect to `index.html`)

### ❌ API Deployment on Vercel
The API **should NOT** be deployed to Vercel. It is configured for Railway deployment (see `packages/api/RAILWAY_DEPLOYMENT.md`).

## Deployment Instructions

### Step 1: Deploy Frontend to Vercel

#### Option A: Using Vercel Dashboard

1. **Go to Vercel Dashboard** → [vercel.com/new](https://vercel.com/new)
2. **Import your GitHub repository**: `mdhdbr/FleetSync`
3. **Configure the project**:
   - **Project Name**: `fleetsync` (or your preferred name)
   - **Framework Preset**: `Other` or `Vite`
   - **Root Directory**: `./` (leave as root - **do not change**)
   - **Build Command**: Leave empty (vercel.json handles it)
   - **Output Directory**: Leave empty (vercel.json handles it)
   - **Install Command**: Leave empty (vercel.json handles it)
4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-api-url.railway.app
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```
5. **Click Deploy**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from repository root
vercel

# Follow prompts, use default settings
# The vercel.json will handle the build configuration
```

### Step 2: Deploy API to Railway

The API is already configured for Railway deployment. Follow the instructions in:
- [`packages/api/RAILWAY_DEPLOYMENT.md`](file:///c:/Users/Hameed/.gemini/antigravity/scratch/fleetsync/packages/api/RAILWAY_DEPLOYMENT.md)

**Quick Railway Deployment:**
1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub
3. Select the `mdhdbr/FleetSync` repository
4. Railway will auto-detect the configuration from `railway.json`
5. Set environment variables in Railway dashboard
6. Deploy

### Step 3: Update Frontend Environment

After deploying the API, update your Vercel environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Railway API URL (e.g., `https://fleetsync-api.railway.app`)
3. Redeploy the frontend

## Troubleshooting

### 404 Error on Vercel

**Cause**: You may have deployed the API to Vercel as a separate project, or the frontend is misconfigured.

**Solution**:
1. **Delete any API projects on Vercel** (e.g., `fleet-sync-api`)
   - Go to Vercel Dashboard → Project → Settings → General → Delete Project
2. **Ensure only ONE Vercel project exists** for the frontend
3. **Verify Root Directory** is set to `./` (root) in Vercel project settings
4. **Check Build Logs** in Vercel for any errors

### Routes Not Working (404 on Refresh)

**Cause**: SPA routing not configured properly.

**Solution**: The root `vercel.json` already has the correct routing configuration:
```json
{
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

If routes still don't work:
1. Verify `vercel.json` exists at repository root
2. Check Vercel deployment logs
3. Ensure `vite.config.js` has `base: '/'`

### API Not Connecting

**Cause**: Frontend is trying to connect to wrong API URL or API is not deployed.

**Solution**:
1. **Verify API is deployed** to Railway/Render/Fly.io
2. **Check API URL** in Vercel environment variables (`VITE_API_URL`)
3. **Test API health endpoint**: `https://your-api-url.com/health`
4. **Check CORS settings** in API to allow your Vercel domain

### Build Failing on Vercel

**Cause**: Missing dependencies or build configuration issues.

**Solution**:
1. **Check Vercel build logs** for specific errors
2. **Verify build works locally**:
   ```bash
   npm install
   cd packages/control-center
   npm run build
   ```
3. **Ensure all dependencies** are in `package.json` (not just devDependencies)
4. **Check Node.js version** - Vercel uses Node 18+ by default

## Environment Variables Reference

### Frontend (Vercel)
```env
VITE_API_URL=https://your-api-url.railway.app
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...your_token_here
```

### API (Railway/Render/Fly.io)
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your_secure_secret_here
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

## Verification Checklist

After deployment, verify:
- [ ] Frontend loads at Vercel URL
- [ ] All routes work (e.g., `/login`, `/dashboard`)
- [ ] No 404 errors when refreshing pages
- [ ] API health endpoint responds: `https://your-api-url.com/health`
- [ ] Frontend can connect to API
- [ ] Socket.IO connections work (check browser console)
- [ ] Map displays correctly (Mapbox token is valid)

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  GitHub Repository: mdhdbr/FleetSync           │
│                                                 │
└────────────┬────────────────────┬───────────────┘
             │                    │
             │                    │
    ┌────────▼────────┐  ┌────────▼────────┐
    │                 │  │                 │
    │  Vercel         │  │  Railway        │
    │  (Frontend)     │  │  (API + WS)     │
    │                 │  │                 │
    │  control-center │  │  Socket.IO      │
    │  React + Vite   │  │  Express        │
    │                 │  │                 │
    └────────┬────────┘  └────────┬────────┘
             │                    │
             │   HTTPS + WS       │
             └────────────────────┘
                  API Calls
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Socket.IO Deployment Guide](https://socket.io/docs/v4/deployment/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check Railway/API platform logs
3. Test API health endpoint
4. Verify environment variables are set correctly
5. Check browser console for errors
