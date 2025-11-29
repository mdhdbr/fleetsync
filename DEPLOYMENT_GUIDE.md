# 🚀 FleetSync Deployment Guide

## Quick Start Deployment

Follow these steps to deploy FleetSync to production:

---

## Part 1: Deploy API to Railway (15 minutes)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for easy repo access)

### Step 2: Deploy API
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your **FleetSync** repository
3. Railway will auto-detect the `railway.json` configuration
4. Click **"Deploy"**

### Step 3: Configure Environment Variables
1. In Railway dashboard, go to your project
2. Click **"Variables"** tab
3. Add the following variables:

```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your_secure_random_string_here_min_32_chars
ALLOWED_ORIGINS=*
```

> **Note**: We'll update `ALLOWED_ORIGINS` after deploying the frontend

4. Click **"Deploy"** to apply changes

### Step 4: Get Your API URL
1. In Railway dashboard, click **"Settings"** tab
2. Under **"Domains"**, you'll see your Railway URL
3. Copy it (e.g., `https://fleetsync-api-production.up.railway.app`)
4. **Save this URL** - you'll need it for Vercel!

### Step 5: Test API
Open your browser and visit:
```
https://your-railway-url.railway.app/health
```

You should see: `{"status":"ok"}`

✅ **API Deployed Successfully!**

---

## Part 2: Deploy Frontend to Vercel (10 minutes)

### Step 1: Get Mapbox Token
1. Go to [mapbox.com](https://mapbox.com)
2. Sign up or log in
3. Go to **Account** → **Access Tokens**
4. Copy your **Default Public Token** (starts with `pk.`)

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 3: Import Repository
1. Click **"Add New..."** → **"Project"**
2. Import your **FleetSync** repository
3. Click **"Import"**

### Step 4: Configure Project
1. **Project Name**: `fleetsync` (or your preference)
2. **Framework Preset**: Select `Other` or `Vite`
3. **Root Directory**: Leave as `./` (root)
4. **Build Command**: Leave empty
5. **Output Directory**: Leave empty
6. **Install Command**: Leave empty

> The `vercel.json` file at the root will handle all build configuration automatically!

### Step 5: Add Environment Variables
Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your Railway URL from Part 1 (e.g., `https://fleetsync-api-production.up.railway.app`) |
| `VITE_MAPBOX_TOKEN` | Your Mapbox token from Step 1 (starts with `pk.`) |

### Step 6: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Copy your Vercel URL (e.g., `https://fleetsync.vercel.app`)

✅ **Frontend Deployed Successfully!**

---

## Part 3: Update CORS Settings (2 minutes)

Now that you have your Vercel URL, update the API's CORS settings:

1. Go back to **Railway Dashboard**
2. Click **"Variables"** tab
3. Update `ALLOWED_ORIGINS` to:
   ```
   https://your-vercel-app.vercel.app,https://your-vercel-app-*.vercel.app
   ```
   Replace `your-vercel-app` with your actual Vercel project name

4. Railway will automatically redeploy

---

## Part 4: Verify Deployment (5 minutes)

### Test Checklist

Visit your Vercel URL and check:

- [ ] **Landing page loads** - No errors
- [ ] **Login page** (`/login`) - Loads correctly
- [ ] **Login works** - Use `admin@fleetsync.com` / `password`
- [ ] **Dashboard loads** (`/dashboard`) - Redirects after login
- [ ] **Map displays** - Mapbox map shows correctly
- [ ] **Vehicles appear** - Vehicle markers on map
- [ ] **No console errors** - Open browser DevTools (F12)

### Check Socket.IO Connection

1. Open browser **DevTools** (F12)
2. Go to **Console** tab
3. Look for: `Socket.IO connected` or similar message
4. Should see no WebSocket errors

### Check API Connection

In browser console, run:
```javascript
fetch('https://your-railway-url.railway.app/vehicles')
  .then(r => r.json())
  .then(console.log)
```

Should return array of vehicles.

---

## 🎉 Deployment Complete!

Your FleetSync application is now live:

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-api.railway.app`

---

## Troubleshooting

### Issue: Map Not Showing
- **Fix**: Check `VITE_MAPBOX_TOKEN` in Vercel environment variables
- Verify token is valid at mapbox.com

### Issue: API Not Connecting
- **Fix**: Check `VITE_API_URL` in Vercel points to Railway URL
- Verify Railway API is running (visit `/health` endpoint)

### Issue: CORS Errors
- **Fix**: Update `ALLOWED_ORIGINS` in Railway to include Vercel domain
- Format: `https://your-app.vercel.app,https://your-app-*.vercel.app`

### Issue: Socket.IO Not Working
- **Fix**: Ensure Railway is running (not Vercel for API)
- Check browser console for WebSocket errors
- Verify `VITE_API_URL` is correct

### Issue: 404 on Page Refresh
- **Fix**: Verify `vercel.json` exists at repository root
- Should have SPA routing configuration

---

## Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update `ALLOWED_ORIGINS` in Railway

2. **Monitoring**
   - Railway: Check logs in dashboard
   - Vercel: Monitor function logs

3. **Database** (Future)
   - Add PostgreSQL in Railway
   - Update API to use database instead of mock data

4. **CI/CD**
   - GitHub Actions already configured
   - Auto-deploys on push to main branch

---

## Cost Estimate

### Free Tier (Getting Started)
- **Railway**: $5 free credit/month (enough for small apps)
- **Vercel**: Free for personal projects
- **Mapbox**: 50,000 free map loads/month

### Paid Plans (If Needed)
- **Railway**: $5/month minimum, pay-as-you-go
- **Vercel**: $20/month Pro plan
- **Mapbox**: $0.50 per 1,000 loads after free tier

---

## Support

If you encounter issues:
1. Check Railway logs: Dashboard → Deployments → Logs
2. Check Vercel logs: Dashboard → Deployments → Function Logs
3. Review browser console for errors
4. Verify all environment variables are set correctly

---

**Happy Deploying! 🚀**
