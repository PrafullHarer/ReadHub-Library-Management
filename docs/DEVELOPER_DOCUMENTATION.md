# 📚 ReadHub Library Management System - Developer Documentation

This documentation provides comprehensive technical details for developers working on the ReadHub Library Management System.

---

## 📑 Table of Contents

1. [System Architecture](#system-architecture)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Environment Configuration](#environment-configuration)
5. [Firebase Setup](#firebase-setup)
6. [Authentication System](#authentication-system)
7. [Data Models](#data-models)
8. [API Reference](#api-reference)
9. [Component Documentation](#component-documentation)
10. [Styling Guidelines](#styling-guidelines)
11. [Responsive Design](#responsive-design)
12. [Deployment Guide](#deployment-guide)
13. [Development Workflow](#development-workflow)
14. [Security Considerations](#security-considerations)

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Welcome Page  │  Login Page  │  User Dashboard  │  Admin   │
│                │              │                  │ Dashboard │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                    JAVASCRIPT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  auth.js  │  user-dashboard.js  │  admin.js  │  contact.js  │
│           │                     │            │  script.js   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   FIREBASE BACKEND                           │
├─────────────────────────────────────────────────────────────┤
│  Firebase Auth  │  Cloud Firestore  │  Firebase Hosting      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → HTML/CSS Frontend
2. **JavaScript Processing** → Business Logic Layer
3. **Firebase SDK** → Backend Communication
4. **Firestore Database** → Data Persistence
5. **Response** → UI Update

---

## 📁 Project Structure

```
ReadHub-Library-Management/
├── index.html                    # Main entry/welcome page
├── vercel.json                   # Vercel deployment configuration
├── create-admin.html             # Admin account creation utility
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── README.md                     # Project overview
│
├── docs/                         # Documentation
│   ├── USER_GUIDE.md            # User documentation
│   ├── DEVELOPER_DOCUMENTATION.md # This file
│   ├── QUICK_START.md           # Quick start guide
│   ├── API_REFERENCE.md         # Firebase API reference
│   └── VERCEL_DEPLOYMENT.md     # Vercel deployment guide
│
└── src/
    ├── assets/
    │   ├── css/
    │   │   ├── admin-styles.css      # Admin dashboard styles
    │   │   ├── contact-styles.css    # Contact page styles
    │   │   ├── login-styles.css      # Login page styles
    │   │   ├── responsive-utilities.css # Responsive CSS utilities
    │   │   ├── sidebar-button.css    # Sidebar component styles
    │   │   ├── styles.css            # Main/welcome page styles
    │   │   └── user-styles.css       # User dashboard styles
    │   │
    │   ├── js/
    │   │   ├── admin.js              # Admin dashboard functionality
    │   │   ├── auth.js               # Authentication logic
    │   │   ├── contact.js            # Contact form functionality
    │   │   ├── firebase-init.js      # Firebase initialization
    │   │   ├── script.js             # Common scripts
    │   │   └── user-dashboard.js     # User dashboard functionality
    │   │
    │   └── library.png               # Logo image
    │
    ├── config/                       # Configuration files
    │   ├── env-config.js             # Environment config (your credentials)
    │   ├── env-config.example.js     # Example configuration template
    │   ├── env-loader.js             # Configuration loader module
    │   └── firebase-config.js        # Firebase initialization
    │
    └── pages/
        ├── admin-dashboard.html      # Admin dashboard page
        ├── contact.html              # Contact page
        ├── login.html                # Login page
        ├── user-dashboard.html       # User dashboard page
        └── welcome.html              # Welcome/landing page
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Structure and markup |
| CSS3 | - | Styling and animations |
| JavaScript (ES6+) | - | Application logic |
| Font Awesome | 6.0.0 | Icons |
| Flaticon UIcons | Latest | Additional icons |

### Backend (Firebase)

| Service | Purpose |
|---------|---------|
| Firebase Authentication | User authentication and session management |
| Cloud Firestore | NoSQL database for data storage |
| Firebase Hosting | Static site hosting (optional) |

### External Libraries

| Library | Version | CDN URL |
|---------|---------|---------|
| Font Awesome | 6.0.0 | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css` |
| Firebase SDK | 10.7.1 | `https://www.gstatic.com/firebasejs/10.7.1/` |
| jsPDF | Latest | For PDF generation |
| Flaticon UIcons | Latest | `https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons-bold/css/uicons-bold.css` |

---

## ⚙️ Environment Configuration

### Overview

The project uses a centralized environment configuration system that allows for easy management of Firebase credentials and application settings.

### Configuration Files

| File | Purpose |
|------|---------|
| `env-config.js` | Your actual configuration with credentials |
| `env-config.example.js` | Template with placeholder values (safe to commit) |
| `env-loader.js` | Loads and processes configuration |

### Setup

1. **Copy the example configuration:**
   ```bash
   cp src/config/env-config.example.js src/config/env-config.js
   ```

2. **Update with your Firebase credentials:**
   ```javascript
   window.ENV_CONFIG = {
       firebase: {
           apiKey: "YOUR_API_KEY",
           authDomain: "YOUR_PROJECT.firebaseapp.com",
           databaseURL: "https://YOUR_PROJECT.firebaseio.com",
           projectId: "YOUR_PROJECT_ID",
           storageBucket: "YOUR_PROJECT.appspot.com",
           messagingSenderId: "YOUR_SENDER_ID",
           appId: "YOUR_APP_ID",
           measurementId: "YOUR_MEASUREMENT_ID"
       },
       app: {
           name: "ReadHub Library Management System",
           version: "1.2.0",
           environment: "development"
       },
       // ... other settings
   };
   ```

### How It Works

1. HTML pages load `env-config.js` first (sets `window.ENV_CONFIG`)
2. `env-loader.js` processes the configuration
3. Firebase SDK reads from `window.firebaseConfig`

### Security Note

Firebase client-side API keys are safe to expose. Security is enforced through:
- Firestore security rules
- Firebase Authentication
- Domain restrictions in Firebase Console

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "ReadHub-Library-Management"
4. Enable/disable Google Analytics as needed
5. Click "Create project"

### 2. Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Add your domains to **Authorized domains**:
   - `localhost`
   - Your Vercel domain (e.g., `your-app.vercel.app`)
   - Your custom domain

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Production mode**
4. Choose a location (preferably close to your users)

### 4. Security Rules

Apply these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
      allow create, update, delete: if isAdmin();
    }

    // Members collection
    match /members/{memberId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        isAdmin()
      );
      allow create, update, delete: if isAdmin();
    }

    // Books collection
    match /books/{bookId} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if request.auth != null && (
        isAdmin() ||
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['availability']))
      );
    }

    // Borrowed books collection
    match /borrowedBooks/{borrowId} {
      allow read: if request.auth != null && (
        resource.data.borrowerId == request.auth.uid ||
        isAdmin()
      );
      allow create: if request.auth != null && 
        request.resource.data.borrowerId == request.auth.uid;
      allow update, delete: if request.auth != null && (
        resource.data.borrowerId == request.auth.uid ||
        isAdmin()
      );
    }

    // Feedback collection
    match /feedback/{feedbackId} {
      allow write: if true;
      allow read: if isAdmin();
    }

    // Reports collection
    match /reports/{reportId} {
      allow read, write: if isAdmin();
    }

    // Activity logs
    match /activityLogs/{logId} {
      allow read, write: if isAdmin();
    }

    // Settings collection
    match /settings/{settingId} {
      allow read, write: if isAdmin();
    }
  }
}
```

---

## 🔐 Authentication System

### Overview

The authentication system uses Firebase Authentication with email/password login.

### Key Files

- `src/assets/js/auth.js` - Main authentication logic
- `src/assets/js/firebase-init.js` - Firebase initialization

### Authentication Flow

```
┌──────────────────┐
│   User Enters    │
│   Credentials    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Validate Input  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Firebase Auth   │
│  signInWithEmail │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Fetch User Role │
│  from Firestore  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Redirect Based  │
│  on Role         │
└──────────────────┘
```

### Key Functions

```javascript
// auth.js

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Login logic...
}

// Check authentication state
function checkAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            redirectToDashboard(user);
        }
    });
}

