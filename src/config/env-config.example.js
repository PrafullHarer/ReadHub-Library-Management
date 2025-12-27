/**
 * Environment Configuration Example for ReadHub Library Management System
 * 
 * INSTRUCTIONS:
 * 1. Copy this file and rename it to env-config.js
 * 2. Update the values below with your actual Firebase configuration
 * 3. Get Firebase values from: Firebase Console -> Project Settings -> General -> Your apps
 * 
 * SECURITY NOTE:
 * - The actual env-config.js is in .gitignore and will NOT be committed
 * - Never commit your actual API keys to version control
 * - Keep this example file with placeholder values for documentation
 */

window.ENV_CONFIG = {
    // Firebase Configuration - Get these from Firebase Console
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    },

    // Application Settings
    app: {
        name: "ReadHub Library Management System",
        version: "1.1.0",
        environment: "development"  // 'development' or 'production'
    },

    // Library Configuration
    library: {
        name: "Your Library Name",
        address: "Your Library Address",
        phone: "+1 123 456 7890",
        email: "contact@yourlibrary.com"
    },

    // Borrowing Settings
    borrowing: {
        defaultPeriodDays: 14,
        maxBooksPerUser: 5,
        defaultFineAmount: 1.00,
        maxRenewals: 2
    },

    // Security Settings
    security: {
        sessionTimeoutMinutes: 30,
        passwordMinLength: 6,
        maxLoginAttempts: 5
    },

    // UPI Payment Settings (optional)
    upi: {
        payeeName: "Your Library Name",
        vpa: "yourlibrary@upi"
    },

    // Feature Flags
    features: {
        emailNotifications: false,
        smsNotifications: false,
        bookReservations: true,
        autoRenewal: false,
        upiPayments: true
    },

    // Development Settings
    dev: {
        debugMode: true,
        logLevel: "debug"  // 'debug', 'info', 'warn', 'error'
    }
};

console.log('⚠️ Using EXAMPLE configuration - please create env-config.js with your actual values');
