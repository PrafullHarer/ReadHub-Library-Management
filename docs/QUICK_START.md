# 📚 ReadHub Library Management System - Quick Start Guide

Get up and running with ReadHub in 5 minutes!

---

## ⚡ Quick Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ReadHub-Library-Management
```

### Step 2: Set Up Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → **Email/Password**
3. Create a **Firestore Database**

### Step 3: Configure Environment

1. Copy the example configuration file:
   ```bash
   cp src/config/env-config.example.js src/config/env-config.js
   ```

2. Edit `src/config/env-config.js` with your Firebase credentials:
   ```javascript
   firebase: {
       apiKey: "YOUR_FIREBASE_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       // ... other Firebase settings
   }
   ```

> **Note**: The `env-config.js` file is in `.gitignore` and won't be committed.

### Step 4: Run Locally

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using Live Server (VS Code Extension)
# Right-click index.html → "Open with Live Server"
```

### Step 5: Open in Browser

Navigate to `http://localhost:8000`

---

## 🔑 Default Admin Setup

To create an admin account:

1. Open `create-admin.html` in your browser
2. Fill in admin details
3. Submit the form
4. Login with admin credentials

---

## 📖 Quick Reference

### User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access, user management, book management |
| **User/Student** | View books, borrow/return, view personal history |

### Key Pages

| Page | URL (Vercel) | URL (Local) |
|------|--------------|-------------|
| Welcome | `/` | `/index.html` |
| Login | `/login` | `/src/pages/login.html` |
| Admin Dashboard | `/admin` | `/src/pages/admin-dashboard.html` |
| User Dashboard | `/dashboard` | `/src/pages/user-dashboard.html` |
| Contact | `/contact` | `/src/pages/contact.html` |

---

## 🛠️ Common Commands

### Development

```bash
# Start local server (Python)
python -m http.server 8000

# Start local server (Node)
npx http-server -p 8000
```

### Deployment (Vercel - Recommended)

1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Deploy with one click

See [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) for details.

### Deployment (Firebase)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

---

## 📚 Documentation

- **[User Guide](./USER_GUIDE.md)** - Complete user documentation
- **[Developer Documentation](./DEVELOPER_DOCUMENTATION.md)** - Technical details
- **[Vercel Deployment](./VERCEL_DEPLOYMENT.md)** - Deployment guide
- **[API Reference](./API_REFERENCE.md)** - Firebase API reference
- **[README](../README.md)** - Project overview

---

## 💡 Tips

1. **Use Chrome DevTools** for debugging
2. **Check browser console** for errors
3. **Test on mobile** with Chrome's device emulation
4. **Clear cache** if changes don't appear

---

## ❓ Need Help?

- 📧 Email: contact@readhub.com
- 📞 Phone: +91 99999 99999

---

*Happy coding! 📚✨*
