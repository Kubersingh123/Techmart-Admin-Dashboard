# TechMart Deployment Guide

This project is ready for a common free-tier deployment:

- Backend: Render
- Frontend: Vercel or Netlify
- Database: MongoDB Atlas

## 1. Create MongoDB Atlas Database

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Allow network access from `0.0.0.0/0` for hosted deployment.
4. Copy the connection string.

Example:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/techmart_admin
```

## 2. Deploy Backend on Render

1. Open Render and create a new Web Service from the GitHub repository.
2. Select the backend service.
3. Use these settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

4. Add environment variables:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.vercel.app
LOW_STOCK_THRESHOLD=5
```

5. Deploy and copy the backend URL.

Backend health check:

```text
https://your-backend.onrender.com/api/health
```

## 3. Deploy Frontend on Vercel

1. Import the same GitHub repository in Vercel.
2. Set:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

3. Add environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

4. Deploy.
5. Update Render `CLIENT_URL` with the deployed frontend URL.

## 4. Deploy Frontend on Netlify

Use these settings:

```text
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

Environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

The file `frontend/public/_redirects` handles React Router refreshes.

## 5. Create First Admin

After deployment, open the frontend and click:

```text
Need first admin? Register
```

Create the first admin account, then log in normally.
