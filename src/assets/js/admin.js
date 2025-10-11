// Admin Dashboard JavaScript

// Global variables
let currentUser = null;
let books = [];
let users = [];
let filteredBooks = [];
let feedback = [];
let filteredFeedback = [];

// Initialize admin dashboard
function initializeAdminDashboard() {
    loadDashboardData();
    setupEventListeners();
    // Setup real-time listener for borrowed books
    if (window.onSnapshot) {
        setupBorrowedBooksListener();
    } else {
        console.warn('⚠️ Real-time listener not available yet, will retry in 1 second...');
        setTimeout(() => {
            if (window.onSnapshot) {
                setupBorrowedBooksListener();
            }
        }, 1000);
    }
    
    // Also load borrowed books initially as a fallback
    setTimeout(() => {
        if (borrowedBooks.length === 0) {
            console.log('Loading borrowed books as fallback...');
            loadBorrowedBooks();
        }
    }, 2000);
}

// Check admin status
async function checkAdminStatus(user) {
    try {
        const userDoc = await window.getDoc(window.doc(window.firebaseDb, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.role === 'admin') {
                currentUser = user;
                const displayName = userData.name || user.email;
                document.getElementById('adminName').textContent = displayName;
                loadDashboardData();
            } else {
                // Check if this is a newly created user (created within last 5 seconds)
                const userCreationTime = user.metadata?.creationTime;
                const now = new Date();
                const creationTime = new Date(userCreationTime);
                const timeDiff = now - creationTime;
                
                if (timeDiff < 5000) { // Less than 5 seconds ago
                    return; // Just ignore this authentication state change
                }
                
                showMessage('Access denied. Admin privileges required.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        } else {
            console.warn('⚠️ User document not found in Firestore');
            // Check if this is a newly created user without a profile yet
            const userCreationTime = user.metadata?.creationTime;
            const now = new Date();
            const creationTime = new Date(userCreationTime);
            const timeDiff = now - creationTime;
            
            if (timeDiff < 5000) { // Less than 5 seconds ago
                return; // Just ignore this authentication state change
            }
            
            showMessage('User profile not found.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        console.error('❌ Error checking admin status:', error);
        showMessage('Error verifying admin status.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Load dashboard data
async function loadDashboardData() {
    // Check if Firebase functions are available
    if (!window.collection || !window.getDocs || !window.firebaseDb) {
        console.error('❌ Firebase functions not available for dashboard data loading');
        showMessage('Firebase functions not ready. Please refresh the page and try again.', 'error');
        return;
    }
    
    try {
        await Promise.all([
            loadBooks(),
            loadUsers(),
            loadFeedback(),
            loadStats()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showMessage('Error loading dashboard data.', 'error');
    }
}

// Load books from Firestore
async function loadBooks() {
    try {
        const booksSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'books'));
        books = [];
        booksSnapshot.forEach(doc => {
            books.push({ id: doc.id, ...doc.data() });
        });
        filteredBooks = [...books];
        renderBooksTable();
    } catch (error) {
        console.error('Error loading books:', error);
        showMessage('Error loading books.', 'error');
    }
}

// Load users from Firestore
async function loadUsers() {
    try {
        const usersSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'users'));
        users = [];
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        renderUsersTable();
    } catch (error) {
        console.error('Error loading users:', error);
        showMessage('Error loading users.', 'error');
    }
}

// Load members from Firestore
async function loadMembers() {
    try {
        const membersSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'members'));
        const members = [];
        membersSnapshot.forEach(doc => {
            members.push({ id: doc.id, ...doc.data() });
        });
        return members;
    } catch (error) {
        console.error('Error loading members:', error);
        showMessage('Error loading members.', 'error');
        return [];
    }
}

// Load feedback from Firestore
async function loadFeedback() {
    try {
        const feedbackSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'feedback'));
        feedback = [];
        feedbackSnapshot.forEach(doc => {
            feedback.push({ id: doc.id, ...doc.data() });
        });
        filteredFeedback = [...feedback];
        renderFeedbackTable();
        updateFeedbackStats();
    } catch (error) {
        console.error('Error loading feedback:', error);
        showMessage('Error loading feedback.', 'error');
    }
}

// Load dashboard statistics
async function loadStats() {
    try {
        const totalBooks = books.length;
        const totalUsers = users.length;
        const borrowedBooks = books.filter(book => book.availability === 'borrowed').length;
        const pendingRequests = users.filter(user => user.status === 'pending').length;
        const overdueBooks = 0; // This would be calculated from borrowed books with overdue dates

        document.getElementById('totalBooks').textContent = totalBooks;
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('borrowedBooks').textContent = borrowedBooks;
        document.getElementById('pendingRequests').textContent = pendingRequests;
        document.getElementById('overdueBooks').textContent = overdueBooks;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Render books table
function renderBooksTable() {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';

    filteredBooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><span class="status-badge status-${book.availability}">${book.availability}</span></td>
            <td>${book.condition || 'Good'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="openEditBookModal('${book.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteBook('${book.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render users table
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.role || 'user'}</td>
            <td><span class="status-badge status-${user.status || 'active'}">${user.status || 'active'}</span></td>
            <td>${user.joinDate ? new Date(user.joinDate.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="openEditUserModal('${user.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.status === 'pending' ? 
                        `<button class="btn-action btn-approve" onclick="approveUser('${user.id}')" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>` : ''
                    }
                    <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render feedback table
function renderFeedbackTable() {
    const tbody = document.getElementById('feedbackTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (filteredFeedback.length === 0) {
        tbody.innerHTML = `
            <tr class="no-data">
                <td colspan="6">
                    <div class="no-data-message">
                        <i class="fas fa-comments" aria-hidden="true"></i>
                        <p>No feedback found</p>
                        <small>User feedback will appear here</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    filteredFeedback.forEach(feedbackItem => {
        const row = document.createElement('tr');
        const statusClass = getFeedbackStatusClass(feedbackItem.status);
        const typeClass = getFeedbackTypeClass(feedbackItem.type);
        const priorityClass = getFeedbackPriorityClass(feedbackItem.priority);
        
        row.innerHTML = `
            <td>
                <div class="feedback-info">
                    <h4>${feedbackItem.subject || 'No Subject'}</h4>
                    <p class="feedback-preview">${feedbackItem.message ? feedbackItem.message.substring(0, 100) + (feedbackItem.message.length > 100 ? '...' : '') : 'No message'}</p>
                </div>
            </td>
            <td>
                <div class="user-info">
                    <strong>${feedbackItem.userName || 'Anonymous'}</strong>
                    <p>${feedbackItem.userEmail || 'No email'}</p>
                </div>
            </td>
            <td>
                <div class="feedback-meta">
                    <span class="feedback-type-badge ${typeClass}">${feedbackItem.type || 'general'}</span>
                    <span class="priority-badge ${priorityClass}">${feedbackItem.priority || 'medium'}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${statusClass}">${feedbackItem.status || 'new'}</span>
            </td>
            <td>${formatDate(feedbackItem.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-primary" onclick="openFeedbackModal('${feedbackItem.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-warning" onclick="updateFeedbackStatus('${feedbackItem.id}', 'in-progress')" title="Mark In Progress">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-action btn-success" onclick="updateFeedbackStatus('${feedbackItem.id}', 'resolved')" title="Mark Resolved">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-action btn-danger" onclick="deleteFeedback('${feedbackItem.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update feedback statistics
function updateFeedbackStats() {
    const totalFeedback = feedback.length;
    const newFeedback = feedback.filter(f => f.status === 'new').length;
    const inProgressFeedback = feedback.filter(f => f.status === 'in-progress').length;
    const resolvedFeedback = feedback.filter(f => f.status === 'resolved').length;

    const totalElement = document.getElementById('totalFeedback');
    const newElement = document.getElementById('newFeedback');
    const inProgressElement = document.getElementById('inProgressFeedback');
    const resolvedElement = document.getElementById('resolvedFeedback');

    if (totalElement) totalElement.textContent = totalFeedback;
    if (newElement) newElement.textContent = newFeedback;
    if (inProgressElement) inProgressElement.textContent = inProgressFeedback;
    if (resolvedElement) resolvedElement.textContent = resolvedFeedback;
}

// Show section

// Open add book modal
function openAddBookModal() {
    document.getElementById('addBookModal').classList.add('active');
    document.getElementById('addBookForm').reset();
}

// Close add book modal
function closeAddBookModal() {
    document.getElementById('addBookModal').classList.remove('active');
}

// Open edit book modal
function openEditBookModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookAuthor').value = book.author;
        document.getElementById('editBookISBN').value = book.isbn;
        document.getElementById('editBookCondition').value = book.condition || 'good';
        document.getElementById('editBookAvailability').value = book.availability || 'available';
        document.getElementById('editBookDescription').value = book.description || '';
        
        document.getElementById('editBookModal').classList.add('active');
    }
}

// Close edit book modal
function closeEditBookModal() {
    document.getElementById('editBookModal').classList.remove('active');
}

// Open add user modal
function openAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
    document.getElementById('addUserForm').reset();
}

// Close add user modal
function closeAddUserModal() {
    document.getElementById('addUserModal').classList.remove('active');
}

// Open edit user modal
function openEditUserModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showMessage('User not found.', 'error');
        return;
    }
    
    // Populate form with user data
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserFullName').value = user.fullName || '';
    document.getElementById('editUserEmail').value = user.email || '';
    document.getElementById('editUserStatus').value = user.status || 'active';
    document.getElementById('editUserRole').value = user.role || 'user';
    
    // Load member data if available
    loadMemberDataForEdit(userId);
    
    document.getElementById('editUserModal').classList.add('active');
}

// Load member data for editing
async function loadMemberDataForEdit(userId) {
    try {
        const membersSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'members'));
        let memberData = null;
        
        membersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === userId) {
                memberData = { id: doc.id, ...data };
            }
        });
        
        if (memberData) {
            // Populate member-specific fields
            document.getElementById('editUserPhone').value = memberData.phone || '';
            document.getElementById('editUserStudentId').value = memberData.studentId || '';
            document.getElementById('editUserDepartment').value = memberData.department || '';
            document.getElementById('editUserYear').value = memberData.year || '';
            document.getElementById('editUserNotes').value = memberData.notes || '';
        }
    } catch (error) {
        console.error('Error loading member data:', error);
    }
}

// Close edit user modal
function closeEditUserModal() {
    document.getElementById('editUserModal').classList.remove('active');
    document.getElementById('editUserForm').reset();
}

// Handle edit user form submission
async function handleEditUser(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userId = formData.get('userId');
    
    // Update user data
    const userData = {
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        role: formData.get('role'),
        status: formData.get('status'),
        lastLogin: null // Keep existing lastLogin or set to null
    };
    
    // Update member data
    const memberData = {
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        studentId: formData.get('studentId'),
        department: formData.get('department'),
        year: formData.get('year'),
        notes: formData.get('notes'),
        updatedAt: new Date(),
        updatedBy: currentUser.uid
    };
    
    try {
        // Step 1: Update user record
        await window.updateDoc(
            window.doc(window.firebaseDb, 'users', userId), 
            userData
        );
        
        // Step 2: Find and update member record
        const membersSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'members'));
        let memberToUpdate = null;
        
        membersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === userId) {
                memberToUpdate = { id: doc.id, ...data };
            }
        });
        
        if (memberToUpdate) {
            await window.updateDoc(
                window.doc(window.firebaseDb, 'members', memberToUpdate.id), 
                memberData
            );
        } else {
        }
        
        showMessage('User details updated successfully!', 'success');
        closeEditUserModal();
        loadUsers();
        loadStats();
        
    } catch (error) {
        console.error('Error updating user:', error);
        let errorMessage = 'Error updating user. Please try again.';
        
        if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Check Firestore security rules.';
        }
        
        showMessage(errorMessage, 'error');
    }
}

