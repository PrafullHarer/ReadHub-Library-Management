/**
 * Environment Configuration Loader for ReadHub Library Management System
 * 
 * This module provides a centralized way to manage environment configuration.
 * Since browsers cannot directly read .env files, this module:
 * 1. Provides default configuration values
 * 2. Can be configured via env-config.js (generated from .env)
 * 
 * For development: Update the values in this file or create env-config.js
 * For production: Use your build process to inject environment variables
 */

// Default configuration (can be overridden by env-config.js)
const defaultConfig = {
    // Firebase Configuration
    firebase: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: ''
    },

    // Application Settings
    app: {
        name: 'ReadHub Library Management System',
        version: '1.1.0',
        environment: 'development'
    },

    // Library Configuration
    library: {
        name: 'ReadHub Library',
        address: 'KIT College of Engineering, Kolhapur, Maharashtra, India',
        phone: '+91 99999 99999',
        email: 'contact@readhub.com'
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
        payeeName: 'ReadHub Library',
        vpa: 'readhub@upi'
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
        logLevel: 'debug'
    }
};

// Try to load custom configuration from env-config.js (generated from .env)
let customConfig = {};
try {
    if (typeof window !== 'undefined' && window.ENV_CONFIG) {
        customConfig = window.ENV_CONFIG;
    }
} catch (e) {
    console.warn('No custom environment configuration found, using defaults');
}

// Deep merge helper function
function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

// Merge configurations
const config = deepMerge(defaultConfig, customConfig);

// Firebase configuration object for Firebase SDK
const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    databaseURL: config.firebase.databaseURL,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
    measurementId: config.firebase.measurementId
};

// Validate Firebase configuration
function validateFirebaseConfig() {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field =>
        !firebaseConfig[field] || firebaseConfig[field] === ''
    );

    if (missingFields.length > 0) {
        console.error('Firebase configuration is incomplete. Missing:', missingFields);
        console.error('Please configure env-config.js with your Firebase settings.');
        return false;
    }

    return true;
}

// Check if running in development mode
function isDevelopment() {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            config.app.environment === 'development';
    }
    return config.app.environment === 'development';
}

// Get configuration value by path (e.g., 'firebase.apiKey')
function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = config;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }

    return value;
}

// Export configuration
window.ENV = {
    config,
    firebaseConfig,
    validateFirebaseConfig,
    isDevelopment,
    getConfig
};

// Also export individual items for convenience
window.firebaseConfig = firebaseConfig;

console.log('✅ Environment configuration loaded');
if (isDevelopment()) {
    console.log('🔧 Running in development mode');
}
