# 📚 ReadHub API Reference

This document provides a complete reference for all Firebase Firestore operations used in ReadHub.

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Users API](#users-api)
3. [Members API](#members-api)
4. [Books API](#books-api)
5. [Borrowed Books API](#borrowed-books-api)
6. [Feedback API](#feedback-api)
7. [Error Handling](#error-handling)

---

## 🔐 Authentication

### Sign In

```javascript
/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<UserCredential>}
 */
async function signIn(email, password) {
    return await firebase.auth()
        .signInWithEmailAndPassword(email, password);
}
```

### Sign Out

```javascript
/**
 * Sign out current user
 * @returns {Promise<void>}
 */
async function signOut() {
    return await firebase.auth().signOut();
}
```

### Get Current User

```javascript
/**
 * Get currently signed in user
 * @returns {User|null}
 */
function getCurrentUser() {
    return firebase.auth().currentUser;
}
```

### Auth State Observer

```javascript
/**
 * Listen for auth state changes
 * @param {function} callback - Callback function
 */
function onAuthStateChanged(callback) {
    firebase.auth().onAuthStateChanged(callback);
}
```

---

## 👤 Users API

### Get All Users

```javascript
/**
 * Fetch all users from Firestore
 * @returns {Promise<Array<User>>}
 */
async function getAllUsers() {
    const snapshot = await firebase.firestore()
        .collection('users')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get User by ID

```javascript
/**
 * Fetch a single user by ID
 * @param {string} userId - User document ID
 * @returns {Promise<User|null>}
 */
async function getUserById(userId) {
    const doc = await firebase.firestore()
        .collection('users')
        .doc(userId)
        .get();
    
    if (doc.exists) {
        return { id: doc.id, ...doc.data() };
    }
    return null;
}
```

### Create User

```javascript
/**
 * Create a new user with authentication
 * @param {Object} userData - User data
 * @returns {Promise<string>} - New user ID
 */
async function createUser(userData) {
    // Create auth account
    const userCredential = await firebase.auth()
        .createUserWithEmailAndPassword(userData.email, userData.password);
    
    const userId = userCredential.user.uid;
    
    // Create user document
    await firebase.firestore()
        .collection('users')
        .doc(userId)
        .set({
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role || 'user',
            status: 'active',
            joinedDate: firebase.firestore.FieldValue.serverTimestamp()
        });
    
    return userId;
}
```

### Update User

```javascript
/**
 * Update user data
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
async function updateUser(userId, updateData) {
    await firebase.firestore()
        .collection('users')
        .doc(userId)
        .update(updateData);
}
```

### Delete User

```javascript
/**
 * Delete a user (Admin only)
 * @param {string} userId - User ID to delete
 * @returns {Promise<void>}
 */
async function deleteUser(userId) {
    // Delete member document first
    const memberQuery = await firebase.firestore()
        .collection('members')
        .where('userId', '==', userId)
        .get();
    
    memberQuery.docs.forEach(async (doc) => {
        await doc.ref.delete();
    });
    
    // Delete user document
    await firebase.firestore()
        .collection('users')
        .doc(userId)
        .delete();
}
```

### Update User Status

```javascript
/**
 * Update user account status
 * @param {string} userId - User ID
 * @param {string} status - New status ('active'|'pending'|'suspended')
 * @returns {Promise<void>}
 */
async function updateUserStatus(userId, status) {
    await firebase.firestore()
        .collection('users')
        .doc(userId)
        .update({ status });
}
```

---

## 👥 Members API

### Get All Members

```javascript
/**
 * Fetch all member profiles
 * @returns {Promise<Array<Member>>}
 */
async function getAllMembers() {
    const snapshot = await firebase.firestore()
        .collection('members')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get Member by User ID

```javascript
/**
 * Get member profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Member|null>}
 */
async function getMemberByUserId(userId) {
    const snapshot = await firebase.firestore()
        .collection('members')
        .where('userId', '==', userId)
        .limit(1)
        .get();
    
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
    return null;
}
```

### Create Member Profile

```javascript
/**
 * Create a new member profile
 * @param {Object} memberData - Member data
 * @returns {Promise<string>} - New member ID
 */
async function createMember(memberData) {
    const docRef = await firebase.firestore()
        .collection('members')
        .add({
            ...memberData,
            enrollmentDate: firebase.firestore.FieldValue.serverTimestamp(),
            membershipStatus: 'active'
        });
    
    return docRef.id;
}
```

### Update Member

```javascript
/**
 * Update member profile
 * @param {string} memberId - Member document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
async function updateMember(memberId, updateData) {
    await firebase.firestore()
        .collection('members')
        .doc(memberId)
        .update(updateData);
}
```

---

## 📚 Books API

### Get All Books

```javascript
/**
 * Fetch all books
 * @returns {Promise<Array<Book>>}
 */
async function getAllBooks() {
    const snapshot = await firebase.firestore()
        .collection('books')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get Available Books

```javascript
/**
 * Get only available books
 * @returns {Promise<Array<Book>>}
 */
async function getAvailableBooks() {
    const snapshot = await firebase.firestore()
        .collection('books')
        .where('availability', '==', 'available')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get Book by ID

```javascript
/**
 * Get a single book by ID
 * @param {string} bookId - Book document ID
 * @returns {Promise<Book|null>}
 */
async function getBookById(bookId) {
    const doc = await firebase.firestore()
        .collection('books')
        .doc(bookId)
        .get();
    
    if (doc.exists) {
        return { id: doc.id, ...doc.data() };
    }
    return null;
}
```

### Search Books

```javascript
/**
 * Search books by title or author
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array<Book>>}
 */
async function searchBooks(searchTerm) {
    const allBooks = await getAllBooks();
    const lowerSearch = searchTerm.toLowerCase();
    
    return allBooks.filter(book => 
        book.title.toLowerCase().includes(lowerSearch) ||
        book.author.toLowerCase().includes(lowerSearch) ||
        book.isbn.includes(searchTerm)
    );
}
```

### Add Book

```javascript
/**
 * Add a new book to the library
 * @param {Object} bookData - Book data
 * @returns {Promise<string>} - New book ID
 */
async function addBook(bookData) {
    const docRef = await firebase.firestore()
        .collection('books')
        .add({
            ...bookData,
            availability: 'available',
            addedDate: firebase.firestore.FieldValue.serverTimestamp(),
            addedBy: firebase.auth().currentUser.uid
        });
    
    return docRef.id;
}
```

### Update Book

```javascript
/**
 * Update book information
 * @param {string} bookId - Book ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
async function updateBook(bookId, updateData) {
    await firebase.firestore()
        .collection('books')
        .doc(bookId)
        .update({
            ...updateData,
            updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: firebase.auth().currentUser.uid
        });
}
```

### Delete Book

```javascript
/**
 * Delete a book
 * @param {string} bookId - Book ID
 * @returns {Promise<void>}
 */
async function deleteBook(bookId) {
    await firebase.firestore()
        .collection('books')
        .doc(bookId)
        .delete();
}
```

### Update Book Availability

```javascript
/**
 * Update book availability status
 * @param {string} bookId - Book ID
 * @param {string} availability - Status ('available'|'borrowed'|'maintenance')
 * @returns {Promise<void>}
 */
async function updateBookAvailability(bookId, availability) {
    await firebase.firestore()
        .collection('books')
        .doc(bookId)
        .update({ availability });
}
```

---

## 📖 Borrowed Books API

### Get All Borrowings

```javascript
/**
 * Get all borrowing records
 * @returns {Promise<Array<BorrowedBook>>}
 */
async function getAllBorrowings() {
    const snapshot = await firebase.firestore()
        .collection('borrowedBooks')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get User Borrowings

```javascript
/**
 * Get borrowings for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array<BorrowedBook>>}
 */
async function getUserBorrowings(userId) {
    const snapshot = await firebase.firestore()
        .collection('borrowedBooks')
        .where('borrowerId', '==', userId)
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get Active Borrowings

```javascript
/**
 * Get only active (not returned) borrowings
 * @returns {Promise<Array<BorrowedBook>>}
 */
async function getActiveBorrowings() {
    const snapshot = await firebase.firestore()
        .collection('borrowedBooks')
        .where('status', 'in', ['active', 'overdue'])
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Borrow Book

```javascript
/**
 * Create a new borrowing record
 * @param {Object} borrowingData - Borrowing details
 * @returns {Promise<string>} - Borrowing ID
 */
async function borrowBook(borrowingData) {
    const docRef = await firebase.firestore()
        .collection('borrowedBooks')
        .add({
            ...borrowingData,
            borrowDate: new Date().toISOString(),
            dueDate: calculateDueDate(14), // 14 days loan period
            status: 'active',
            extendedCount: 0
        });
    
    // Update book availability
    await updateBookAvailability(borrowingData.bookId, 'borrowed');
    
    return docRef.id;
}

/**
 * Calculate due date
 * @param {number} days - Number of days for loan
 * @returns {string} - ISO date string
 */
function calculateDueDate(days) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toISOString();
}
```

### Return Book

```javascript
/**
 * Mark a book as returned
 * @param {string} borrowingId - Borrowing record ID
 * @returns {Promise<void>}
 */
async function returnBook(borrowingId) {
    const borrowing = await getBorrowingById(borrowingId);
    
    // Update borrowing record
    await firebase.firestore()
        .collection('borrowedBooks')
        .doc(borrowingId)
        .update({
            returnDate: new Date().toISOString(),
            status: 'returned'
        });
    
    // Update book availability
    await updateBookAvailability(borrowing.bookId, 'available');
}
```

### Extend Loan

```javascript
/**
 * Extend loan period
 * @param {string} borrowingId - Borrowing ID
 * @param {number} additionalDays - Days to extend
 * @returns {Promise<void>}
 */
async function extendLoan(borrowingId, additionalDays = 7) {
    const doc = await firebase.firestore()
        .collection('borrowedBooks')
        .doc(borrowingId)
        .get();
    
    const data = doc.data();
    const currentDueDate = new Date(data.dueDate);
    currentDueDate.setDate(currentDueDate.getDate() + additionalDays);
    
    await doc.ref.update({
        dueDate: currentDueDate.toISOString(),
        extendedCount: (data.extendedCount || 0) + 1
    });
}
```

### Check Overdue

```javascript
/**
 * Check and update overdue status
 * @returns {Promise<void>}
 */
async function checkAndUpdateOverdue() {
    const activeBorrowings = await getActiveBorrowings();
    const now = new Date();
    
    for (const borrowing of activeBorrowings) {
        if (new Date(borrowing.dueDate) < now && borrowing.status === 'active') {
            await firebase.firestore()
                .collection('borrowedBooks')
                .doc(borrowing.id)
                .update({ status: 'overdue' });
        }
    }
}
```

---

## 💬 Feedback API

### Get All Feedback

```javascript
/**
 * Get all feedback (Admin only)
 * @returns {Promise<Array<Feedback>>}
 */
async function getAllFeedback() {
    const snapshot = await firebase.firestore()
        .collection('feedback')
        .orderBy('createdAt', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Get Feedback by Status

```javascript
/**
 * Get feedback filtered by status
 * @param {string} status - Feedback status
 * @returns {Promise<Array<Feedback>>}
 */
async function getFeedbackByStatus(status) {
    const snapshot = await firebase.firestore()
        .collection('feedback')
        .where('status', '==', status)
        .orderBy('createdAt', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
```

### Submit Feedback

```javascript
/**
 * Submit new feedback
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<string>} - Feedback ID
 */
async function submitFeedback(feedbackData) {
    const docRef = await firebase.firestore()
        .collection('feedback')
        .add({
            ...feedbackData,
            status: 'new',
            priority: 'medium',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    
    return docRef.id;
}
```

### Update Feedback Status

```javascript
/**
 * Update feedback status (Admin only)
 * @param {string} feedbackId - Feedback ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
async function updateFeedbackStatus(feedbackId, status) {
    await firebase.firestore()
        .collection('feedback')
        .doc(feedbackId)
        .update({
            status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: firebase.auth().currentUser.uid
        });
}
```

### Add Admin Response

```javascript
/**
 * Add admin response to feedback
 * @param {string} feedbackId - Feedback ID
 * @param {string} response - Admin response
 * @returns {Promise<void>}
 */
async function addAdminResponse(feedbackId, response) {
    await firebase.firestore()
        .collection('feedback')
        .doc(feedbackId)
        .update({
            adminResponse: response,
            status: 'in-progress',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: firebase.auth().currentUser.uid
        });
}
```

### Delete Feedback

```javascript
/**
 * Delete feedback (Admin only)
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<void>}
 */
async function deleteFeedback(feedbackId) {
    await firebase.firestore()
        .collection('feedback')
        .doc(feedbackId)
        .delete();
}
```

---

## ⚠️ Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `permission-denied` | Firestore security rules blocked the operation | Check user authentication and roles |
| `not-found` | Document does not exist | Verify document ID |
| `already-exists` | Document already exists | Use update instead of create |
| `invalid-argument` | Invalid data format | Validate input data |
| `unavailable` | Service unavailable | Retry after a moment |
| `auth/wrong-password` | Incorrect password | Verify password |
| `auth/user-not-found` | User doesn't exist | Check email address |
| `auth/email-already-in-use` | Email is taken | Use different email |

### Error Handler Function

```javascript
/**
 * Handle Firebase errors
 * @param {Error} error - Firebase error object
 * @returns {string} - User-friendly error message
 */
function handleFirebaseError(error) {
    const errorMessages = {
        'permission-denied': 'You do not have permission to perform this action.',
        'not-found': 'The requested item was not found.',
        'already-exists': 'This item already exists.',
        'invalid-argument': 'Invalid data provided. Please check your input.',
        'unavailable': 'Service is temporarily unavailable. Please try again.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.'
    };
    
    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
}
```

### Usage Example

```javascript
try {
    await borrowBook(borrowingData);
    showSuccess('Book borrowed successfully!');
} catch (error) {
    const message = handleFirebaseError(error);
    showError(message);
    console.error('Borrow error:', error);
}
```

---

## 📝 Notes

- All timestamps use `firebase.firestore.FieldValue.serverTimestamp()`
- User IDs are the Firebase Authentication UIDs
- Always check authentication before performing operations
- Use batch operations for multiple writes
- Implement proper pagination for large collections

---

*Last Updated: December 2025*
