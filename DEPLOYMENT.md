# 🚀 Deployment Guide - Cloud Drive

## ✅ Step 1: Code Pushed to GitHub ✓

**Repository:** https://github.com/Anil2995/cloud-drive

---

## 📦 Step 2: Deploy Frontend to Vercel

### Go to Vercel
1. Visit: https://vercel.com/siddem-anil-kumars-projects
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**

### Import Repository
4. Find **"Anil2995/cloud-drive"**
5. Click **"Import"**

### Configure Project
6. **Root Directory:** `client`
7. **Framework Preset:** Next.js (auto-detected)
8. **Build Command:** `npm run build`
9. **Output Directory:** `.next`

### Add Environment Variable
10. Click **"Environment Variables"**
11. Add variable:
    - **Name:** `NEXT_PUBLIC_API_URL`
    - **Value:** Leave blank for now (add after backend deployment)

### Deploy
12. Click **"Deploy"**
13. Wait 2-3 minutes for build
14. **Copy your Vercel URL** (like: `https://cloud-drive-xxx.vercel.app`)

---

## ⚙️ Step 3: Deploy Backend to Render

### Go to Render
1. Visit: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**

### Connect Repository
3. Click **"Connect account"** (if needed to connect GitHub)
4. Find and select **"Anil2995/cloud-drive"**
5. Click **"Connect"**

### Configure Service
6. **Name:** `cloud-drive-api`
7. **Root Directory:** `server`
8. **Runtime:** Node
9. **Build Command:** `npm install && npm run build`
10. **Start Command:** `npm start`
11. **Instance Type:** Free

### Add Environment Variables
12. Click **"Advanced"** → **"Add Environment Variable"**
13. Add ALL these variables:

```
PORT=10000
NODE_ENV=production
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret_32chars
REFRESH_SECRET=your_refresh_secret_32chars
CORS_ORIGIN=https://your-vercel-url.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=drive
```

**Important Notes:**
- Use the **same values** from your local `server/.env` file
- Replace `CORS_ORIGIN` with your Vercel URL from Step 2
- Keep `PORT=10000` (Render's default)

### Deploy
14. Click **"Create Web Service"**
15. Wait 5-10 minutes for first deploy
16. **Copy your Render URL** (like: `https://cloud-drive-api.onrender.com`)

---

## 🔗 Step 4: Update Frontend with Backend URL

### Update Vercel
1. Go back to your Vercel dashboard
2. Click on your **cloud-drive** project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-render-url.onrender.com/api`
   - (Replace with your actual Render URL)
5. Click **"Save"**

### Redeploy Frontend
6. Go to **Deployments** tab
7. Click on the latest deployment
8. Click **"Redeploy"**
9. Wait 2 minutes

---

## ✅ Step 5: Test Your Live Application!

1. **Open your Vercel URL:** `https://cloud-drive-xxx.vercel.app`
2. **Sign up** for a new account
3. **Test features:**
   - Create a folder ✓
   - Upload a file ✓
   - Search ✓
   - Share ✓

---

## 🎉 Your App is LIVE!

**Frontend:** https://cloud-drive-xxx.vercel.app  
**Backend:** https://cloud-drive-api.onrender.com  
**GitHub:** https://github.com/Anil2995/cloud-drive

---

## 🐛 Troubleshooting

### Frontend shows "Failed to fetch"
- Check if backend URL is correct in Vercel env variables
- Make sure CORS_ORIGIN in backend matches your Vercel URL
- Check Render backend logs for errors

### Backend won't deploy
- Check all environment variables are set correctly
- Verify DATABASE_URL has password URL-encoded
- Check Render build logs for errors

### Files won't upload
- Verify SUPABASE_SERVICE_ROLE_KEY is correct in Render
- Check storage bucket policies in Supabase
- Ensure bucket name is exactly `drive`

---

**Need help?** Check the logs:
- **Vercel logs:** Project → Deployments → Click deployment → "Runtime Logs"
- **Render logs:** Service → Logs tab

---

**🎊 Congratulations on deploying your Cloud Drive!**
