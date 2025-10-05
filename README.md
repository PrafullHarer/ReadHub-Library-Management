# 📚 ReadHub Library Management System

A modern, web-based library management system built with HTML, CSS, JavaScript, and Firebase. ReadHub provides comprehensive tools for managing books, users, and library operations with separate interfaces for administrators and students.

## 🌟 Features

### 👨‍💼 Admin Dashboard
- **User Management**: Add, edit, and manage student/member accounts
- **Book Management**: Add, edit, and organize library books
- **Borrowed Books Tracking**: Monitor currently borrowed books and due dates
- **Reports & Analytics**: View library statistics and trends
- **Real-time Updates**: Live data synchronization with Firebase

### 👨‍🎓 Student Dashboard
- **Book Browsing**: Search and filter available books
- **Borrowing System**: Request and manage book borrows
- **Personal Library**: View borrowed books and borrowing history
- **Profile Management**: Update personal information
- **Due Date Tracking**: Monitor return deadlines

### 🔐 Authentication System
- **Secure Login**: Email/password authentication with Firebase Auth
- **Role-based Access**: Separate admin and student interfaces
- **Session Management**: Remember me functionality
- **Account Creation**: Admin can create new user accounts

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project setup
- Web server (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management
   ```

2. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Update Firebase configuration in `src/assets/js/firebase-init.js`

3. **Firebase Configuration**
   ```javascript
   const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
   };
   ```

4. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /books/{bookId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

5. **Run the Application**
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

## 📁 Project Structure

```
library-management/
├── index.html                 # Main landing page
├── src/
│   ├── pages/
│   │   ├── login.html         # Login page
│   │   ├── welcome.html       # Welcome page
│   │   ├── admin-dashboard.html # Admin interface
│   │   ├── user-dashboard.html  # Student interface
│   │   └── contact.html       # Contact page
│   ├── assets/
│   │   ├── css/
│   │   │   ├── styles.css     # Main styles
│   │   │   ├── login-styles.css
│   │   │   ├── admin-styles.css
│   │   │   ├── user-styles.css
│   │   │   └── contact-styles.css
│   │   └── js/
│   │       ├── firebase-init.js # Firebase configuration
│   │       ├── auth.js         # Authentication logic
│   │       ├── admin.js        # Admin dashboard functionality
│   │       ├── user-dashboard.js # Student dashboard functionality
│   │       └── contact.js     # Contact form handling
│   ├── config/
│   │   ├── config.js          # Firebase configuration
│   │   └── firebase-config.js # Firebase setup
│   └── docs/
│       ├── README.md          # Documentation
│       └── FIREBASE_SETUP.md  # Firebase setup guide
└── README.md                  # This file
```

## 🔧 Configuration

### Firebase Collections Structure

#### Users Collection (`users`)
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  fullName: "John Doe",
  role: "user" | "admin",
  status: "active" | "pending" | "suspended",
  registrationDate: "2024-01-01T00:00:00Z",
  lastLogin: "2024-01-01T00:00:00Z"
}
```

#### Books Collection (`books`)
```javascript
{
  title: "Book Title",
  author: "Author Name",
  isbn: "978-1234567890",
  availability: "available" | "borrowed" | "maintenance",
  condition: "excellent" | "good" | "fair" | "poor",
  description: "Book description",
  addedDate: "2024-01-01T00:00:00Z"
}
```

#### Members Collection (`members`)
```javascript
{
  userId: "user-id",
  email: "user@example.com",
  fullName: "John Doe",
  studentId: "STU001",
  department: "Computer Science",
  year: "2nd Year",
  phone: "+1234567890",
  address: "123 Main St",
  membershipType: "student",
  membershipStatus: "active",
  libraryCardNumber: "LIB001",
  createdBy: "admin-id",
  createdAt: "2024-01-01T00:00:00Z"
}
```

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #000000;
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --border-color: #000000;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --radius-md: 8px;
  --transition-base: 0.3s ease;
}
```

### Adding New Features
1. **New Pages**: Add HTML files to `src/pages/`
2. **Styling**: Create CSS files in `src/assets/css/`
3. **Functionality**: Add JavaScript files in `src/assets/js/`
4. **Firebase**: Update collections and security rules

## 🔍 Debugging

The application includes comprehensive console logging for debugging:

- **🚀 Initialization**: System startup processes
- **🔐 Authentication**: Login/logout operations
- **📊 Data Operations**: Loading/saving data
- **🔍 Search/Filter**: User search activities
- **⚠️ Warnings**: Non-critical issues
- **❌ Errors**: Critical failures
- **✅ Success**: Completed operations

Open browser developer tools (F12) to view detailed logs.

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase project:
   ```bash
   firebase init hosting
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

### Other Hosting Platforms
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable Pages in repository settings

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [prafullharer@gmail.com]

## 🙏 Acknowledgments

- Firebase for backend services
- Font Awesome for icons
- Modern CSS techniques and best practices
- Open source community for inspiration

---

**ReadHub Library Management System** - Modernizing library operations with technology.
