# 🚀 Vercel Deployment Guide

This guide explains how to deploy ReadHub Library Management System to Vercel.

## Prerequisites

- GitHub account with the ReadHub repository
- Vercel account (free tier works)
- Firebase project set up with Authentication and Firestore

---

## Quick Deploy

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ReadHub-Library-Management)

> Replace `YOUR_USERNAME` with your actual GitHub username.

### Option 2: Manual Deploy

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Click **"Deploy"**

---

## Environment Variables Setup

After deploying, you need to configure Firebase credentials:

### Step 1: Go to Project Settings

1. Open your Vercel dashboard
2. Select your ReadHub project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Firebase Variables

Add each of the following environment variables:

| Variable Name | Description |
|--------------|-------------|
| `FIREBASE_API_KEY` | Your Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | e.g., `your-project.firebaseapp.com` |
| `FIREBASE_DATABASE_URL` | e.g., `https://your-project.firebaseio.com` |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | e.g., `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Your messaging sender ID |
| `FIREBASE_APP_ID` | Your Firebase app ID |
| `FIREBASE_MEASUREMENT_ID` | e.g., `G-XXXXXXXXXX` |

### Step 3: Create env-config.js

Since Vercel hosts static files, you need to create `src/config/env-config.js` with your Firebase config:

1. Copy `src/config/env-config.example.js` to `src/config/env-config.js`
2. Update the Firebase credentials
3. Commit and push to trigger a new deployment

> **Important**: The `env-config.js` file is in `.gitignore`. For production, you have two options:
> - Remove it from `.gitignore` and commit it (less secure, but simpler)
> - Use Vercel's build step to generate it from environment variables

---

## Custom Domain Setup

### Step 1: Add Domain

1. Go to **Settings** → **Domains**
2. Enter your custom domain
3. Click **Add**

### Step 2: Configure DNS

Add the following DNS records at your domain registrar:

**For apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## URL Structure

After deployment, your URLs will be:

| Path | Page |
|------|------|
| `/` | Welcome/Home page |
| `/login` | Login page |
| `/contact` | Contact page |
| `/admin` | Admin dashboard |
| `/dashboard` | Student dashboard |

---

## Build Configuration

The project uses these Vercel settings (configured in `vercel.json`):

- **Framework Preset**: Other (static)
- **Build Command**: None (static files)
- **Output Directory**: `.` (root)
- **Install Command**: None

---

## Troubleshooting

### Firebase Not Working

1. Check browser console for errors
2. Verify `env-config.js` exists and has correct values
3. Ensure Firebase Authentication is enabled
4. Check Firestore rules allow access

### Pages Not Loading

1. Clear browser cache
2. Check Vercel deployment logs
3. Verify all file paths are correct

### CORS Errors

Add your Vercel domain to Firebase Console:
1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to **Authorized domains**

---

## Automatic Deployments

Every push to your main branch triggers an automatic deployment:

1. Make changes locally
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push origin main`
4. Vercel automatically deploys

---

## Environment-Specific Configurations

### Preview Deployments

Vercel creates preview deployments for pull requests. You can set different environment variables for:

- **Production**: Main branch deployments
- **Preview**: Pull request deployments
- **Development**: Local development

---

## Security Checklist

Before going live:

- [ ] Firebase credentials are correct
- [ ] Firestore security rules are configured
- [ ] Authentication domains include your Vercel URL
- [ ] `env-config.js` is properly configured
- [ ] Admin accounts are secured

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [ReadHub Documentation](./DEVELOPER_DOCUMENTATION.md)
