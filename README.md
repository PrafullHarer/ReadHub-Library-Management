# 📚 ReadHub Library Management System

A modern, comprehensive library management system built with HTML, CSS, JavaScript, and Firebase. Designed for educational institutions to efficiently manage books, users, borrowing, and feedback.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

---

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Features

### 🔐 Authentication & Security
- Secure Firebase Authentication with email/password
- Role-based access control (Admin/User)
- Session management and auto-logout
- Mobile-optimized login experience

### 📖 Book Management
- Complete book catalog with ISBN, author, and title tracking
- Book availability status (Available, Borrowed, Maintenance)
- Book condition tracking (Excellent, Good, Fair, Poor)
- Advanced search & filtering capabilities
- Add/Edit/Delete books functionality

### 👥 User Management
- Student/Member profiles with academic information
- Department & Year tracking
- Contact information management
- Account status management (Active, Pending, Suspended)
- Automatic library card number generation

### 📚 Borrowing System
- Book borrowing & return tracking
- Due date management with automatic overdue detection
- Complete borrowing history for each user
- Advanced search by book title, borrower name, student ID
- Real-time status updates

### 💳 Billing & Payments
- Automated billing calculations
- UPI payment integration with deep links
- PDF bill generation with student details
- Payment status tracking

### 💬 Feedback Management
- Contact form integration for user feedback
- Automatic feedback classification (Bug Report, Suggestion, Complaint, Compliment, Feature Request)
- Admin response system
- Status tracking (New, In Progress, Resolved, Closed)
- Priority management (Low, Medium, High, Urgent)

### 📊 Admin Dashboard
- Comprehensive overview with key statistics
- Real-time data updates
- Advanced filtering & search capabilities
- Complete user, book, and borrowing management
- Feedback management system

### 🎨 Modern UI/UX
- Responsive design for all devices
- Professional black theme design
- Smooth animations and transitions
- Intuitive navigation
- Accessibility features
- Mobile-first approach

---

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project
- Local development server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ReadHub-Library-Management
   ```

2. **Set up Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore Database

3. **Configure environment**
   ```bash
   # Copy the example configuration
   cp src/config/env-config.example.js src/config/env-config.js
   
   # Edit with your Firebase credentials
   # Update the firebase section in env-config.js
   ```

4. **Start local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using VS Code Live Server
   # Right-click index.html → Open with Live Server
   ```

5. **Open in browser**
   Navigate to `http://localhost:8000`

For detailed setup instructions, see the [Quick Start Guide](docs/QUICK_START.md).

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [User Guide](docs/USER_GUIDE.md) | Complete user documentation for students and administrators |
| [Developer Documentation](docs/DEVELOPER_DOCUMENTATION.md) | Technical documentation with architecture, data models, and deployment guides |
| [Quick Start Guide](docs/QUICK_START.md) | Get up and running in 5 minutes |
| [API Reference](docs/API_REFERENCE.md) | Complete Firebase API reference with code examples |
| [Vercel Deployment](docs/VERCEL_DEPLOYMENT.md) | Step-by-step Vercel deployment guide |

---

## 📁 Project Structure

