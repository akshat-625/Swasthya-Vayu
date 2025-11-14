# Deployment Guide - Swasthya Vayu

## Quick Deploy to Render (Full Stack)

### Option 1: Deploy via Render Dashboard

1. **Push your code to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy Backend (Flask)**
   - Go to https://render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Name: `swasthya-vayu-backend`
     - Environment: `Python 3`
     - Build Command: `cd backend && pip install -r requirements.txt && python train_model.py`
     - Start Command: `cd backend && gunicorn app:app`
     - Environment Variables:
       - `PYTHON_VERSION` = `3.11.0`
       - `WAQI_API_KEY` = `9839df5209c1c1bb441edf617c0b3ddcfc46ede4`
   - Click "Create Web Service"

3. **Deploy Frontend (React)**
   - Click "New +" → "Static Site"
   - Connect same GitHub repo
   - Settings:
     - Name: `swasthya-vayu-frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
     - Environment Variables:
       - `VITE_BACKEND_URL` = `YOUR_BACKEND_URL` (from step 2)
   - Click "Create Static Site"

### Option 2: Deploy via render.yaml (Blueprint)

1. **Push to GitHub** (same as above)

2. **Deploy using Blueprint**
   - Go to https://render.com/
   - Click "New +" → "Blueprint"
   - Connect your GitHub repo
   - Render will auto-detect `render.yaml` and deploy both services

### Option 3: Deploy to Vercel (Frontend) + Render (Backend)

**Backend (Render):**
Same as Option 1 - Backend steps

**Frontend (Vercel):**
```powershell
# Install Vercel CLI
npm i -g vercel

# Update backend URL
# Edit .env.production with your Render backend URL

# Deploy
vercel --prod
```

## Environment Variables

### Backend (.env or Render dashboard)
```
WAQI_API_KEY=9839df5209c1c1bb441edf617c0b3ddcfc46ede4
PORT=5000
```

### Frontend (.env.production)
```
VITE_SUPABASE_URL=https://empxkdwlnrrybyqmbnnk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcHhrZHdsbmJycnlieXFtYm5uayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ4OTczMjE2LCJleHAiOjIwNjQ1NDkyMTZ9.hK2RjOiqqG8pCsJoL6LImJTLMIH-hXQVsGJ1sxHQ53A
VITE_BACKEND_URL=YOUR_RENDER_BACKEND_URL
```

## Post-Deployment Steps

1. **Update Frontend API Calls**
   - Frontend will automatically use `VITE_BACKEND_URL` from .env.production
   - Vite proxy only works in development

2. **Test Your Deployment**
   - Visit frontend URL
   - Try logging in/signing up
   - Check AQI page functionality
   - Test VayuBot chatbot

3. **Update Supabase Database**
   - Run migration SQL in Supabase dashboard
   - Ensure tables are created

## Files Created for Deployment

- `render.yaml` - Render blueprint for both services
- `Procfile` - Heroku/Render process file
- `runtime.txt` - Python version specification
- `vercel.json` - Vercel configuration
- `netlify.toml` - Netlify configuration
- `.env.production` - Production environment variables

## Deployment URLs

After deployment, you'll have:
- Frontend: `https://swasthya-vayu.onrender.com` (or Vercel URL)
- Backend: `https://swasthya-vayu-backend.onrender.com`
- Database: Already hosted on Supabase

## Cost

- **Render Free Tier:** Both services free (with cold starts after 15 min inactivity)
- **Vercel Free Tier:** Frontend free (better performance)
- **Supabase Free Tier:** Already using

## Troubleshooting

**Backend not starting:**
- Check if `model.joblib` was created during build
- Verify Python version is 3.11
- Check build logs for errors

**Frontend 404 errors:**
- Ensure `vercel.json` or `netlify.toml` has rewrite rules
- Check if `dist` folder was created

**CORS errors:**
- Verify backend CORS is enabled
- Check frontend is using correct backend URL

**Database connection issues:**
- Verify Supabase credentials in frontend
- Check if tables exist in Supabase

---

**Ready to deploy! Choose your preferred platform and follow the steps above.**
