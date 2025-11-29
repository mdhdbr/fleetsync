# Railway API Deployment Guide

This guide will help you deploy the FleetSync API to Railway.app, which supports WebSocket connections (Socket.IO) perfectly.

## Why Railway?

- ✅ **Free Tier**: $5 credit per month (enough for small projects)
- ✅ **WebSocket Support**: Perfect for Socket.IO
- ✅ **Easy Deployment**: Connect GitHub and auto-deploy
- ✅ **Environment Variables**: Easy to manage
- ✅ **Custom Domains**: Free SSL certificates

---

## Step-by-Step Deployment

### 1. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended)

### 2. Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your repository: **`mdhdbr/FleetSync`**

### 3. Configure the Service

After selecting the repo:

1. Railway will detect it's a Node.js project
2. Click on the service card to configure it
3. Go to **Settings** tab

#### Root Directory
- Click **"Root Directory"**
- Set to: `packages/api`
- Click **"Update"**

#### Build Settings
Railway auto-detects from `package.json`, but verify:
- **Build Command**: `npm install` (auto-detected)
- **Start Command**: `npm start` (auto-detected)

#### Environment Variables
Click **"Variables"** tab and add:

```
PORT=4000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CORS_ORIGIN=*
```

**Important**: Change `JWT_SECRET` to a secure random string!

### 4. Deploy

1. Click **"Deploy"** or push to your `master` branch
2. Railway will automatically build and deploy
3. Watch the deployment logs in the **"Deployments"** tab

### 5. Get Your API URL

1. Go to **Settings** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `https://your-app-name.up.railway.app`
5. **Copy this URL** - you'll need it for the frontend!

---

## Testing Your Deployment

### Test Health Endpoint

```bash
curl https://your-app-name.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-28T15:00:00.000Z"
}
```

### Test Socket.IO Connection

Open browser console on any page and run:
```javascript
const socket = io('https://your-app-name.up.railway.app');
socket.on('connect', () => console.log('Connected!'));
```

---

## Update Frontend to Use Railway API

### 1. Update Environment Variables

Edit `packages/control-center/.env`:

```env
VITE_API_URL=https://your-app-name.up.railway.app
VITE_SOCKET_URL=https://your-app-name.up.railway.app
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### 2. Rebuild Frontend

```bash
cd packages/control-center
npm run build
```

### 3. Redeploy Frontend to Vercel

The frontend will now connect to your Railway API!

---

## Monitoring & Logs

### View Logs
1. Go to your Railway project
2. Click on the service
3. Click **"Deployments"** tab
4. Click on the latest deployment
5. View real-time logs

### Metrics
1. Click **"Metrics"** tab
2. View CPU, Memory, Network usage

---

## Auto-Deployment

Railway automatically deploys when you push to `master`:

```bash
git add .
git commit -m "Update API"
git push origin master
```

Railway will:
1. Detect the push
2. Build the project
3. Deploy automatically
4. Zero downtime deployment

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `api.fleetsync.com`)
4. Add the CNAME record to your DNS provider:
   - **Type**: CNAME
   - **Name**: api (or your subdomain)
   - **Value**: Your Railway domain

Railway provides free SSL certificates automatically!

---

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
PORT=4000
```

### Production (Railway)
```env
NODE_ENV=production
PORT=$PORT  # Railway sets this automatically
JWT_SECRET=<secure-random-string>
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

---

## Troubleshooting

### Build Failing?

**Check Root Directory**:
- Must be set to `packages/api`
- Verify in Settings → Root Directory

**Check Dependencies**:
- Ensure all dependencies are in `package.json`
- No missing packages

**Check Logs**:
- View build logs in Deployments tab
- Look for specific error messages

### App Crashing?

**Check Environment Variables**:
- All required variables are set
- No typos in variable names

**Check Start Command**:
- Should be `npm start`
- Verify `package.json` has correct start script

**Check Port**:
- Use `process.env.PORT` (Railway sets this)
- Don't hardcode port number

### Socket.IO Not Working?

**Check CORS Settings**:
```javascript
const io = new Server(httpServer, {
    cors: {
        origin: '*',  // Or specific domain
        methods: ['GET', 'POST'],
    },
});
```

**Check Client Connection**:
```javascript
const socket = io('https://your-railway-url.up.railway.app', {
    transports: ['websocket', 'polling']
});
```

---

## Cost Estimation

Railway Free Tier:
- **$5 credit per month**
- **~500 hours** of runtime (if app uses minimal resources)
- **Perfect for development/testing**

For production:
- Monitor usage in Railway dashboard
- Upgrade to Hobby plan ($5/month) if needed
- Pay-as-you-go for additional usage

---

## Security Best Practices

### 1. Secure JWT Secret
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Restrict CORS
Update `src/index.js`:
```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.vercel.app',
    credentials: true
}));
```

### 3. Environment Variables
- Never commit `.env` files
- Use Railway's environment variables
- Rotate secrets regularly

---

## Next Steps

1. ✅ Deploy API to Railway
2. ✅ Get Railway API URL
3. ✅ Update frontend `.env` with Railway URL
4. ✅ Redeploy frontend to Vercel
5. ✅ Test end-to-end connection
6. ✅ Monitor logs and metrics

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

## Quick Reference

### Railway Dashboard URLs
- **Projects**: https://railway.app/dashboard
- **Account**: https://railway.app/account

### Useful Commands
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run locally with Railway env vars
railway run npm run dev
```

---

## Summary

Your API is now deployed on Railway with:
- ✅ WebSocket/Socket.IO support
- ✅ Auto-deployment from GitHub
- ✅ Free SSL certificate
- ✅ Environment variables configured
- ✅ Monitoring and logs

Your frontend on Vercel connects to Railway API for a complete full-stack deployment!