// Handle add book form submission
async function handleAddBook(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn'),
        condition: formData.get('condition'),
        availability: 'available', // New books are always available
        description: formData.get('description'),
        addedDate: new Date(),
        addedBy: currentUser.uid
    };

    try {
        await window.addDoc(window.collection(window.firebaseDb, 'books'), bookData);
        showMessage('Book added successfully!', 'success');
        closeAddBookModal();
        loadBooks();
        loadStats();
    } catch (error) {
        console.error('Error adding book:', error);
        showMessage('Error adding book. Please try again.', 'error');
    }
}

// Handle add user form submission
async function handleAddUser(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    
    // Minimal user data for 'users' collection (only essential authentication fields)
    const userData = {
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        role: 'user', // All added users are regular users
        status: formData.get('status'),
        joinedDate: new Date(),
        lastLogin: null
    };
    
    // Complete member data for 'members' collection (all other details)
    const memberData = {
        // Reference to user ID
        userId: '', // Will be set after user creation
        
        // Basic member info
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        role: 'user',
        status: formData.get('status'),
        joinedDate: new Date(),
        
        // Detailed member information
        phone: formData.get('phone'),
        studentId: formData.get('studentId'),
        department: formData.get('department'),
        year: formData.get('year'),
        notes: formData.get('notes'),
        address: formData.get('address') || '',
        emergencyContact: formData.get('emergencyContact') || '',
        gender: formData.get('gender') || '',
        dateOfBirth: formData.get('dateOfBirth') || '',
        profilePicture: formData.get('profilePicture') || '',
        
        // Membership details
        membershipType: 'student',
        membershipStatus: 'active',
        libraryCardNumber: generateLibraryCardNumber(),
        
        // Administrative info
        createdBy: currentUser.uid,
        createdAt: new Date(),
        
        // User preferences
        preferences: {
            notifications: true,
            emailNotifications: true,
            smsNotifications: false,
            preferredLanguage: 'en'
        },
        
        // Academic info
        academicYear: formData.get('year'),
        semester: 'Fall', // Default semester
        enrollmentDate: new Date(),
        
        // Contact preferences
        contactMethods: {
            email: true,
            phone: false,
            sms: false
        }
    };

    try {
        // Step 1: Create user in Firebase Authentication
        const userCredential = await window.createUserWithEmailAndPassword(
            window.firebaseAuth, 
            userData.email, 
            password
        );
        
        
        // Step 2: Add basic user data to 'users' collection
        await window.setDoc(
            window.doc(window.firebaseDb, 'users', userCredential.user.uid), 
            userData
        );
        
        
        // Step 3: Add detailed member data to 'members' collection
        // Set the userId reference in member data
        memberData.userId = userCredential.user.uid;
        
        await window.addDoc(
            window.collection(window.firebaseDb, 'members'), 
            memberData
        );
        
        
        showMessage('User and member added successfully!', 'success');
        closeAddUserModal();
        loadUsers();
        loadStats();
    } catch (error) {
        console.error('Error adding user/member:', error);
        let errorMessage = 'Error adding user. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email address is already in use.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Check Firestore security rules.';
        }
        
        showMessage(errorMessage, 'error');
    }
}

