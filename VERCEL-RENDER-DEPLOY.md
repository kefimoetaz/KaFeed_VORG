# Deploy KaFeed: Vercel + Render (No GitHub)

## 🚀 Part 1: Backend on Render (10 minutes)

### Step 1: Prepare Backend Zip
1. Compress your `backend` folder into a zip file
2. Make sure `.env` is NOT included (it's in .gitignore)

### Step 2: Deploy on Render
1. Go to **https://render.com**
2. Sign up or login
3. Click **"New +"** → **"Web Service"**
4. Select **"Build and deploy from a Git repository"** OR **"Public Git repository"**
   - If you don't want to use Git, Render also supports manual uploads via their dashboard

### Step 3: Configure Service
- **Name**: `kafeed-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: main (if using Git)
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Instance Type**: Free

### Step 4: Environment Variables
Click **"Advanced"** or go to **"Environment"** tab and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kafeed
JWT_SECRET=your_super_secret_jwt_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. **COPY YOUR BACKEND URL** (e.g., `https://kafeed-backend.onrender.com`)

---

## 🎨 Part 2: Frontend on Vercel (5 minutes)

### Step 1: Update Environment Variable
1. Open `frontend/.env.production`
2. Replace with your actual Render backend URL:
   ```
   VITE_API_URL=https://kafeed-backend.onrender.com/api
   ```

### Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3: Deploy Frontend
```bash
cd frontend
vercel
```

### Step 4: Follow Prompts
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → kafeed (or your choice)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

### Step 5: Add Environment Variable
After first deployment, add the environment variable:

```bash
vercel env add VITE_API_URL
```
- **Value**: `https://kafeed-backend.onrender.com/api`
- **Environment**: Production

Then redeploy:
```bash
vercel --prod
```

### Step 6: Done!
Your app is live! Vercel will give you a URL like:
`https://kafeed.vercel.app`

---

## 📋 Alternative: Vercel Dashboard Upload

If you prefer not to use CLI:

1. Go to **https://vercel.com**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Third-Party Git Repository"** or drag your `frontend` folder
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://kafeed-backend.onrender.com/api`
6. Click **"Deploy"**

---

## ✅ Verification Checklist

### Backend (Render)
- [ ] Service is running (green status)
- [ ] All environment variables are set
- [ ] Can access: `https://your-backend.onrender.com/api/health` (if you have a health endpoint)

### Frontend (Vercel)
- [ ] Build succeeded
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Can access your site
- [ ] Can register/login
- [ ] Can create posts

---

## 🔧 Troubleshooting

### Backend Issues
- **503 Error**: Render free tier spins down after inactivity. First request takes 30-60 seconds
- **500 Error**: Check Render logs for errors
- **CORS Error**: Make sure your backend allows your Vercel domain

### Frontend Issues
- **API calls fail**: Check if `VITE_API_URL` is set correctly
- **Build fails**: Run `npm run build` locally first to check for errors
- **Blank page**: Check browser console for errors

---

## 💰 Cost
- **Render Free Tier**: 750 hours/month (enough for one service)
- **Vercel Free Tier**: Unlimited for personal projects
- **MongoDB Atlas**: Free tier (512MB)
- **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)

**Total: $0/month** 🎉

---

## 🔄 Updates

### Update Backend
1. Make changes locally
2. In Render dashboard, click **"Manual Deploy"** → **"Deploy latest commit"**
   OR upload new zip

### Update Frontend
```bash
cd frontend
vercel --prod
```

---

## 📱 Custom Domain (Optional)

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed

### Render
1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records