// Redirect based on role
async function redirectToDashboard(user) {
    const userDoc = await getUserDataFromFirestore(user.uid);
    if (userDoc.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'user-dashboard.html';
    }
}
```

### Mobile Optimizations

The auth system includes mobile-specific optimizations:

- Virtual keyboard handling
- Touch-friendly input fields
- Viewport adjustment for small screens
- Enhanced error messages for mobile

---

## 📊 Data Models

### Users Collection

```javascript
{
    id: string,           // Document ID (same as Firebase Auth UID)
    email: string,
    fullName: string,
    role: 'admin' | 'user',
    status: 'active' | 'pending' | 'suspended',
    joinedDate: Timestamp,
    lastLogin: Timestamp
}
```

### Members Collection

```javascript
{
    id: string,           // Document ID
    userId: string,       // Reference to users collection
    email: string,
    fullName: string,
    phone: string,
    studentId: string,
    department: string,
    year: string,
    address: string,
    emergencyContact: string,
    gender: string,
    dateOfBirth: string,
    membershipType: 'student' | 'faculty' | 'staff',
    membershipStatus: 'active' | 'inactive',
    libraryCardNumber: string,
    academicYear: string,
    semester: string,
    enrollmentDate: Timestamp,
    notes: string,
    preferences: {
        emailNotifications: boolean,
        smsNotifications: boolean
    },
    contactMethods: {
        preferredMethod: string
    }
}
```

### Books Collection

```javascript
{
    id: string,           // Document ID
    title: string,
    author: string,
    isbn: string,
    condition: 'excellent' | 'good' | 'fair' | 'poor',
    availability: 'available' | 'borrowed' | 'maintenance',
    description: string,
    addedDate: Timestamp,
    addedBy: string,      // Admin user ID
    updatedDate: Timestamp,
    updatedBy: string
}
```

### Borrowed Books Collection

```javascript
{
    id: string,           // Document ID
    bookId: string,       // Reference to books collection
    borrowerId: string,   // Reference to users collection
    bookTitle: string,
    author: string,
    isbn: string,
    borrowerName: string,
    borrowerEmail: string,
    borrowerPhone: string,
    borrowDate: string,
    dueDate: string,
    returnDate: string,   // null if not returned
    status: 'active' | 'overdue' | 'returned',
    extendedCount: number
}
```

### Feedback Collection

```javascript
{
    id: string,           // Document ID
    userName: string,
    userEmail: string,
    userPhone: string,
    subject: string,
    message: string,
    type: 'suggestion' | 'complaint' | 'compliment' | 'bug-report' | 'feature-request' | 'general',
    status: 'new' | 'in-progress' | 'resolved' | 'closed',
    priority: 'low' | 'medium' | 'high' | 'urgent',
    createdAt: Timestamp,
    adminResponse: string,
    updatedAt: Timestamp,
    updatedBy: string
}
```

---

## 🔌 API Reference

### Firebase Firestore Operations

#### Books Operations

```javascript
// Get all books
async function loadBooks() {
    const snapshot = await firebase.firestore()
        .collection('books')
        .get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Add a new book
async function addBook(bookData) {
    const docRef = await firebase.firestore()
        .collection('books')
        .add({
            ...bookData,
            addedDate: firebase.firestore.FieldValue.serverTimestamp(),
            addedBy: currentUser.uid
        });
    return docRef.id;
}

// Update a book
async function updateBook(bookId, updateData) {
    await firebase.firestore()
        .collection('books')
        .doc(bookId)
        .update({
            ...updateData,
            updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.uid
        });
}

// Delete a book
async function deleteBook(bookId) {
    await firebase.firestore()
        .collection('books')
        .doc(bookId)
        .delete();
}
```

#### Users Operations

```javascript
// Get all users
async function loadUsers() {
    const snapshot = await firebase.firestore()
        .collection('users')
        .get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Create user (requires admin privileges)
async function createUser(userData) {
    // Create auth user
    const userCredential = await firebase.auth()
        .createUserWithEmailAndPassword(userData.email, userData.password);
    
    // Create user document
    await firebase.firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
            email: userData.email,
            fullName: userData.fullName,
            role: 'user',
            status: 'active',
            joinedDate: firebase.firestore.FieldValue.serverTimestamp()
        });
    
    // Create member document
    await firebase.firestore()
        .collection('members')
        .add({
            userId: userCredential.user.uid,
            ...userData
        });
}
```

#### Borrowing Operations

```javascript
// Borrow a book
async function borrowBook(bookId, userId) {
    const book = await getBook(bookId);
    const user = await getUser(userId);
    
    // Create borrowing record
    await firebase.firestore()
        .collection('borrowedBooks')
        .add({
            bookId: bookId,
            borrowerId: userId,
            bookTitle: book.title,
            borrowerName: user.fullName,
            borrowDate: new Date().toISOString(),
            dueDate: calculateDueDate(),
            status: 'active'
        });
    
    // Update book availability
    await updateBook(bookId, { availability: 'borrowed' });
}