// Handle edit book form submission
async function handleEditBook(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookId = formData.get('id');
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn'),
        condition: formData.get('condition'),
        availability: formData.get('availability'),
        description: formData.get('description'),
        updatedDate: new Date(),
        updatedBy: currentUser.uid
    };

    try {
        await window.updateDoc(window.doc(window.firebaseDb, 'books', bookId), bookData);
        showMessage('Book updated successfully!', 'success');
        closeEditBookModal();
        loadBooks();
    } catch (error) {
        console.error('Error updating book:', error);
        showMessage('Error updating book. Please try again.', 'error');
    }
}

// Delete book
async function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        try {
            await window.deleteDoc(window.doc(window.firebaseDb, 'books', bookId));
            showMessage('Book deleted successfully!', 'success');
            loadBooks();
            loadStats();
        } catch (error) {
            console.error('Error deleting book:', error);
            showMessage('Error deleting book. Please try again.', 'error');
        }
    }
}

// Approve user
async function approveUser(userId) {
    try {
        await window.updateDoc(window.doc(window.firebaseDb, 'users', userId), {
            status: 'active',
            approvedDate: new Date(),
            approvedBy: currentUser.uid
        });
        showMessage('User approved successfully!', 'success');
        loadUsers();
        loadStats();
    } catch (error) {
        console.error('Error approving user:', error);
        showMessage('Error approving user. Please try again.', 'error');
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This will delete both user account and member record. This action cannot be undone.')) {
        try {
            
            // Step 1: Find and delete the corresponding member record
            const membersSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'members'));
            let memberToDelete = null;
            
            membersSnapshot.forEach(doc => {
                const memberData = doc.data();
                if (memberData.userId === userId) {
                    memberToDelete = { id: doc.id, ...memberData };
                }
            });
            
            // Step 2: Delete member record if found
            if (memberToDelete) {
                await window.deleteDoc(window.doc(window.firebaseDb, 'members', memberToDelete.id));
            } else {
            }
            
            // Step 3: Delete user record
            await window.deleteDoc(window.doc(window.firebaseDb, 'users', userId));
            
            showMessage('User and member data deleted successfully!', 'success');
            loadUsers();
            loadStats();
            
        } catch (error) {
            console.error('Error deleting user:', error);
            showMessage('Error deleting user. Please try again.', 'error');
        }
    }
}

// Filter books
function filterBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const availabilityFilter = document.getElementById('availabilityFilter').value;

    filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.isbn.toLowerCase().includes(searchTerm);
        
        const matchesAvailability = !availabilityFilter || book.availability === availabilityFilter;
        
        return matchesSearch && matchesAvailability;
    });

    renderBooksTable();
}

