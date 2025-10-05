// Firebase Configuration Template for Library Management System
// Copy this file to config.js and replace the values with your actual Firebase project configuration
// You can get these values from your Firebase Console -> Project Settings -> General -> Your apps

export const firebaseConfig = {
    apiKey: "AIzaSyB23aqjvtZEBFatxsJf2Xz3UnKIv4T6C_g",
    authDomain: "library-management-35906.firebaseapp.com",
    databaseURL: "https://library-management-35906-default-rtdb.firebaseio.com",
    projectId: "library-management-35906",
    storageBucket: "library-management-35906.firebasestorage.app",
    messagingSenderId: "204321553381",
    appId: "1:204321553381:web:0ee02854d1c2fd3a1fcd0c",
    measurementId: "G-L9LKBLT153"
  };
  

// Environment check
export const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Configuration validation
export function validateConfig() {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => 
        !firebaseConfig[field] || firebaseConfig[field].includes('your-')
    );
    
    if (missingFields.length > 0) {
        console.error('Firebase configuration is incomplete. Missing or placeholder values for:', missingFields);
        console.error('Please update config.js with your actual Firebase project configuration.');
        return false;
    }
    
    return true;
}
