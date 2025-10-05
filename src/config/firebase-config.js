// Firebase Configuration for Library Management System
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, validateConfig } from './config.js';

// Validate configuration before initializing Firebase
if (!validateConfig()) {
    throw new Error('Firebase configuration is invalid. Please check config.js');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
