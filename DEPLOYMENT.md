# CodeRacer3D Deployment Guide

## Project Structure

```
coderacer3d/
├── src/                      # React frontend source code
├── server/                   # Node.js/Express backend
│   ├── src/
│   ├── prisma/
│   └── package.json
├── android/                  # Android app (Capacitor)
├── public/                   # Static assets
├── dist/                     # Built frontend (generated)
├── .gitignore               # Git ignore rules
├── .env.example             # Environment variables template
├── package.json             # Frontend dependencies
├── vercel.json              # Vercel configuration
├── railway.json             # Railway configuration
└── README.md
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

#### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)

#### Step 1: Push to GitHub

```powershell
cd "E:\college 2"
git init
git config user.name "Your Name"
git config user.email "youremail@example.com"
git add .
git commit -m "Initial commit - CodeRacer3D"

# Create repo on GitHub, then:
git remote add origin https://github.com/USERNAME/coderacer3d.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your `coderacer3d` repository
4. Railway will auto-detect and deploy
5. Add environment variables:
   - `PORT`: 3001
   - `NODE_ENV`: production
   - `DATABASE_URL`: (set to SQLite path or PostgreSQL)
6. Get your public Railway URL (e.g., `https://your-app.railway.app`)

#### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your `coderacer3d` repository from GitHub
4. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_SERVER_URL`: `https://your-railway-backend.railway.app`
6. Deploy - you'll get a URL like `https://coderacer3d.vercel.app`

#### Step 4: Share with Friends

Your public URL: **https://coderacer3d.vercel.app**

---

## Local Development

### Setup
```powershell
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Generate Prisma client
npx prisma generate
```

### Run Development Servers

**Terminal 1 - Frontend:**
```powershell
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```powershell
cd server
npm run dev
# Runs on http://localhost:3001
```

### Environment Setup

1. Copy `.env.example` to `.env` in the server directory:
   ```powershell
   copy server\.env.example server\.env
   ```

2. Update server/.env with your configuration:
   ```
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=file:./dev.db
   FRONTEND_URL=http://localhost:5173
   ```

---

## Database Setup

### Prisma Migrations

```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations (or create database)
npx prisma migrate deploy

# View database (interactive UI)
npx prisma studio
```

### Reset Database
```powershell
npx prisma migrate reset
```

---

## Building for Production

### Frontend
```powershell
npm run build
# Creates optimized build in /dist
```

### Backend
```powershell
cd server
npm run build
# Compiles TypeScript to JavaScript
```

### Android APK
```powershell
# Update server URL in src/lib/api.ts if needed
npx cap sync android
cd android
.\gradlew assembleDebug
# Creates APK in android/app/build/outputs/apk/debug/
```

---

## Troubleshooting

### Server Connection Failed
- Check if backend is deployed and running
- Verify `VITE_SERVER_URL` environment variable in Vercel
- Ensure CORS is enabled on backend (already configured)

### Database Issues
- Check Railway PostgreSQL credentials
- Run `npx prisma migrate deploy` on Railway
- View current schema with `npx prisma studio`

### APK Installation Issues
- Ensure correct server IP in `src/lib/api.ts`
- For Android Emulator: use `10.0.2.2`
- For Physical Device: use your PC's actual IP address

---

## Performance Tips

1. **Frontend Optimization**
   - Vercel automatically optimizes and caches static assets
   - Use `npm run build` to check bundle size

2. **Backend Optimization**
   - Enable Railway's auto-scaling for high traffic
   - Use database connection pooling

3. **Database**
   - Switch from SQLite to PostgreSQL for production reliability
   - Railway provides free PostgreSQL tier

---

## Next Steps

1. ✅ Initialize git and push to GitHub
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Share public URL with friends
5. Test authentication and multiplayer features
6. Monitor performance and user feedback

---

## Support

For issues with:
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app
- **GitHub**: https://docs.github.com

Good luck launching CodeRacer3D! 🚀
