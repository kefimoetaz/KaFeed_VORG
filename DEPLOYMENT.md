# Deploy KaFeed Without GitHub

## Option 1: Railway (Recommended - Easiest)

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Login
```bash
railway login
```

### Deploy Backend
```bash
cd backend
railway init
railway up
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set CLOUDINARY_CLOUD_NAME="your_cloud_name"
railway variables set CLOUDINARY_API_KEY="your_api_key"
railway variables set CLOUDINARY_API_SECRET="your_api_secret"
```

### Deploy Frontend
```bash
cd ../frontend
railway init
railway up
railway variables set VITE_API_URL="your_backend_url"
```

---

## Option 2: Render (Web Dashboard)

### Backend
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Choose "Deploy from local folder" or use their CLI
4. Upload your `backend` folder
5. Set environment variables in dashboard
6. Deploy

### Frontend
1. Click "New +" → "Static Site"
2. Upload your `frontend` folder
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

---

## Option 3: Vercel (Frontend) + Render (Backend)

### Backend on Render
Same as Option 2

### Frontend on Vercel
```bash
cd frontend
npm i -g vercel
vercel
# Follow prompts
# Add environment variable when asked: VITE_API_URL
```

---

## Quick Start - Railway (5 minutes)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Deploy Backend:
   ```bash
   cd backend
   railway init
   railway up
   ```

4. Set Backend Variables (in Railway dashboard or CLI):
   - MONGODB_URI
   - JWT_SECRET
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - PORT=5000

5. Get Backend URL from Railway dashboard

6. Deploy Frontend:
   ```bash
   cd ../frontend
   railway init
   railway up
   ```

7. Set Frontend Variable:
   - VITE_API_URL=your_backend_url

Done! Your app is live.
