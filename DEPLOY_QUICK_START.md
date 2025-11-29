# 🚀 FleetSync Deployment Quick Reference

## 📋 Deployment Checklist

### Before You Start
- [ ] GitHub repository is accessible
- [ ] You have a Mapbox account and token
- [ ] You have Railway and Vercel accounts

---

## Part 1: Railway (API) ⚡

**Time**: ~15 minutes

1. **Deploy**
   - Go to [railway.app/new](https://railway.app/new)
   - Deploy from GitHub repo → Select FleetSync
   - Auto-deploys with `railway.json`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=4000
   JWT_SECRET=<generate-32-char-random-string>
   ALLOWED_ORIGINS=*
   ```

3. **Get API URL**
   - Settings → Domains → Copy URL
   - Example: `https://fleetsync-api.railway.app`

4. **Test**
   - Visit: `https://your-url.railway.app/health`
   - Should return: `{"status":"ok"}`

---

## Part 2: Vercel (Frontend) 🎨

**Time**: ~10 minutes

1. **Get Mapbox Token**
   - [mapbox.com](https://mapbox.com) → Account → Access Tokens
   - Copy public token (starts with `pk.`)

2. **Deploy**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import FleetSync repository
   - Framework: `Other` or `Vite`
   - Root Directory: `./`
   - Leave build commands empty (vercel.json handles it)

3. **Environment Variables**
   ```env
   VITE_API_URL=<your-railway-url>
   VITE_MAPBOX_TOKEN=<your-mapbox-token>
   ```

4. **Deploy**
   - Click Deploy
   - Wait 2-3 minutes
   - Copy Vercel URL

---

## Part 3: Update CORS 🔒

**Time**: ~2 minutes

1. Go to Railway → Variables
2. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,https://your-app-*.vercel.app
   ```
3. Auto-redeploys

---

## ✅ Verification

Visit your Vercel URL and check:

- [ ] Landing page loads
- [ ] Login works (`admin@fleetsync.com` / `password`)
- [ ] Dashboard displays
- [ ] Map shows correctly
- [ ] Vehicles appear on map
- [ ] No console errors (F12)
- [ ] Socket.IO connected (check console)

---

## 🔧 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Map not showing | Check `VITE_MAPBOX_TOKEN` in Vercel |
| API not connecting | Verify `VITE_API_URL` points to Railway |
| CORS errors | Update `ALLOWED_ORIGINS` in Railway |
| Socket.IO fails | Ensure API is on Railway (not Vercel) |
| 404 on refresh | Verify `vercel.json` exists at root |

---

## 📊 Your Deployment URLs

After deployment, record your URLs here:

```
Frontend (Vercel): https://_____________________.vercel.app
API (Railway):     https://_____________________.railway.app
```

---

## 💰 Cost

- **Railway**: $5 free credit/month
- **Vercel**: Free for personal projects
- **Mapbox**: 50,000 free map loads/month

---

## 📚 Full Documentation

- Detailed Guide: [`DEPLOYMENT_GUIDE.md`](file:///c:/Users/Hameed/.gemini/antigravity/scratch/fleetsync/DEPLOYMENT_GUIDE.md)
- Vercel Fix Guide: [`VERCEL_FIX_GUIDE.md`](file:///c:/Users/Hameed/.gemini/antigravity/scratch/fleetsync/VERCEL_FIX_GUIDE.md)
- Railway API Guide: [`packages/api/RAILWAY_DEPLOYMENT.md`](file:///c:/Users/Hameed/.gemini/antigravity/scratch/fleetsync/packages/api/RAILWAY_DEPLOYMENT.md)

---

**Ready to deploy? Start with Part 1! 🚀**