```
ReadHub-Library-Management/
├── index.html                    # Main entry/welcome page
├── vercel.json                   # Vercel deployment config
├── create-admin.html             # Admin account creation utility
├── .env.example                  # Environment variables template
├── README.md                     # This file
│
├── docs/                         # Documentation
│   ├── USER_GUIDE.md            # User documentation
│   ├── DEVELOPER_DOCUMENTATION.md # Developer documentation
│   ├── QUICK_START.md           # Quick start guide
│   ├── API_REFERENCE.md         # API reference
│   └── VERCEL_DEPLOYMENT.md     # Vercel deployment guide
│
└── src/
    ├── assets/
    │   ├── css/                  # Stylesheets
    │   │   ├── admin-styles.css
    │   │   ├── contact-styles.css
    │   │   ├── login-styles.css
    │   │   ├── responsive-utilities.css  # Responsive CSS utilities
    │   │   ├── sidebar-button.css
    │   │   ├── styles.css
    │   │   └── user-styles.css
    │   ├── js/                   # JavaScript files
    │   │   ├── admin.js
    │   │   ├── auth.js
    │   │   ├── contact.js
    │   │   ├── firebase-init.js
    │   │   ├── script.js
    │   │   └── user-dashboard.js
    │   └── library.png           # Logo
    │
    ├── config/                   # Configuration files
    │   ├── env-config.js         # Environment configuration (your credentials)
    │   ├── env-config.example.js # Example configuration template
    │   ├── env-loader.js         # Configuration loader
    │   └── firebase-config.js    # Firebase initialization
    │
    └── pages/
        ├── admin-dashboard.html  # Admin dashboard
        ├── contact.html          # Contact page
        ├── login.html            # Login page
        ├── user-dashboard.html   # User dashboard
        └── welcome.html          # Welcome/landing page
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)
- **JavaScript (ES6+)** - Application logic
- **Font Awesome 6.0** - Icons
- **Flaticon UIcons** - Additional icons

### Backend
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Static site hosting (optional)

### Additional Libraries
- **jsPDF** - PDF generation for bills

---

## 📸 Screenshots

### Welcome Page
Modern landing page with feature highlights and smooth animations.

### Login Page
Clean, mobile-optimized login interface with role-based access.

### Admin Dashboard
Comprehensive admin interface with statistics, user management, and book management.

### User Dashboard
Student portal with borrowed books, billing information, and UPI payment integration.

---

## 🔧 Configuration

### Environment Setup

1. Copy the example configuration:
   ```bash
   cp src/config/env-config.example.js src/config/env-config.js
   ```

2. Update `src/config/env-config.js` with your Firebase credentials:
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
       // ... other configuration options
   };
   ```

> **Note**: Firebase client-side API keys are safe to expose. Security is handled by Firestore security rules.

### Firestore Security Rules

See [Developer Documentation](docs/DEVELOPER_DOCUMENTATION.md#firebase-setup) for complete security rules.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository to [Vercel](https://vercel.com)
3. Deploy with one click

See [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT.md) for detailed instructions.

**After deployment, clean URLs are available:**
| URL | Page |
|-----|------|
| `/` | Home |
| `/login` | Login |
| `/admin` | Admin Dashboard |
| `/dashboard` | Student Dashboard |
| `/contact` | Contact |

### Firebase Hosting

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

### Other Options
- **Netlify** - Git-based deployment
- **GitHub Pages** - Static site hosting
- **AWS S3** - Static website hosting

---

## 👥 User Roles

### 🔑 Administrator
- Full system access
- User management (create, edit, delete)
- Book management (add, edit, delete)
- Borrowing oversight
- Feedback management
- System reports and analytics

### 👤 Student/Member
- View available books
- Borrow and return books
- View personal borrowing history
- View billing and make payments
- Submit feedback

---

## 🧪 Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Team

| Name | Role |
|------|------|
| **Prafull Harer** | Project Director & Lead Developer |
| **Parth Mokal** | UI/UX Designer & Frontend Developer |
| **Tanish Jadhav** | Backend Developer & Database Specialist |

---

## 📞 Support

For support and questions:

- **Email**: contact@readhub.com
- **Phone**: +91 99999 99999
- **Address**: KIT College of Engineering, Kolhapur, Maharashtra, India

---

## 🔄 Version History

### v1.2.0 (Current - December 2025)
- 🚀 Vercel deployment support with clean URLs
- ⚙️ Centralized environment configuration system
- 📱 Responsive CSS utilities for all devices
- 🏠 Welcome page as main entry point
- 📚 Comprehensive deployment documentation
- 🔒 Enhanced security headers

### v1.1.0 (December 2025)
- ✨ UPI payment integration with deep links
- 📄 PDF bill generation for students
- 📱 Enhanced mobile responsiveness
- 🎨 Consistent black theme across all pages
- 📚 Comprehensive documentation added
- 🔧 Bug fixes and performance improvements

### v1.0.0
- 🎉 Initial release
- 📚 Complete library management system
- 🔥 Firebase integration
- 👥 Admin and user dashboards
- 💬 Feedback management system
- 🔍 Advanced search and filtering
- 📱 Responsive design

---

## 🎯 Future Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] SMS integration
- [ ] QR code book management
- [ ] Multi-language support
- [ ] RESTful API development
- [ ] Integration with external library systems
- [ ] Dark mode toggle
- [ ] Bulk operations for admin
- [ ] Export functionality for reports

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>ReadHub Library Management System</strong><br>
  Modernizing library operations for educational institutions worldwide. 📚✨
</p>
