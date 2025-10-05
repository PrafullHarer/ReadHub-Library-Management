# Firebase Setup Guide for Library Management System

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `library-management-system`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (`</>`) to add a web app
4. Enter app nickname: `Library Management System`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 5: Configure Your Project

1. Copy `config.template.js` to `config.js`:
   ```bash
   cp config.template.js config.js
   ```

2. Update `config.js` with your actual Firebase configuration:
   ```javascript
   export const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id",
       measurementId: "your-measurement-id" // Optional
   };
   ```

## Step 6: Set Up Firestore Security Rules

1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Books collection - readable by all authenticated users
    match /books/{bookId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Borrowing history - users can read their own, admins can read all
    match /borrowing_history/{historyId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
  }
}
```

3. Click "Publish"

## Step 7: Test the Setup

1. Open `login.html` in your browser
2. Try registering a new user
3. Try logging in with the registered user
4. Check the Firebase Console to see if users are created in Authentication and Firestore

## Step 8: Create Demo Users (Optional)

The system will automatically create demo users in Firestore. You can also manually create them:

1. Go to Authentication → Users
2. Click "Add user"
3. Create users with emails:
   - `admin@library.com` (password: `admin123`)
   - `student@library.com` (password: `student123`)

## Troubleshooting

### Common Issues:

1. **"Firebase not loaded properly" error**
   - Make sure you've replaced the placeholder config with your actual Firebase config
   - Check browser console for any network errors

2. **Authentication errors**
   - Ensure Email/Password provider is enabled in Firebase Console
   - Check that your domain is authorized (for production)

3. **Firestore permission errors**
   - Make sure Firestore rules are properly set up
   - Check that users have the correct userType in their documents

4. **CORS errors**
   - For local development, this shouldn't be an issue
   - For production, ensure your domain is added to authorized domains in Firebase Console

## Security Best Practices

### Configuration Security

1. **Never commit sensitive data**: The `.gitignore` file is configured to exclude `config.js` file
2. **Keep configuration private**: Don't commit your actual Firebase configuration to version control
3. **Rotate API keys regularly**: Update your Firebase API keys periodically
4. **Limit API key usage**: Configure API key restrictions in Google Cloud Console

### Firebase Security

1. **Firestore Rules**: Always use proper security rules (provided in Step 6)
2. **Authentication**: Enable only necessary authentication providers
3. **Authorized Domains**: Add your production domain to Firebase Console → Authentication → Settings → Authorized domains
4. **App Check**: Consider enabling Firebase App Check for additional security

## Production Considerations

1. **Security Rules**: Update Firestore rules for production
2. **Authorized Domains**: Add your production domain to Firebase Console
3. **Configuration Management**: Keep your Firebase configuration secure and private
4. **Error Handling**: Implement proper error handling and user feedback
5. **Backup**: Set up regular backups of your Firestore database
6. **Monitoring**: Enable Firebase Performance Monitoring and Crashlytics
7. **Hosting**: Consider using Firebase Hosting for deployment

## Next Steps

After setting up Firebase authentication, you can:

1. Create user and admin dashboards
2. Implement book management functionality
3. Add borrowing and returning features
4. Create borrowing history tracking
5. Add search and filtering capabilities
