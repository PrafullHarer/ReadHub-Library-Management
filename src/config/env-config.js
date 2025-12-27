/**
 * Environment Configuration for ReadHub Library Management System
 * 
 * INSTRUCTIONS:
 * 1. Copy this file or rename it to env-config.js
 * 2. Update the values below with your actual Firebase configuration
 * 3. This file is loaded before other scripts to provide configuration
 * 
 * SECURITY NOTE:
 * - Add env-config.js to your .gitignore file
 * - Never commit your actual API keys to version control
 * - For production, use your deployment platform's environment variables
 */

window.ENV_CONFIG = {
    // Firebase Configuration - Get these from Firebase Console
    firebase: {
        apiKey: "AIzaSyB23aqjvtZEBFatxsJf2Xz3UnKIv4T6C_g",
        authDomain: "library-management-35906.firebaseapp.com",
        databaseURL: "https://library-management-35906-default-rtdb.firebaseio.com",
        projectId: "library-management-35906",
        storageBucket: "library-management-35906.firebasestorage.app",
        messagingSenderId: "204321553381",
        appId: "1:204321553381:web:0ee02854d1c2fd3a1fcd0c",
        measurementId: "G-L9LKBLT153"
    },

    // Application Settings
    app: {
        name: "ReadHub Library Management System",
        version: "1.1.0",
        environment: "development"  // 'development' or 'production'
    },

    // Library Configuration
    library: {
        name: "ReadHub Library",
        address: "KIT College of Engineering, Kolhapur, Maharashtra, India",
        phone: "+91 99999 99999",
        email: "contact@readhub.com"
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

    // UPI Payment Settings
    upi: {
        payeeName: "ReadHub Library",
        vpa: "readhub@upi"
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
        logLevel: "debug"
    }
};

console.log('✅ Custom environment configuration loaded');
