# 📚 ReadHub Library Management System

A modern, comprehensive library management system built with HTML, CSS, JavaScript, and Firebase. Designed for educational institutions to efficiently manage books, users, borrowing, and feedback.

## 🌟 Features

### 🔐 Authentication & User Management
- **Secure Login System** with Firebase Authentication
- **Role-based Access Control** (Admin/User)
- **User Registration** with detailed member profiles
- **Password Management** and account security

### 📖 Book Management
- **Complete Book Catalog** with ISBN, author, title tracking
- **Book Availability Status** (Available, Borrowed, Maintenance)
- **Book Condition Tracking** (Excellent, Good, Fair, Poor)
- **Advanced Search & Filtering** by title, author, ISBN
- **Add/Edit/Delete Books** functionality

### 👥 User Management
- **Student/Member Profiles** with academic information
- **Department & Year Tracking**
- **Contact Information Management**
- **Account Status Management** (Active, Pending, Suspended)
- **Library Card Number Generation**

### 📚 Borrowing System
- **Book Borrowing & Return** tracking
- **Due Date Management** with automatic overdue detection
- **Borrowing History** for each user
- **Advanced Search** by book title, borrower name, student ID
- **Real-time Status Updates**

### 💬 Feedback Management
- **Contact Form Integration** for user feedback
- **Automatic Feedback Classification** (Bug Report, Suggestion, Complaint, Compliment, Feature Request)
- **Admin Response System**
- **Feedback Status Tracking** (New, In Progress, Resolved, Closed)
- **Priority Management** (Low, Medium, High, Urgent)

### 📊 Admin Dashboard
- **Comprehensive Overview** with key statistics
- **Real-time Data Updates**
- **Advanced Filtering & Search** capabilities
- **User Management Tools**
- **Book Management Interface**
- **Borrowing Oversight**
- **Feedback Management System**

### 🎨 Modern UI/UX
- **Responsive Design** for all devices
- **Consistent Black Theme** with professional styling
- **Smooth Animations** and transitions
- **Intuitive Navigation**
- **Accessibility Features**
- **Consistent Footer Design** across public pages

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
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Update Firebase configuration in `src/config/firebase-config.js`

3. **Configure Firestore Security Rules**
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
         allow write: if true; // Anyone can submit feedback
         allow read: if isAdmin(); // Only admins can read feedback
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

       // Default fallback rule
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Run the Application**
   - Open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

## 📁 Project Structure

```
library-management/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── admin-styles.css      # Admin dashboard styles
│   │   │   ├── contact-styles.css   # Contact page styles
│   │   │   ├── login-styles.css     # Login page styles
│   │   │   ├── sidebar-button.css   # Sidebar component styles
│   │   │   ├── styles.css           # Main application styles
│   │   │   └── user-styles.css      # User dashboard styles
│   │   └── js/
│   │       ├── admin.js             # Admin dashboard functionality
│   │       ├── auth.js              # Authentication logic
│   │       ├── contact.js           # Contact form functionality
│   │       ├── firebase-init.js     # Firebase initialization
│   │       ├── script.js            # Main application script
│   │       └── user-dashboard.js    # User dashboard functionality
│   ├── config/
│   │   ├── config.template.js       # Configuration template
│   │   └── firebase-config.js       # Firebase configuration
│   ├── docs/
│   │   ├── FIREBASE_SETUP.md       # Firebase setup guide
│   │   └── README.md               # Documentation
│   └── pages/
│       ├── admin-dashboard.html     # Admin dashboard page
│       ├── contact.html             # Contact page
│       ├── login.html               # Login page
│       ├── user-dashboard.html      # User dashboard page
│       └── welcome.html             # Welcome page
├── create-admin.html                # Admin creation utility
├── index.html                      # Main entry point
├── readhub.env                     # Environment configuration
└── README.md                       # This file
```

## 🔧 Configuration

### Firebase Configuration
Update `src/config/firebase-config.js` with your Firebase project details:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Environment Variables
Create a `.env` file or update `readhub.env`:

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

## 👥 User Roles

### 🔑 Admin
- Full system access
- User management (create, edit, delete users)
- Book management (add, edit, delete books)
- Borrowing oversight
- Feedback management
- System reports and analytics

### 👤 User/Student
- View available books
- Borrow and return books
- View personal borrowing history
- Submit feedback through contact form
- Update personal profile information

## 📱 Features by Page

### 🏠 Welcome Page (`welcome.html`)
- System introduction
- Navigation to login/contact
- Feature highlights
- Professional footer with navigation

### 🔐 Login Page (`login.html`)
- Secure authentication
- Role-based redirection
- Password recovery (if implemented)
- Consistent footer design

### 👤 User Dashboard (`user-dashboard.html`)
- Personal book borrowing history
- Available books catalog
- Profile management
- Book search and filtering
- Clean interface without footer for focused experience

### 🔧 Admin Dashboard (`admin-dashboard.html`)
- **Overview Section**: Key statistics and metrics
- **Book Management**: Add, edit, delete books
- **Borrowed Books**: Track all borrowing activities with advanced search
- **User Management**: Manage students and members
- **Reports**: Analytics and insights
- **Feedback Management**: Handle user feedback and suggestions
- Clean interface without footer for focused experience

