# Kafeed - Social Media Platform (MERN)

A modern, full-stack social networking application built with MongoDB, Express, React, and Node.js.

## Features

- User authentication (JWT)
- Create, view, and delete posts
- Like and comment on posts
- Follow/unfollow users
- Personalized feed
- Image uploads (Cloudinary)

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
4. Deploy!

### Backend (Render)
1. Create new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variables from `.env.example`
6. Deploy!

### Database
- Use MongoDB Atlas (already configured)
- Update `MONGODB_URI` in production environment variables

## Environment Variables

See `.env.example` files in backend and frontend directories.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express, JWT, bcrypt
- **Database**: MongoDB Atlas
- **Storage**: Base64 (local) or Cloudinary (production)
