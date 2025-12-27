// Firebase Initialization for Library Management System
console.log('🚀 Starting Firebase initialization...');

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

console.log('📦 Firebase modules imported successfully');

// Get Firebase Configuration from environment
// The env-config.js should be loaded before this script in HTML
const firebaseConfig = window.firebaseConfig || window.ENV?.firebaseConfig;

if (!firebaseConfig || !firebaseConfig.apiKey) {
    console.error('❌ Firebase configuration not found!');
    console.error('Please ensure env-config.js is loaded before firebase-init.js');
    throw new Error('Firebase configuration not found. Please check env-config.js');
}

console.log('⚙️ Firebase configuration loaded:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
console.log('🔥 Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

console.log('🔐 Setting up Firebase Auth...');
const auth = getAuth(app);
console.log('✅ Firebase Auth ready');

console.log('🗄️ Setting up Firestore...');
const db = getFirestore(app);
console.log('✅ Firestore ready');

// Make Firebase services globally available
console.log('🌐 Making Firebase services globally available...');
window.firebaseAuth = auth;
window.firebaseDb = db;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.onAuthStateChanged = onAuthStateChanged;

// Firestore functions
window.getDoc = getDoc;
window.doc = doc;
window.setDoc = setDoc;
window.collection = collection;
window.getDocs = getDocs;
window.addDoc = addDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.query = query;
window.where = where;
window.orderBy = orderBy;

console.log('✅ Firebase services exported to window object');

// Signal that Firebase is ready
window.firebaseReady = true;
console.log('🎉 Firebase initialization completed successfully');

// Dispatch a custom event to signal Firebase is ready
console.log('📡 Dispatching firebaseReady event...');
window.dispatchEvent(new CustomEvent('firebaseReady'));
console.log('✅ firebaseReady event dispatched');