// Filter feedback
function filterFeedback() {
    const searchTerm = document.getElementById('feedbackSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('feedbackStatusFilter')?.value || '';
    const typeFilter = document.getElementById('feedbackTypeFilter')?.value || '';

    filteredFeedback = feedback.filter(feedbackItem => {
        const matchesSearch = 
            (feedbackItem.subject || '').toLowerCase().includes(searchTerm) ||
            (feedbackItem.message || '').toLowerCase().includes(searchTerm) ||
            (feedbackItem.userName || '').toLowerCase().includes(searchTerm) ||
            (feedbackItem.userEmail || '').toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || feedbackItem.status === statusFilter;
        const matchesType = !typeFilter || feedbackItem.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    renderFeedbackTable();
}

// Open feedback modal
function openFeedbackModal(feedbackId) {
    const feedbackItem = feedback.find(f => f.id === feedbackId);
    if (!feedbackItem) {
        showMessage('Feedback not found.', 'error');
        return;
    }

    // Populate modal with feedback data
    document.getElementById('feedbackId').value = feedbackItem.id;
    document.getElementById('feedbackTypeDisplay').textContent = feedbackItem.type || 'General';
    document.getElementById('feedbackPriorityDisplay').textContent = feedbackItem.priority || 'Medium';
    document.getElementById('feedbackStatusDisplay').textContent = feedbackItem.status || 'New';
    document.getElementById('feedbackDateDisplay').textContent = formatDate(feedbackItem.createdAt);
    document.getElementById('feedbackMessageDisplay').textContent = feedbackItem.message || 'No message provided';
    
    // User information
    const userInfo = `
        <div class="user-detail">
            <strong>Name:</strong> ${feedbackItem.userName || 'Anonymous'}
        </div>
        <div class="user-detail">
            <strong>Email:</strong> ${feedbackItem.userEmail || 'Not provided'}
        </div>
        ${feedbackItem.userPhone ? `
        <div class="user-detail">
            <strong>Phone:</strong> ${feedbackItem.userPhone}
        </div>` : ''}
    `;
    document.getElementById('feedbackUserDisplay').innerHTML = userInfo;

    // Set form values
    document.getElementById('feedbackStatus').value = feedbackItem.status || 'new';
    document.getElementById('feedbackPriority').value = feedbackItem.priority || 'medium';
    document.getElementById('adminResponse').value = feedbackItem.adminResponse || '';

    // Show modal
    document.getElementById('feedbackModal').classList.add('active');
}

// Close feedback modal
function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('active');
    document.getElementById('feedbackActionForm').reset();
}

// Update feedback status
async function updateFeedbackStatus(feedbackId, newStatus) {
    try {
        await window.updateDoc(window.doc(window.firebaseDb, 'feedback', feedbackId), {
            status: newStatus,
            updatedAt: new Date(),
            updatedBy: currentUser.uid
        });
        
        showMessage(`Feedback status updated to ${newStatus}!`, 'success');
        loadFeedback();
    } catch (error) {
        console.error('Error updating feedback status:', error);
        showMessage('Error updating feedback status.', 'error');
    }
}

// Delete feedback
async function deleteFeedback(feedbackId) {
    if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
        try {
            await window.deleteDoc(window.doc(window.firebaseDb, 'feedback', feedbackId));
            showMessage('Feedback deleted successfully!', 'success');
            loadFeedback();
        } catch (error) {
            console.error('Error deleting feedback:', error);
            showMessage('Error deleting feedback.', 'error');
        }
    }
}

// Handle feedback action form submission
async function handleFeedbackAction(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const feedbackId = formData.get('feedbackId');
    const status = formData.get('status');
    const priority = formData.get('priority');
    const adminResponse = formData.get('adminResponse');
    
    try {
        await window.updateDoc(window.doc(window.firebaseDb, 'feedback', feedbackId), {
            status: status,
            priority: priority,
            adminResponse: adminResponse,
            updatedAt: new Date(),
            updatedBy: currentUser.uid
        });
        
        showMessage('Feedback updated successfully!', 'success');
        closeFeedbackModal();
        loadFeedback();
    } catch (error) {
        console.error('Error updating feedback:', error);
        showMessage('Error updating feedback.', 'error');
    }
}

// Helper functions for feedback styling
function getFeedbackStatusClass(status) {
    switch (status) {
        case 'new': return 'status-new';
        case 'in-progress': return 'status-in-progress';
        case 'resolved': return 'status-resolved';
        case 'closed': return 'status-closed';
        default: return 'status-default';
    }
}

function getFeedbackTypeClass(type) {
    switch (type) {
        case 'suggestion': return 'type-suggestion';
        case 'complaint': return 'type-complaint';
        case 'compliment': return 'type-compliment';
        case 'bug-report': return 'type-bug-report';
        case 'feature-request': return 'type-feature-request';
        default: return 'type-general';
    }
}

function getFeedbackPriorityClass(priority) {
    switch (priority) {
        case 'low': return 'priority-low';
        case 'medium': return 'priority-medium';
        case 'high': return 'priority-high';
        case 'urgent': return 'priority-urgent';
        default: return 'priority-medium';
    }
}


// Handle logout
async function handleLogout() {
    try {
        await window.signOut(window.firebaseAuth);
        showMessage('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } catch (error) {
        console.error('Error logging out:', error);
        showMessage('Error logging out. Please try again.', 'error');
    }
}

// Show message
function showMessage(message, type) {
    const messageContainer = document.getElementById(`${type}Message`);
    const messageText = messageContainer.querySelector('.message-text');
    
    messageText.textContent = message;
    messageContainer.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideMessage(`${type}Message`);
    }, 5000);
}

// Hide message
function hideMessage(messageId) {
    document.getElementById(messageId).style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    // Add book form
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', handleAddBook);
    }

    // Edit book form
    const editBookForm = document.getElementById('editBookForm');
    if (editBookForm) {
        editBookForm.addEventListener('submit', handleEditBook);
    }

    // Add user form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }

    // Edit user form
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', handleEditUser);
    }

    // Feedback action form
    const feedbackActionForm = document.getElementById('feedbackActionForm');
    if (feedbackActionForm) {
        feedbackActionForm.addEventListener('submit', handleFeedbackAction);
    }

    // Close modals when clicking outside
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// Initialize when DOM is loaded
// Initialize admin dashboard when DOM is ready and Firebase is available
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar first
    initializeSidebar();
    
    if (window.firebaseReady && window.firebaseAuth && window.firebaseDb) {
        initializeAdminDashboard();
    } else {
        // Listen for Firebase ready event
        window.addEventListener('firebaseReady', function() {
            initializeAdminDashboard();
        });
        
        // Listen for Firebase error event
        window.addEventListener('firebaseError', function(event) {
            console.error('❌ Firebase initialization error:', event.detail);
            showMessage('Firebase initialization failed. Please refresh the page and try again.', 'error');
        });
    }
});

