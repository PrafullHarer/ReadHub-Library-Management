// Firebase Authentication for Library Management System

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Mobile-specific optimizations
function initializeMobileOptimizations() {
    // Prevent zoom on input focus (iOS Safari)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth <= 768) {
                // Prevent zoom on iOS
                const viewport = document.querySelector('meta[name=viewport]');
                if (viewport) {
                    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                }
            }
        });
        
        input.addEventListener('blur', function() {
            if (window.innerWidth <= 768) {
                // Restore zoom capability
                const viewport = document.querySelector('meta[name=viewport]');
                if (viewport) {
                    viewport.content = 'width=device-width, initial-scale=1.0';
                }
            }
        });
    });
    
    // Optimize touch interactions
    const buttons = document.querySelectorAll('button, .submit-button, .back-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            // Add touch feedback
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        button.addEventListener('touchend', function(e) {
            // Remove touch feedback
            this.style.transform = 'scale(1)';
        }, { passive: true });
        
        button.addEventListener('touchcancel', function(e) {
            // Remove touch feedback if cancelled
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        // Delay to ensure proper rendering after orientation change
        setTimeout(function() {
            // Recalculate viewport height for mobile browsers
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
    });
    
    // Set initial viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Prevent pull-to-refresh on mobile
    let startY = 0;
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const currentY = e.touches[0].clientY;
        if (currentY > startY && window.scrollY === 0) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Optimize form submission for mobile
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // Hide virtual keyboard on mobile after form submission
            if (window.innerWidth <= 768) {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.blur) {
                    activeElement.blur();
                }
            }
        });
    }
}