// Return a book
async function returnBook(borrowId) {
    const borrowing = await getBorrowing(borrowId);
    
    // Update borrowing record
    await firebase.firestore()
        .collection('borrowedBooks')
        .doc(borrowId)
        .update({
            returnDate: new Date().toISOString(),
            status: 'returned'
        });
    
    // Update book availability
    await updateBook(borrowing.bookId, { availability: 'available' });
}
```

---

## 🧩 Component Documentation

### Admin Dashboard Components

#### Overview Section
- **File**: `admin-dashboard.html`
- **Styles**: `admin-styles.css`
- **Script**: `admin.js`
- **Key Functions**: `loadDashboardData()`, `loadStats()`, `renderBooksTable()`

#### Book Management
- Modal-based add/edit forms
- Real-time table updates
- Search and filter functionality

#### User Management
- Member creation with detailed profiles
- Status management (Active/Pending/Suspended)
- Edit functionality with member data loading

#### Feedback Management
- Type-based classification
- Priority and status management
- Admin response system

### User Dashboard Components

#### Profile Section
- Displays user information
- Shows membership details

#### Borrowed Books
- Personal borrowing history
- Due date tracking
- Return functionality

#### Billing Section
- Payment amount display
- UPI payment integration
- PDF bill generation

---

## 🎨 Styling Guidelines

### Color Palette

```css
:root {
    /* Primary Colors */
    --color-primary: #000000;
    --color-secondary: #333333;
    --color-background: #ffffff;
    
    /* Text Colors */
    --color-text-primary: #000000;
    --color-text-secondary: #666666;
    --color-text-light: #ffffff;
    
    /* Status Colors */
    --color-success: #28a745;
    --color-warning: #ffc107;
    --color-danger: #dc3545;
    --color-info: #17a2b8;
    
    /* Footer Colors */
    --color-footer-bg: #000000;
    --color-footer-text: #ffffff;
}
```

### Typography

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Heading Sizes */
h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
h3 { font-size: 1.5rem; font-weight: 600; }
h4 { font-size: 1.25rem; font-weight: 500; }

/* Body Text */
body { font-size: 1rem; line-height: 1.6; }
```

### Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small Mobile */
@media (max-width: 480px) { ... }

/* Mobile */
@media (max-width: 768px) { ... }

/* Tablet */
@media (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }

/* Large Desktop */
@media (min-width: 1200px) { ... }
```

### Component Styling

#### Buttons

```css
.btn-primary {
    background: #000000;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

#### Cards

```css
.card {
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
}
```

#### Forms

```css
.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}
```

---

## 📱 Responsive Design

### Responsive Utilities CSS

The project includes a comprehensive `responsive-utilities.css` file that provides:

- **Fluid Typography**: Uses CSS `clamp()` for smooth scaling
- **Touch Optimization**: 44-48px minimum touch targets
- **Responsive Spacing**: CSS custom properties for consistent spacing
- **Breakpoint Utilities**: Mobile-first responsive classes

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 480px;   /* Small Mobile */
--breakpoint-md: 768px;   /* Tablet Portrait */
--breakpoint-lg: 1024px;  /* Tablet Landscape / Desktop */
--breakpoint-xl: 1280px;  /* Large Desktop */
--breakpoint-xxl: 1536px; /* Ultra-wide */
```

### Touch Device Support

```css
@media (hover: none) and (pointer: coarse) {
    /* Touch-specific styles */
    .btn { min-height: 44px; }
    .form-input { min-height: 48px; }
}
```

### Accessibility Features

- Focus visible styles for keyboard navigation
- Skip links for screen readers
- Reduced motion support
- High contrast mode support

---

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Firebase Domain**
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel URL to Authorized domains

**Clean URLs (configured in vercel.json):**
| Path | Page |
|------|------|
| `/` | Welcome/Home |
| `/login` | Login |
| `/admin` | Admin Dashboard |
| `/dashboard` | Student Dashboard |
| `/contact` | Contact |

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

### Option 2: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Project**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to project root
   - Configure as single-page app: No
   - Don't overwrite index.html

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Option 3: Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build settings (if any)
4. Deploy

### Option 4: GitHub Pages

1. Push code to GitHub
2. Go to repository Settings → Pages
3. Select source branch
4. Save and wait for deployment

### Option 4: Manual/VPS

1. Upload files to server via FTP/SCP
2. Configure web server (Apache/Nginx)
3. Set up SSL certificate
4. Configure domain

---

## 🔧 Development Workflow

### Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd ReadHub-Library-Management
   ```

2. **Start Local Server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8000`

### Code Style

- Use 4 spaces for indentation
- Use camelCase for JavaScript variables and functions
- Use kebab-case for CSS classes
- Add comments for complex logic
- Keep functions small and focused

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "Add feature description"

# Push and create PR
git push origin feature/feature-name
```

### Testing Checklist

Before deployment, verify:

- [ ] User login/logout works
- [ ] Admin login works
- [ ] Book CRUD operations work
- [ ] User CRUD operations work
- [ ] Borrowing system works
- [ ] Feedback submission works
- [ ] Responsive design on all devices
- [ ] All links work correctly
- [ ] Error messages display properly

---

## 🔒 Security Considerations

### Authentication Security

- Use Firebase Authentication for secure login
- Implement proper session management
- Enforce strong password policies
- Use HTTPS for all connections

### Data Security

- Apply proper Firestore security rules
- Validate all input data
- Sanitize user-generated content
- Never expose sensitive data in client code

### Common Vulnerabilities to Prevent

1. **XSS (Cross-Site Scripting)**
   - Sanitize all user inputs
   - Use textContent instead of innerHTML when possible
   
2. **CSRF (Cross-Site Request Forgery)**
   - Firebase handles CSRF protection

3. **Injection Attacks**
   - Use parameterized queries
   - Validate input types

4. **Insecure Direct Object References**
   - Check user permissions before accessing data
   - Use Firestore security rules

### Best Practices

- Keep Firebase SDK updated
- Review security rules regularly
- Monitor authentication logs
- Use environment variables for sensitive data
- Don't commit credentials to version control

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 👨‍💻 Contributors

- **Prafull Harer** - Project Director & Lead Developer
- **Parth Mokal** - UI/UX Designer & Frontend Developer
- **Tanish Jadhav** - Backend Developer & Database Specialist

---

*Last Updated: December 2025*