// Real-time listening for borrowed books changes
function setupBorrowedBooksListener() {
    // Listen for changes to borrowed books collection
    const borrowedBooksRef = window.collection(window.firebaseDb, 'borrowedBooks');
    
    window.onSnapshot(borrowedBooksRef, async (snapshot) => {
        
        // Clear arrays completely to prevent duplicates
        borrowedBooks = [];
        filteredBorrowedBooks = [];
        
        const borrowedData = [];
        snapshot.forEach(doc => {
            borrowedData.push({ id: doc.id, ...doc.data() });
        });
        
        
        // Fetch member details and book details for each borrowed book
        for (const borrowed of borrowedData) {
            try {
                // Find corresponding member record
                const membersSnapshot = await window.getDocs(
                    window.query(
                        window.collection(window.firebaseDb, 'members'),
                        window.where('userId', '==', borrowed.borrowerId)
                    )
                );
                
                let memberData = null;
                membersSnapshot.forEach(doc => {
                    memberData = { id: doc.id, ...doc.data() };
                });
                
                // Fetch book details from books collection
                let bookData = null;
                if (borrowed.bookId) {
                    try {
                        const bookDoc = await window.getDoc(window.doc(window.firebaseDb, 'books', borrowed.bookId));
                        if (bookDoc.exists()) {
                            bookData = bookDoc.data();
                        }
                    } catch (bookError) {
                        console.warn('Error fetching book details for bookId:', borrowed.bookId, ':', bookError);
                    }
                }
                
                // Enhance borrowed book record with member details and book details
                const enhancedBorrowed = {
                    ...borrowed,
                    // Book details from books collection
                    author: borrowed.author || bookData?.author || 'Unknown Author',
                    isbn: borrowed.isbn || bookData?.isbn || 'No ISBN',
                    
                    // Basic borrower info from borrowed record
                    borrowerName: borrowed.borrowerName || memberData?.fullName || 'Unknown',
                    borrowerEmail: borrowed.borrowerEmail || memberData?.email || 'Unknown',
                    
                    // Detailed member info from members collection
                    memberDetails: memberData ? {
                        id: memberData.id,
                        userId: memberData.userId,
                        phone: memberData.phone || 'Not provided',
                        studentId: memberData.studentId || 'Not provided',
                        department: memberData.department || 'Not provided',
                        year: memberData.year || 'Not provided',
                        address: memberData.address || 'Not provided',
                        emergencyContact: memberData.emergencyContact || 'Not provided',
                        gender: memberData.gender || 'Not specified',
                        dateOfBirth: memberData.dateOfBirth || 'Not provided',
                        membershipType: memberData.membershipType || 'student',
                        membershipStatus: memberData.membershipStatus || 'active',
                        libraryCardNumber: memberData.libraryCardNumber || 'Not assigned',
                        academicYear: memberData.academicYear || 'Not specified',
                        semester: memberData.semester || 'Not specified',
                        enrollmentDate: memberData.enrollmentDate || 'Not provided',
                        notes: memberData.notes || '',
                        preferences: memberData.preferences || {},
                        contactMethods: memberData.contactMethods || {}
                    } : null
                };
                
                borrowedBooks.push(enhancedBorrowed);
                
            } catch (memberError) {
                console.warn('Error fetching member details for', borrowed.borrowerId, ':', memberError);
                // Add borrowed book even if member details fail
                borrowedBooks.push(borrowed);
            }
        }
        
        // Remove duplicates based on document ID (just in case)
        const seen = new Set();
        borrowedBooks = borrowedBooks.filter(book => {
            if (seen.has(book.id)) {
                console.warn('Duplicate book detected and removed:', book.id);
                return false;
            }
            seen.add(book.id);
            return true;
        });
        
        // Sort by borrow date (newest first)
        borrowedBooks.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
        
        filteredBorrowedBooks = [...borrowedBooks];
        
        // Only update display if currently viewing borrowed books section
        const borrowedSection = document.getElementById('borrowed');
        if (borrowedSection && borrowedSection.classList.contains('active')) {
            displayBorrowedBooks();
        }
        
    });
}

// Borrowed Books Functions
let borrowedBooks = [];
let filteredBorrowedBooks = [];

// Load borrowed books data from Firestore with member details
async function loadBorrowedBooks() {
    try {
        console.log('Loading borrowed books...');
        
        // Fetch borrowed books from Firestore
        const borrowedSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'borrowedBooks'));
        borrowedBooks = [];
        
        // Get all borrowed books data
        const borrowedData = [];
        borrowedSnapshot.forEach(doc => {
            borrowedData.push({ id: doc.id, ...doc.data() });
        });
        
        console.log('Found borrowed books:', borrowedData.length);
        
        
        // Fetch member details and book details for each borrowed book
        for (const borrowed of borrowedData) {
            try {
                // Find corresponding member record
                const membersSnapshot = await window.getDocs(
                    window.query(
                        window.collection(window.firebaseDb, 'members'),
                        window.where('userId', '==', borrowed.borrowerId)
                    )
                );
                
                let memberData = null;
                membersSnapshot.forEach(doc => {
                    memberData = { id: doc.id, ...doc.data() };
                });
                
                // Fetch book details from books collection
                let bookData = null;
                if (borrowed.bookId) {
                    try {
                        const bookDoc = await window.getDoc(window.doc(window.firebaseDb, 'books', borrowed.bookId));
                        if (bookDoc.exists()) {
                            bookData = bookDoc.data();
                        }
                    } catch (bookError) {
                        console.warn('Error fetching book details for bookId:', borrowed.bookId, ':', bookError);
                    }
                }
                
                // Enhance borrowed book record with member details and book details
                const enhancedBorrowed = {
                    ...borrowed,
                    // Book details from books collection
                    author: borrowed.author || bookData?.author || 'Unknown Author',
                    isbn: borrowed.isbn || bookData?.isbn || 'No ISBN',
                    
                    // Basic borrower info from borrowed record
                    borrowerName: borrowed.borrowerName || memberData?.fullName || 'Unknown',
                    borrowerEmail: borrowed.borrowerEmail || memberData?.email || 'Unknown',
                    
                    // Detailed member info from members collection
                    memberDetails: memberData ? {
                        id: memberData.id,
                        userId: memberData.userId,
                        phone: memberData.phone || 'Not provided',
                        studentId: memberData.studentId || 'Not provided',
                        department: memberData.department || 'Not provided',
                        year: memberData.year || 'Not provided',
                        address: memberData.address || 'Not provided',
                        emergencyContact: memberData.emergencyContact || 'Not provided',
                        gender: memberData.gender || 'Not specified',
                        dateOfBirth: memberData.dateOfBirth || 'Not provided',
                        membershipType: memberData.membershipType || 'student',
                        membershipStatus: memberData.membershipStatus || 'active',
                        libraryCardNumber: memberData.libraryCardNumber || 'Not assigned',
                        academicYear: memberData.academicYear || 'Not specified',
                        semester: memberData.semester || 'Not specified',
                        enrollmentDate: memberData.enrollmentDate || 'Not provided',
                        notes: memberData.notes || '',
                        preferences: memberData.preferences || {},
                        contactMethods: memberData.contactMethods || {}
                    } : null
                };
                
                borrowedBooks.push(enhancedBorrowed);
                
            } catch (memberError) {
                console.warn('Error fetching member details for', borrowed.borrowerId, ':', memberError);
                // Add borrowed book even if member details fail
                borrowedBooks.push(borrowed);
            }
        }
        
        // Remove duplicates based on document ID (just in case)
        const seen = new Set();
        borrowedBooks = borrowedBooks.filter(book => {
            if (seen.has(book.id)) {
                console.warn('Duplicate book detected and removed:', book.id);
                return false;
            }
            seen.add(book.id);
            return true;
        });
        
        // Sort by borrow date (newest first)
        borrowedBooks.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
        
        filteredBorrowedBooks = [...borrowedBooks];
        console.log('Loaded borrowed books:', borrowedBooks.length);
        displayBorrowedBooks();
        
        
    } catch (error) {
        console.error('Error loading borrowed books:', error);
        showMessage('Error loading borrowed books data.', 'error');
    }
}