// Enhanced mobile form validation
function validateMobileForm(formData) {
    const errors = [];
    
    // Check email format
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Check password length
    if (!formData.password || formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    // Check user type selection
    if (!formData.userType) {
        errors.push('Please select your account type');
    }
    
    return errors;
}

// Mobile-friendly error display
function showMobileError(message) {
    const errorContainer = document.getElementById('errorMessage');
    if (errorContainer) {
        const messageText = errorContainer.querySelector('.message-text');
        if (messageText) {
            messageText.textContent = message;
        }
        errorContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
        
        // Scroll to error message on mobile
        if (window.innerWidth <= 768) {
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Mobile-friendly success display
function showMobileSuccess(message) {
    const successContainer = document.getElementById('successMessage');
    if (successContainer) {
        const messageText = successContainer.querySelector('.message-text');
        if (messageText) {
            messageText.textContent = message;
        }
        successContainer.style.display = 'block';
        
        // Auto-hide after 3 seconds on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                successContainer.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize app when Firebase is ready
function initializeApp() {
    if (window.firebaseAuth) {
        // Check if user is already logged in
        checkAuthState();
    } else {
        console.error('Firebase not loaded properly');
    }
}

// Check authentication state
function checkAuthState() {
    if (window.onAuthStateChanged && window.firebaseAuth) {
        window.onAuthStateChanged(window.firebaseAuth, (user) => {
            if (user) {
                // User is signed in
                
                // Check if we have stored user data
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
                
                if (currentUser && currentUser.uid === user.uid) {
                    // We have stored user data, redirect to dashboard
                    redirectToDashboard(user);
                } else {
                    // No stored user data, don't redirect automatically
                }
            } else {
                // User is signed out
            }
        });
    }
}

// Handle Login Form Submission
async function handleLogin(e) {
    e.preventDefault();
    
    // Check if Firebase functions are available
    if (!window.signInWithEmailAndPassword || !window.firebaseAuth) {
        console.error('❌ Firebase functions not available');
        showError('Authentication system is not ready. Please refresh the page and try again.');
        return;
    }
    
    const formData = new FormData(loginForm);
    const userType = formData.get('userType');
    const email = formData.get('email').trim();
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    
    // Validate input
    if (!userType || !email || !password) {
        showError('Please fill in all required fields.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        // Sign in with Firebase
        const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = userCredential.user;
        
        // Get user data from Firestore
        const userData = await getUserDataFromFirestore(user.uid);
        
        // Check both userType and role fields for compatibility
        const userRole = userData?.userType || userData?.role;
        
        if (userData && userRole === userType) {
            // Store user session
            const sessionData = {
                uid: user.uid,
                email: user.email,
                userType: userRole,
                fullName: userData.fullName || userData.name,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };
            
            
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
            }
            
            showSuccess('Login successful! Redirecting...');
            
            // Redirect after a short delay
            setTimeout(() => {
                redirectToDashboard(user);
            }, 1500);
            
        } else {
            // User type doesn't match
            await window.signOut(window.firebaseAuth);
            showError('Invalid account type. Please select the correct account type.');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        handleAuthError(error);
    } finally {
        // Reset button state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        submitBtn.disabled = false;
    }
}

// Handle Registration Form Submission
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const userType = formData.get('regUserType');
    const email = formData.get('regEmail').trim();
    const password = formData.get('regPassword');
    const confirmPassword = formData.get('confirmPassword');
    const fullName = formData.get('fullName').trim();
    
    // Validate input
    if (!userType || !email || !password || !confirmPassword || !fullName) {
        showError('Please fill in all required fields.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }
    
    if (fullName.length < 2) {
        showError('Full name must be at least 2 characters long.');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Create user with Firebase
        const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        const userData = {
            uid: user.uid,
            email: email,
            fullName: fullName,
            userType: userType,
            registrationDate: new Date().toISOString(),
            borrowingHistory: [],
            isActive: true
        };
        
        await window.setDoc(window.doc(window.firebaseDb, 'users', user.uid), userData);
        
        showSuccess('Account created successfully! You can now log in.');
        
        // Switch to login form
        setTimeout(() => {
            showLoginForm();
            registerForm.reset();
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        handleAuthError(error);
    } finally {
        // Reset button state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        submitBtn.disabled = false;
    }
}

// Get user data from Firestore
async function getUserDataFromFirestore(uid) {
    try {
        const userDoc = await window.getDoc(window.doc(window.firebaseDb, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Handle authentication errors
function handleAuthError(error) {
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists.';
            break;
        case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
        case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
        case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection.';
            break;
        default:
            errorMessage = error.message || 'An unexpected error occurred.';
    }
    
    showError(errorMessage);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(message) {
    hideMessages();
    if (errorMessage) {
        errorMessage.querySelector('.message-text').textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }, 5000);
}

// Show success message
function showSuccess(message) {
    hideMessages();
    if (successMessage) {
        successMessage.querySelector('.message-text').textContent = message;
        successMessage.style.display = 'block';
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }, 3000);
}

// Hide all messages
function hideMessages() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Toggle register password visibility
function toggleRegisterPassword() {
    const passwordInput = document.getElementById('regPassword');
    const toggleIcon = document.getElementById('regPasswordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Show registration form
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    hideMessages();
}

// Show login form
function showLoginForm() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    hideMessages();
}

// Redirect to dashboard
function redirectToDashboard(user) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    
    
    if (currentUser) {
        if (currentUser.userType === 'admin') {
            // Redirect to admin dashboard
            window.location.href = 'admin-dashboard.html';
        } else {
            // Redirect to user dashboard
            window.location.href = 'user-dashboard.html';
        }
    } else {
        // Fallback to welcome page
        window.location.href = 'index.html';
    }
}

// Logout function
async function logout() {
    try {
        if (window.signOut && window.firebaseAuth) {
            await window.signOut(window.firebaseAuth);
        }
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local storage and redirect
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Get current user info
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}


// Message display function for login page compatibility
function showMessage(message, type) {
    if (type === 'error') {
        showError(message);
    } else if (type === 'success') {
        showSuccess(message);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile optimizations first
    initializeMobileOptimizations();
    
    // Wait for Firebase to be ready
    if (window.firebaseReady) {
        initializeApp();
    } else {
        // Listen for Firebase ready event
        window.addEventListener('firebaseReady', initializeApp);
    }
    
    // Add form event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Initialize app when Firebase is ready
function initializeApp() {
    if (window.firebaseAuth) {
        // Check if user is already logged in
        checkAuthState();
    } else {
        console.error('Firebase not loaded properly');
    }
}

// Check authentication state
function checkAuthState() {
    if (window.onAuthStateChanged && window.firebaseAuth) {
        window.onAuthStateChanged(window.firebaseAuth, (user) => {
            if (user) {
                // User is signed in
                
                // Check if we have stored user data
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
                
                if (currentUser && currentUser.uid === user.uid) {
                    // We have stored user data, redirect to dashboard
                    redirectToDashboard(user);
                } else {
                    // No stored user data, stay on login page
                    console.log('User signed in but no stored data found');
                }
            } else {
                // User is signed out
                console.log('User signed out');
            }
        });
    }
}