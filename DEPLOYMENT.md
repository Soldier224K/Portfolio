# Deployment Guide

Your portfolio is structured as a full-stack application with a React (Vite) frontend and a Node.js (Express) backend. You will deploy these to two separate services.

## 1. Deploying the Backend (Render or Railway)

1. **Create an account** on [Render](https://render.com) or [Railway](https://railway.app).
2. **Connect your GitHub repo** containing this code.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install` (or `npm ci --ignore-scripts`).
5. Set the **Start Command** to `node server.js`.
6. Add the following **Environment Variables** (matching what is in your `backend/.env`):
   - `MONGODB_URI`: Your actual MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for JWTs.
   - `OPS_PASSPHRASE_HASH`: The bcrypt hash of your Ops passphrase.
   - `ENCRYPTION_KEY`: A 64-character (32-byte) hex string for AES-256-GCM.
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (once deployed, e.g., `https://rajrasal.vercel.app`).

Once deployed, copy the backend URL (e.g., `https://portfolio-backend.up.railway.app`).

## 2. Deploying the Frontend (Vercel)

1. **Create an account** on [Vercel](https://vercel.com).
2. **Import your GitHub repo**.
3. The root directory should remain as `/` (the root of your project).
4. Vercel will automatically detect Vite. The build command will be `npm run build` and output directory `dist`.
5. Add the following **Environment Variable**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://portfolio-backend.up.railway.app/api`).
6. Click **Deploy**.

*Note: The `vercel.json` file we added ensures that React Router works correctly when users navigate directly to `/pro` or `/ops`.*