// Display borrowed books in table
function displayBorrowedBooks() {
    const tbody = document.getElementById('borrowedTableBody');
    
    if (!tbody) {
        console.error('Borrowed table body not found');
        return;
    }
    
    console.log('Displaying borrowed books:', filteredBorrowedBooks.length);
    
    if (filteredBorrowedBooks.length === 0) {
        tbody.innerHTML = `
            <tr class="no-data">
                <td colspan="7">
                    <div class="no-data-message">
                        <i class="fas fa-book-reader" aria-hidden="true"></i>
                        <p>No borrowed books found</p>
                        <small>Books will appear here when users borrow them</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredBorrowedBooks.map(borrowed => {
        const statusClass = getStatusClass(borrowed.status);
        const statusIcon = getStatusIcon(borrowed.status);
        
        return `
            <tr>
                <td>
                    <div class="book-info">
                        <strong>${borrowed.bookTitle}</strong>
                        <div class="book-details">
                            ${borrowed.author && borrowed.author !== 'Unknown Author' ? `
                                <small><i class="fas fa-user-edit" aria-hidden="true"></i> ${borrowed.author}</small>` : ''}
                            ${borrowed.isbn && borrowed.isbn !== 'No ISBN' ? `
                                <small><i class="fas fa-barcode" aria-hidden="true"></i> ${borrowed.isbn}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <div class="borrower-info">
                        <strong>${borrowed.borrowerName || borrowed.memberDetails?.fullName || 'Unknown Borrower'}</strong>
                        <div class="borrower-details">
                           </div>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        ${(borrowed.borrowerEmail || borrowed.memberDetails?.email) ? `
                        <div class="contact-item">
                            <i class="fas fa-envelope" aria-hidden="true"></i>
                            <span>${borrowed.borrowerEmail || borrowed.memberDetails?.email}</span>
                        </div>` : ''}
                        ${(borrowed.borrowerPhone || borrowed.memberDetails?.phone) ? `
                        <div class="contact-item">
                            <i class="fas fa-phone" aria-hidden="true"></i>
                            <span>${borrowed.borrowerPhone || borrowed.memberDetails?.phone}</span>
                        </div>` : ''}
                        ${borrowed.memberDetails ? `
                        ${borrowed.memberDetails.studentId ? `
                        <div class="contact-item">
                            <i class="fas fa-id-card" aria-hidden="true"></i>
                            <span>Student ID: ${borrowed.memberDetails.studentId}</span>
                        </div>` : ''}
                        ${borrowed.memberDetails.department || borrowed.memberDetails.year ? `
                        <div class="contact-item">
                            <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                            <span>${borrowed.memberDetails.department ? borrowed.memberDetails.department : ''}${borrowed.memberDetails.department && borrowed.memberDetails.year ? ' | ' : ''}${borrowed.memberDetails.year ? borrowed.memberDetails.year : ''}</span>
                        </div>` : ''}
                        ` : ''}
                    </div>
                </td>
                <td>${formatDate(borrowed.borrowDate)}</td>
                <td>${formatDate(borrowed.dueDate)}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <i class="${statusIcon}" aria-hidden="true"></i>
                        ${borrowed.status.charAt(0).toUpperCase() + borrowed.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-primary" onclick="markAsReturned('${borrowed.id}')" title="Mark as Returned">
                            <i class="fas fa-check" aria-hidden="true"></i>
                        </button>
                        <button class="btn-action btn-warning" onclick="extendDueDate('${borrowed.id}')" title="Extend Due Date">
                            <i class="fas fa-calendar-plus" aria-hidden="true"></i>
                        </button>
                        <button class="btn-action btn-info" onclick="viewBorrowerDetails('${borrowed.borrowerId}')" title="View Borrower Details">
                            <i class="fas fa-user" aria-hidden="true"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter borrowed books
function filterBorrowedBooks() {
    const searchTerm = document.getElementById('borrowedSearch')?.value.toLowerCase() || '';
    const studentIdTerm = document.getElementById('studentIdSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('borrowedStatusFilter')?.value || '';
    
    console.log('Filtering borrowed books:', { searchTerm, studentIdTerm, statusFilter, totalBooks: borrowedBooks.length });
    
    filteredBorrowedBooks = borrowedBooks.filter(borrowed => {
        // General search (book title, author, borrower name, email, ISBN, department, phone)
        const matchesSearch = 
            (borrowed.bookTitle || '').toLowerCase().includes(searchTerm) ||
            (borrowed.author || '').toLowerCase().includes(searchTerm) ||
            (borrowed.borrowerName || '').toLowerCase().includes(searchTerm) ||
            (borrowed.borrowerEmail || '').toLowerCase().includes(searchTerm) ||
            (borrowed.isbn || '').toLowerCase().includes(searchTerm) ||
            (borrowed.memberDetails?.department || '').toLowerCase().includes(searchTerm) ||
            (borrowed.memberDetails?.phone || '').toLowerCase().includes(searchTerm);
        
        // Student ID specific search
        const matchesStudentId = !studentIdTerm || 
            (borrowed.memberDetails?.studentId || '').toLowerCase().includes(studentIdTerm);
        
        // Status filter
        const matchesStatus = !statusFilter || borrowed.status === statusFilter;
        
        return matchesSearch && matchesStudentId && matchesStatus;
    });
    
    console.log('Filtered results:', filteredBorrowedBooks.length);
    displayBorrowedBooks();
}



// Helper functions
function getStatusClass(status) {
    switch (status) {
        case 'active': return 'status-active';
        case 'overdue': return 'status-overdue';
        case 'returned': return 'status-returned';
        default: return 'status-default';
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'active': return 'fas fa-book-reader';
        case 'overdue': return 'fas fa-exclamation-triangle';
        case 'returned': return 'fas fa-check-circle';
        default: return 'fas fa-question-circle';
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Generate unique library card number
function generateLibraryCardNumber() {
    const prefix = 'LIB';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Borrowed books actions
async function markAsReturned(borrowedId) {
    const borrowed = borrowedBooks.find(b => b.id === borrowedId);
    if (borrowed) {
        try {
            
            // Update borrowed record in Firestore
            await window.updateDoc(window.doc(window.firebaseDb, 'borrowedBooks', borrowedId), {
                status: 'returned',
                returnDate: new Date().toISOString().split('T')[0]
            });
            
            // Update book availability back to available
            if (borrowed.bookId) {
                await window.updateDoc(window.doc(window.firebaseDb, 'books', borrowed.bookId), {
                    availability: 'available'
                });
            }
            
            // Update local data
            borrowed.status = 'returned';
            borrowed.returnDate = new Date().toISOString().split('T')[0];
            displayBorrowedBooks();
            showMessage(`Book "${borrowed.bookTitle}" marked as returned successfully!`, 'success');
            
        } catch (error) {
            console.error('Error marking book as returned:', error);
            showMessage('Error marking book as returned. Please try again.', 'error');
        }
    }
}

function extendDueDate(borrowedId) {
    const borrowed = borrowedBooks.find(b => b.id === borrowedId);
    if (borrowed) {
        const newDueDate = new Date(borrowed.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 7); // Extend by 7 days
        borrowed.dueDate = newDueDate.toISOString().split('T')[0];
        displayBorrowedBooks();
        showMessage(`Due date extended for "${borrowed.bookTitle}".`, 'success');
    }
}

function viewBorrowerDetails(borrowerId) {
    const borrowed = borrowedBooks.find(b => b.borrowerId === borrowerId);
    if (borrowed) {
        const activeBooks = borrowedBooks.filter(b => b.borrowerId === borrowerId && b.status === 'active').length;
        const overdueBooks = borrowedBooks.filter(b => b.borrowerId === borrowerId && b.status === 'overdue').length;
        
        const memberDetails = borrowed.memberDetails;
        
        if (memberDetails) {
            // Create detailed member information display
            const alertMessage = `
📚 Enhanced Borrower Details:

👤 Basic Information:
• Name: ${borrowed.borrowerName || memberDetails.fullName || 'Unknown'}
• Email: ${borrowed.borrowerEmail || memberDetails.email || 'Unknown'}
• Phone: ${memberDetails.phone || 'Not provided'}
• Gender: ${memberDetails.gender || 'Not specified'}

🆔 Academic Information:
• Student ID: ${memberDetails.studentId || 'Not provided'}
• Department: ${memberDetails.department || 'Not provided'}
• Academic Year: ${memberDetails.year || 'Not provided'}
• Semester: ${memberDetails.semester || 'Not specified'}
• Enrollment Date: ${memberDetails.enrollmentDate ? new Date(memberDetails.enrollmentDate.seconds * 1000).toLocaleDateString() : 'Not provided'}

📋 Membership Details:
• Membership Type: ${memberDetails.membershipType || 'Student'}
• Membership Status: ${memberDetails.membershipStatus || 'Active'}
• Library Card Number: ${memberDetails.libraryCardNumber || 'Not assigned'}
• Join Date: ${borrowed.memberDetails?.joinedDate ? new Date(borrowed.memberDetails.joinedDate.seconds * 1000).toLocaleDateString() : 'Not provided'}

🏠 Contact Information:
• Address: ${memberDetails.address || 'Not provided'}
• Emergency Contact: ${memberDetails.emergencyContact || 'Not provided'}

📚 Book Borrowing Status:
• Currently borrowing: ${activeBooks} book(s)
• Overdue books: ${overdueBooks} book(s)

📝 Additional Notes:
${memberDetails.notes || 'No additional notes'}            

        `.trim();
            
            alert(alertMessage);
        } else {
            // Fallback for basic borrower info only
            alert(`📚 Borrower Details:\n\n👤 Name: ${borrowed.borrowerName || 'Unknown'}\n📧 Email: ${borrowed.borrowerEmail || 'Unknown'}\n📞 Phone: ${borrowed.borrowerPhone || 'Not provided'}\n\n📖 Currently borrowing: ${activeBooks} book(s)\n⚠️ Overdue books: ${overdueBooks} book(s)\n\n📝 Note: Enhanced member details not available`);
        }
    }
}

// Enhanced showSection function to load data when section is shown
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');

    // Add active class to selected nav item
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Load data when specific sections are shown
    if (sectionName === 'borrowed') {
        // If no borrowed books data is loaded yet, load it
        if (borrowedBooks.length === 0) {
            loadBorrowedBooks();
        } else {
            // Since real-time listener is active, just display current data
            displayBorrowedBooks();
        }
    } else if (sectionName === 'feedback') {
        // Load feedback data when feedback section is shown
        loadFeedback();
    }
}

// Export functions for global access
window.showSection = showSection;
window.handleLogout = handleLogout;
window.showMessage = showMessage;
window.openAddBookModal = openAddBookModal;
window.closeAddBookModal = closeAddBookModal;
window.openEditBookModal = openEditBookModal;
window.closeEditBookModal = closeEditBookModal;
window.openAddUserModal = openAddUserModal;
window.closeAddUserModal = closeAddUserModal;
window.openEditUserModal = openEditUserModal;
window.closeEditUserModal = closeEditUserModal;
window.handleAddBook = handleAddBook;
window.handleEditBook = handleEditBook;
window.handleAddUser = handleAddUser;
window.handleEditUser = handleEditUser;
window.deleteBook = deleteBook;
window.approveUser = approveUser;
window.deleteUser = deleteUser;
window.filterBooks = filterBooks;
window.filterBorrowedBooks = filterBorrowedBooks;
window.markAsReturned = markAsReturned;
window.extendDueDate = extendDueDate;
window.viewBorrowerDetails = viewBorrowerDetails;
window.filterFeedback = filterFeedback;
window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.updateFeedbackStatus = updateFeedbackStatus;
window.deleteFeedback = deleteFeedback;
window.handleFeedbackAction = handleFeedbackAction;

// Sidebar functionality - Works for both Mobile and Desktop
let sidebarOpen = false;
let sidebarCollapsed = false;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');
    const toggle = document.querySelector('.sidebar-toggle');
    
    // Add click effect
    toggle.classList.add('clicked');
    
    // Remove click effect after animation
    setTimeout(() => {
        toggle.classList.remove('clicked');
    }, 800);
    
    if (window.innerWidth <= 768) {
        // Mobile behavior - slide in/out
        sidebarOpen = !sidebarOpen;
        
        if (sidebarOpen) {
            sidebar.classList.add('mobile-visible');
            sidebar.classList.remove('mobile-hidden');
            overlay.classList.add('active');
            mainContent.classList.add('mobile-full-width');
            document.body.style.overflow = 'hidden';
        } else {
            closeSidebar();
        }
    } else {
        // Desktop behavior - collapse/expand
        sidebarCollapsed = !sidebarCollapsed;
        
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            // Update toggle button icon
            const toggleIcon = toggle.querySelector('i');
            toggleIcon.className = 'fas fa-bars';
            // Store state in localStorage
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            sidebar.classList.remove('collapsed');
            // Update toggle button icon
            const toggleIcon = toggle.querySelector('i');
            toggleIcon.className = 'fas fa-times';
            // Store state in localStorage
            localStorage.setItem('sidebarCollapsed', 'false');
        }
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        sidebarOpen = false;
        sidebar.classList.remove('mobile-visible');
        sidebar.classList.add('mobile-hidden');
        overlay.classList.remove('active');
        mainContent.classList.remove('mobile-full-width');
        document.body.style.overflow = 'auto';
    }
}

// Handle window resize
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');
    const toggle = document.querySelector('.sidebar-toggle');
    
    if (window.innerWidth > 768) {
        // Desktop view - reset mobile states and apply desktop behavior
        sidebar.classList.remove('mobile-visible', 'mobile-hidden');
        overlay.classList.remove('active');
        mainContent.classList.remove('mobile-full-width');
        document.body.style.overflow = 'auto';
        sidebarOpen = false;
        
        // Restore desktop sidebar state from localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            sidebarCollapsed = true;
            const toggleIcon = toggle.querySelector('i');
            toggleIcon.className = 'fas fa-bars';
        } else {
            sidebar.classList.remove('collapsed');
            sidebarCollapsed = false;
            const toggleIcon = toggle.querySelector('i');
            toggleIcon.className = 'fas fa-times';
        }
    } else {
        // Mobile view - reset desktop states and apply mobile behavior
        sidebar.classList.remove('collapsed');
        sidebarCollapsed = false;
        
        if (!sidebarOpen) {
            sidebar.classList.add('mobile-hidden');
            sidebar.classList.remove('mobile-visible');
        }
        
        // Reset toggle icon for mobile
        const toggleIcon = toggle.querySelector('i');
        toggleIcon.className = 'fas fa-bars';
    }
}

// Initialize sidebar on page load
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggle = document.querySelector('.sidebar-toggle');
    
    if (window.innerWidth <= 768) {
        // Mobile initialization
        sidebar.classList.add('mobile-hidden');
        overlay.style.display = 'block';
        sidebarOpen = false;
        sidebarCollapsed = false;
        const toggleIcon = toggle.querySelector('i');
        toggleIcon.className = 'fas fa-bars';
    } else {
        // Desktop initialization
        overlay.style.display = 'none';
        sidebarOpen = false;
        
        // Restore desktop sidebar state from localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            sidebarCollapsed = true;
            const toggleIcon = toggle.querySelector('i');
            toggleIcon.className = 'fas fa-bars';
        } else {
            sidebar.classList.remove('collapsed');
            sidebarCollapsed = false;
            const toggleIcon = toggle.querySelector('i');
            toggleIcon.className = 'fas fa-times';
        }
    }
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Close sidebar when clicking on nav items on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                setTimeout(closeSidebar, 150); // Small delay for smooth transition
            }
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (event) => {
        // Escape key closes sidebar
        if (event.key === 'Escape' && (sidebarOpen || sidebarCollapsed)) {
            if (window.innerWidth <= 768) {
                closeSidebar();
            } else {
                // On desktop, escape key expands collapsed sidebar
                if (sidebarCollapsed) {
                    toggleSidebar();
                }
            }
        }
        
        // Alt + S toggles sidebar on desktop
        if (event.altKey && event.key === 's' && window.innerWidth > 768) {
            event.preventDefault();
            toggleSidebar();
        }
        
        // Ctrl + Shift + S toggles sidebar on mobile
        if (event.ctrlKey && event.shiftKey && event.key === 'S' && window.innerWidth <= 768) {
            event.preventDefault();
            toggleSidebar();
        }
    });
    
    // Make nav items focusable for keyboard navigation
    navItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.click();
            }
        });
    });
}

// Export sidebar functions
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.initializeSidebar = initializeSidebar;
