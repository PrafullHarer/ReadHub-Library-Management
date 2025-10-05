// Firebase Initialization for Library Management System
console.log('🚀 Starting Firebase initialization...');

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

console.log('📦 Firebase modules imported successfully');

// Firebase Configuration - Embedded directly to avoid import issues
const firebaseConfig = {
    apiKey: "AIzaSyB23aqjvtZEBFatxsJf2Xz3UnKIv4T6C_g",
    authDomain: "library-management-35906.firebaseapp.com",
    databaseURL: "https://library-management-35906-default-rtdb.firebaseio.com",
    projectId: "library-management-35906",
    storageBucket: "library-management-35906.firebasestorage.app",
    messagingSenderId: "204321553381",
    appId: "1:204321553381:web:0ee02854d1c2fd3a1fcd0c",
    measurementId: "G-L9LKBLT153"
};

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
