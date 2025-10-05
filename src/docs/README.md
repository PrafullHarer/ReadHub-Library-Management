# Library Management System

A modern web-based library management system built with HTML, CSS, JavaScript, and Firebase.

## Features

- 🔐 **Secure Authentication**: Firebase Authentication with email/password
- 👥 **User Management**: Separate interfaces for students and administrators
- 📚 **Book Management**: Add, edit, and manage library collection
- 📖 **Borrowing System**: Track book borrowing and returns
- 📊 **History Tracking**: Complete borrowing history for users
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore Database)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome

## Quick Start

### 1. Clone or Download the Project

```bash
git clone <your-repo-url>
cd library-management
```

### 2. Configure Firebase

1. **Copy the configuration template**:
   ```bash
   cp config.template.js config.js
   ```

2. **Get your Firebase configuration**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Go to Project Settings → General → Your apps
   - Add a web app and copy the configuration

3. **Update `config.js`** with your Firebase configuration:
   ```javascript
   export const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
   };
   ```

### 3. Set Up Firebase Services

1. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider

2. **Create Firestore Database**:
   - Go to Firestore Database
   - Create database in test mode
   - Set up security rules (see `FIREBASE_SETUP.md`)

### 4. Run the Application

1. **Start a local server** (required for ES6 modules):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Open your browser** and navigate to `http://localhost:8000`

## Project Structure

```
library-management/
├── index.html              # Welcome page
├── login.html              # Authentication page
├── styles.css              # Main stylesheet
├── script.js               # Welcome page functionality
├── auth.js                 # Firebase authentication logic
├── firebase-config.js      # Firebase initialization
├── config.js               # Firebase configuration (create from template)
├── config.template.js      # Configuration template
├── .gitignore              # Git ignore rules
├── FIREBASE_SETUP.md       # Detailed Firebase setup guide
└── README.md               # This file
```

## Configuration Options

### Configuration (config.js)
- Copy `config.template.js` to `config.js`
- Update with your Firebase configuration
- Simple and straightforward setup

## Demo Users

The system automatically creates demo users for testing:

- **Admin**: `admin@library.com` / `admin123`
- **Student**: `student@library.com` / `student123`

## Security Features

- ✅ Firebase Authentication with secure password handling
- ✅ Firestore security rules for data protection
- ✅ Configuration validation and error handling
- ✅ Simple configuration management
- ✅ Git ignore rules for sensitive files

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For detailed setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

For issues and questions, please create an issue in the repository.