### 📞 Contact Page (`contact.html`)
- Team information
- Contact details
- Feedback submission form
- Automatic feedback classification
- Professional footer with navigation

## 🔍 Search & Filtering

### Book Search
- Search by title, author, ISBN
- Filter by availability status
- Filter by book condition

### Borrowed Books Search
- General search (book title, author, borrower name, email, ISBN, department, phone)
- **Student ID specific search** (dedicated search box)
- Filter by borrowing status (Active, Overdue, Returned)

### Feedback Search
- Search by subject, message content, user name, email
- Filter by feedback type (Suggestion, Complaint, Compliment, Bug Report, Feature Request)
- Filter by status (New, In Progress, Resolved, Closed)

## 🛡️ Security Features

- **Firebase Authentication** for secure user management
- **Role-based access control** with admin/user separation
- **Firestore security rules** for data protection
- **Input validation** on all forms
- **XSS protection** through proper data sanitization
- **CSRF protection** through Firebase security

## 🎨 Design System

### Color Scheme
- **Primary**: Black (#000000) - Professional and modern
- **Background**: White (#ffffff) - Clean and readable
- **Footer Background**: Black (#000000) - Consistent branding
- **Text Colors**: White (#ffffff) and light gray (#cccccc) for footer
- **Accent Colors**: Various shades for different states
- **Status Colors**: Success, Warning, Danger with consistent theming

### Typography
- **Primary Font**: System fonts for optimal performance
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weights for readability

### Components
- **Cards**: Clean, minimal design with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: User-friendly with validation feedback
- **Tables**: Responsive with sorting and filtering
- **Modals**: Clean overlay design for forms

## 📊 Data Structure

### Collections

#### Users Collection
```javascript
{
  email: string,
  fullName: string,
  role: 'admin' | 'user',
  status: 'active' | 'pending' | 'suspended',
  joinedDate: timestamp,
  lastLogin: timestamp
}
```

#### Members Collection
```javascript
{
  userId: string, // Reference to users collection
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
  enrollmentDate: timestamp,
  notes: string,
  preferences: object,
  contactMethods: object
}
```

#### Books Collection
```javascript
{
  title: string,
  author: string,
  isbn: string,
  condition: 'excellent' | 'good' | 'fair' | 'poor',
  availability: 'available' | 'borrowed' | 'maintenance',
  description: string,
  addedDate: timestamp,
  addedBy: string,
  updatedDate: timestamp,
  updatedBy: string
}
```

#### Borrowed Books Collection
```javascript
{
  bookId: string, // Reference to books collection
  borrowerId: string, // Reference to users collection
  bookTitle: string,
  author: string,
  isbn: string,
  borrowerName: string,
  borrowerEmail: string,
  borrowerPhone: string,
  borrowDate: string,
  dueDate: string,
  returnDate: string,
  status: 'active' | 'overdue' | 'returned',
  extendedCount: number
}
```

#### Feedback Collection
```javascript
{
  userName: string,
  userEmail: string,
  userPhone: string,
  subject: string,
  message: string,
  type: 'suggestion' | 'complaint' | 'compliment' | 'bug-report' | 'feature-request' | 'general',
  status: 'new' | 'in-progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  createdAt: timestamp,
  adminResponse: string,
  updatedAt: timestamp,
  updatedBy: string
}
```

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize hosting:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

### Other Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Static website hosting

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Book management (add, edit, delete)
- [ ] User management (create, edit, delete users)
- [ ] Book borrowing and return
- [ ] Feedback submission and management
- [ ] Search and filtering functionality
- [ ] Responsive design on different devices
- [ ] Admin dashboard functionality

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Team

- **Prafull Harer** - Project Director & Lead Developer
- **Parth Mokal** - UI/UX Designer & Frontend Developer  
- **Tanish Jadhav** - Backend Developer & Database Specialist

## 📞 Support

For support and questions:
- **Email**: contact@readhub.com
- **Phone**: +91 99999 99999
- **Address**: KIT College of Engineering, Kolhapur, Maharashtra, India

## 🔄 Version History

### v1.1.0 (Current)
- Updated copyright year to 2025
- Consistent footer design across all public pages
- Removed footer from dashboard pages for cleaner interface
- Standardized color scheme with black theme
- Enhanced UI/UX consistency
- Improved responsive design

### v1.0.0
- Initial release
- Complete library management system
- Firebase integration
- Admin and user dashboards
- Feedback management system
- Advanced search and filtering
- Responsive design

## 🎯 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] SMS integration
- [ ] QR code book management
- [ ] Multi-language support
- [ ] API development
- [ ] Integration with external library systems
- [ ] Dark mode toggle
- [ ] Advanced user preferences
- [ ] Bulk operations for admin
- [ ] Export functionality for reports

---

**ReadHub Library Management System** - Modernizing library operations for educational institutions worldwide. 📚✨
