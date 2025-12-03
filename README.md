# ✨ KaFeed - Premium Social Media Platform

<div align="center">

![KaFeed](https://img.shields.io/badge/KaFeed-Social%20Media-purple?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-blue?style=for-the-badge)

A modern, feature-rich social networking application with **premium UX**, **mobile-first design**, and **engaging interactions**.

[Live Demo](#) | [Documentation](#documentation) | [Features](#features)

</div>

---

## 🎯 What Makes KaFeed Special

- 🎨 **Premium UX** - Smooth animations, beautiful gradients, professional polish
- 📱 **Mobile First** - Perfect experience on all devices
- ⚡ **Lightning Fast** - Optimized performance, instant interactions
- 🎭 **Engaging** - Reactions, mentions, hashtags, and more
- 🔒 **Secure** - JWT authentication, rate limiting, input validation

---

## ✨ Features

### 🎉 Social Interactions
- **6 Reaction Types** - Like, Love, Laugh, Wow, Sad, Angry (like Facebook)
- **@Mentions** - Tag users in posts and comments
- **#Hashtags** - Organize and discover content
- **Comments** - Threaded discussions
- **Repost** - Share posts to your profile
- **Bookmarks** - Save posts for later

### 👤 User Features
- **Authentication** - Secure JWT-based login/register
- **Profiles** - Customizable with bio and avatar
- **Follow System** - Follow/unfollow users
- **Personalized Feed** - See posts from people you follow
- **Explore** - Discover new content and users
- **Real-time Search** - Find users instantly with autocomplete

### 📸 Content
- **Rich Posts** - Text + images
- **Stories** - 24-hour temporary posts
- **Image Upload** - Cloudinary integration with compression
- **Image Lightbox** - Full-screen image viewing
- **Direct Messages** - Private conversations

### 🎨 Premium UX
- **Smooth Animations** - Float, pulse-glow, bounce-in, slide-up
- **Loading Skeletons** - Beautiful loading states
- **Empty States** - Engaging empty screens
- **Confirmation Dialogs** - Beautiful modals for actions
- **Toast Notifications** - Instant feedback
- **Floating Action Button** - Quick post creation
- **Error Boundaries** - Graceful error handling

### 📱 Mobile Optimized
- **Bottom Navigation** - Easy thumb access
- **Hamburger Menu** - Collapsible sidebar
- **Touch Friendly** - 44x44px minimum touch targets
- **Responsive Layout** - Works on all screen sizes
- **Pull to Refresh** - Native-like experience
- **No Zoom on Input** - iOS optimized

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier works)
- Cloudinary account (optional, for image uploads)

### 1. Clone Repository
```bash
git clone https://github.com/kefimoetaz/KaFeed_VORG.git
cd KaFeed_VORG
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI (from MongoDB Atlas)
# - JWT_SECRET (generate random string)
# - CLOUDINARY credentials (optional)

# Start backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Frontend automatically connects to http://localhost:5000/api
# Or create .env for custom API URL:
# VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Open Browser
Navigate to `http://localhost:5173` and create an account!

---

## 📚 Documentation

Comprehensive guides for all features:

- 📖 **[UX Improvements Guide](UX-IMPROVEMENTS.md)** - All UX enhancements
- 🎉 **[Reactions & Mentions Guide](REACTIONS-MENTIONS-GUIDE.md)** - How to use reactions
- 📱 **[Mobile Responsive Guide](MOBILE-RESPONSIVE.md)** - Mobile optimization details
- 🔍 **[Search Feature Guide](SEARCH-FEATURE.md)** - Real-time search documentation
- 🧪 **[Mobile Testing Guide](MOBILE-TESTING-GUIDE.md)** - Testing on mobile devices
- 🗺️ **[Improvements Roadmap](IMPROVEMENTS-ROADMAP.md)** - Future features
- ⚡ **[Quick Start UX](QUICK-START-UX.md)** - 3-minute integration guide

---

## 🎨 Screenshots

### Desktop
- Beautiful gradient UI with smooth animations
- Sidebar navigation with active states
- Real-time search with dropdown
- Reaction picker on hover

### Mobile
- Bottom navigation bar
- Hamburger menu
- Touch-optimized buttons
- Responsive layouts

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS
- **Lucide Icons** - Beautiful icons
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File uploads
- **Express Rate Limit** - Rate limiting

### DevOps
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image CDN

---

## 📁 Project Structure

```
KaFeed/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & Cloudinary config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, upload, etc.
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   ├── public/
│   └── package.json
│
└── Documentation/          # Guides & docs
```

---

## 🚢 Deployment

### Backend (Render)

1. **Create Web Service** on [render.com](https://render.com)
2. **Connect GitHub** repository
3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Root Directory: `backend`

4. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_random_secret_key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=production
   ```

5. **Deploy!** Backend will be live at `https://your-app.onrender.com`

### Frontend (Vercel)

1. **Import Project** on [vercel.com](https://vercel.com)
2. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy!** Frontend will be live at `https://your-app.vercel.app`

### Database (MongoDB Atlas)

1. Create free cluster on [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP (0.0.0.0/0 for all IPs)
4. Get connection string
5. Add to backend environment variables

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kafeed
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

**Production:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🧪 Testing

### Run Locally
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

### Test Features
1. ✅ Register new account
2. ✅ Create post with @mention and #hashtag
3. ✅ Hover over React button (desktop)
4. ✅ Click reaction (❤️, 😂, etc.)
5. ✅ Click reaction count to see modal
6. ✅ Search for users
7. ✅ Test on mobile (F12 → Device toolbar)

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts/feed` - Get personalized feed
- `GET /api/posts/explore` - Get explore feed
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/react` - React to post
- `DELETE /api/posts/:id/react` - Remove reaction
- `POST /api/posts/:id/repost` - Repost

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/suggested` - Get suggested users

### Comments
- `GET /api/comments/:postId` - Get comments
- `POST /api/comments/:postId` - Create comment
- `DELETE /api/comments/:id` - Delete comment

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create story
- `DELETE /api/stories/:id` - Delete story

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get conversation
- `POST /api/messages` - Send message
- `GET /api/messages/unread-count` - Get unread count

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Kefi Moetaz**
- GitHub: [@kefimoetaz](https://github.com/kefimoetaz)
- Project: [KaFeed](https://github.com/kefimoetaz/KaFeed_VORG)

---

## 🙏 Acknowledgments

- React team for amazing framework
- TailwindCSS for utility-first CSS
- MongoDB for flexible database
- Cloudinary for image hosting
- Vercel & Render for free hosting

---

## 📞 Support

Need help? Check the documentation:
- [UX Improvements Guide](UX-IMPROVEMENTS.md)
- [Reactions Guide](REACTIONS-MENTIONS-GUIDE.md)
- [Mobile Guide](MOBILE-RESPONSIVE.md)

Or open an issue on GitHub!

---

<div align="center">

**⭐ Star this repo if you like it!**

Made with ❤️ by Kefi Moetaz

</div>
