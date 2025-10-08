# Deployment Guide

## Environment Variables Setup

### Backend (.env in server folder)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_KEY=your_admin_key_here
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (.env in client folder)
```
VITE_API_URL=https://your-backend-domain.com/api
```

## CORS Configuration

The backend is now configured to:
- Accept requests only from the `CLIENT_URL` specified in the backend .env
- Support credentials (cookies, authorization headers)
- Allow standard HTTP methods (GET, POST, PUT, DELETE)

## Deployment Steps

### Backend Deployment (e.g., Render, Railway, Heroku)
1. Push your code to GitHub
2. Connect your repository to the hosting platform
3. Set environment variables:
   - `MONGODB_URI`
   - `ADMIN_KEY`
   - `CLIENT_URL` (your frontend URL)
   - `PORT` (optional, usually auto-set)
4. Deploy!

### Frontend Deployment (e.g., Vercel, Netlify)
1. Push your code to GitHub
2. Connect your repository to the hosting platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variable:
   - `VITE_API_URL` (your backend URL with /api)
6. Deploy!

## Post-Deployment
- Update `CLIENT_URL` in backend .env with your actual frontend URL
- Update `VITE_API_URL` in frontend .env with your actual backend URL
- Test all features to ensure CORS is working correctly
