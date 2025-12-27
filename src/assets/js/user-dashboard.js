// User Dashboard JavaScript

// Global variables
let currentUser = null;
let userData = null;
let books = [];
let borrowedBooks = [];
let borrowingHistory = [];
let filteredBooks = [];
let filteredHistory = [];

// Initialize user dashboard
function initializeUserDashboard() {
    checkUserStatus();
    setupEventListeners();

    // Automatically load all sections and their data
    autoLoadAllSections();

}

// Check user status and load data
async function checkUserStatus() {
    if (window.onAuthStateChanged && window.firebaseAuth) {
        window.onAuthStateChanged(window.firebaseAuth, async (user) => {
            if (user) {
                currentUser = user;

                try {
                    // Get user data from Firestore
                    const userDoc = await window.getDoc(window.doc(window.firebaseDb, 'users', user.uid));
                    if (userDoc.exists()) {
                        userData = userDoc.data();

                        // Update UI with user data
                        await updateUserProfile();

                        // Load dashboard data
                        await loadDashboardData();
                    } else {
                        console.warn('⚠️ User profile not found in Firestore');
                        showMessage('User profile not found.', 'error');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    }
                } catch (error) {
                    console.error('❌ Error loading user data:', error);
                    showMessage('Error loading user data.', 'error');
                }
            } else {
                window.location.href = 'login.html';
            }
        });
    } else {
        console.warn('⚠️ Firebase authentication not available');
    }
}

// Update user profile information with member details
async function updateUserProfile() {
    if (userData && currentUser) {
        try {
            // Get detailed member information from members collection
            const membersSnapshot = await window.getDocs(
                window.query(
                    window.collection(window.firebaseDb, 'members'),
                    window.where('userId', '==', currentUser.uid)
                )
            );

            let memberData = null;
            membersSnapshot.forEach(doc => {
                memberData = { id: doc.id, ...doc.data() };
            });

            if (memberData) {
                // Member data found
            }

            // Update profile with member data or fallback to basic user data
            const displayName = memberData?.fullName || userData.fullName || userData.name || 'Student User';
            const displayEmail = memberData?.email || userData.email || 'student@email.com';


            document.getElementById('studentName').textContent = displayName;
            document.getElementById('profileName').textContent = displayName;
            document.getElementById('profileEmail').textContent = displayEmail;

            // Only show fields that have actual data, hide if undefined/null/empty
            let hasAnyDetails = false;

            const studentIdElement = document.getElementById('profileStudentId');
            if (memberData?.studentId) {
                studentIdElement.textContent = memberData.studentId;
                studentIdElement.parentElement.style.display = 'flex';
                hasAnyDetails = true;
            } else {
                studentIdElement.parentElement.style.display = 'none';
            }

            const departmentElement = document.getElementById('profileDepartment');
            if (memberData?.department) {
                departmentElement.textContent = memberData.department;
                departmentElement.parentElement.style.display = 'flex';
                hasAnyDetails = true;
            } else {
                departmentElement.parentElement.style.display = 'none';
            }

            const yearElement = document.getElementById('profileYear');
            if (memberData?.year) {
                yearElement.textContent = memberData.year;
                yearElement.parentElement.style.display = 'flex';
                hasAnyDetails = true;
            } else {
                yearElement.parentElement.style.display = 'none';
            }

            const phoneElement = document.getElementById('profilePhone');
            if (memberData?.phone) {
                phoneElement.textContent = memberData.phone;
                phoneElement.parentElement.style.display = 'flex';
                hasAnyDetails = true;
            } else {
                phoneElement.parentElement.style.display = 'none';
            }

            const joinDateElement = document.getElementById('profileJoinDate');
            if (memberData?.joinedDate || userData.createdDate) {
                const joinDate = memberData?.joinedDate || userData.createdDate;
                const dateStr = joinDate?.seconds ?
                    new Date(joinDate.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
                    'January 2024';
                joinDateElement.textContent = dateStr;
                joinDateElement.parentElement.style.display = 'flex';
                hasAnyDetails = true;
            } else {
                joinDateElement.parentElement.style.display = 'none';
            }

            // Show "no details" message if no profile fields are available
            const noDetailsMessage = document.getElementById('noDetailsMessage');
            if (hasAnyDetails) {
                noDetailsMessage.style.display = 'none';
            } else {
                noDetailsMessage.style.display = 'block';
            }

        } catch (error) {
            console.error('Error loading member details:', error);
            // Fallback to basic user data only
            document.getElementById('studentName').textContent = userData.fullName || userData.name || 'Student User';
            document.getElementById('profileName').textContent = userData.fullName || userData.name || 'Student Name';
            document.getElementById('profileEmail').textContent = userData.email || 'student@email.com';

            // Hide all detail rows
            document.getElementById('profileStudentId').parentElement.style.display = 'none';
            document.getElementById('profileDepartment').parentElement.style.display = 'none';
            document.getElementById('profileYear').parentElement.style.display = 'none';
            document.getElementById('profilePhone').parentElement.style.display = 'none';
            document.getElementById('profileJoinDate').parentElement.style.display = 'none';

            // Show "no details" message
            const noDetailsMessage = document.getElementById('noDetailsMessage');
            noDetailsMessage.style.display = 'block';
        }
    }
}

// Load dashboard data
async function loadDashboardData() {

    // Show main loading overlay
    showMainLoading(true);

    // Check if Firebase functions are available
    if (!window.collection || !window.getDocs || !window.firebaseDb) {
        console.error('❌ Firebase functions not available for dashboard data loading');
        showMessage('Firebase functions not ready. Please refresh the page and try again.', 'error');
        showMainLoading(false);
        return;
    }

    try {
        await Promise.all([
            loadBooks(),
            loadBorrowedBooks(),
            loadBorrowingHistory()
        ]);
        updateStats();

        // Immediately show overview section with statistics
        showSection('overview');

        // After data is loaded, automatically display all sections
        setTimeout(() => {
            autoLoadAllSections();
        }, 100);

    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        showMessage('Error loading dashboard data.', 'error');
    } finally {
        // Hide main loading overlay
        showMainLoading(false);
    }
}

// Load books from Firestore
async function loadBooks() {
    try {

        // Show loading indicator
        const booksGridElement = document.getElementById('booksGrid');
        const booksLoadingElement = document.getElementById('booksLoading');
        if (booksGridElement && booksLoadingElement) {
            booksGridElement.style.display = 'none';
            booksLoadingElement.style.display = 'flex';
            booksGridElement.classList.add('loading');
        }

        const booksSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'books'));
        books = [];
        booksSnapshot.forEach(doc => {
            books.push({ id: doc.id, ...doc.data() });
        });
        filteredBooks = [...books];

        // Books loaded successfully

        // If no books found, add some sample books
        if (books.length === 0) {
            await addSampleBooks();
            // Reload books after adding samples
            const newBooksSnapshot = await window.getDocs(window.collection(window.firebaseDb, 'books'));
            books = [];
            newBooksSnapshot.forEach(doc => {
                books.push({ id: doc.id, ...doc.data() });
            });
            filteredBooks = [...books];
        }

        // Always display books in browse section if it exists
        const browseSection = document.getElementById('browse');
        if (browseSection) {
            displayBooks();
        } else {
        }

        // Hide loading indicator
        const booksGridElement2 = document.getElementById('booksGrid');
        const booksLoadingElement2 = document.getElementById('booksLoading');
        if (booksGridElement2 && booksLoadingElement2) {
            booksLoadingElement2.style.display = 'none';
            booksGridElement2.style.display = 'grid';
            booksGridElement2.classList.remove('loading');
        }
    } catch (error) {
        console.error('❌ Error loading books:', error);
        showMessage('Error loading books from library.', 'error');

        // Hide loading indicator on error
        const booksGridElement3 = document.getElementById('booksGrid');
        const booksLoadingElement3 = document.getElementById('booksLoading');
        if (booksGridElement3 && booksLoadingElement3) {
            booksLoadingElement3.style.display = 'none';
            booksGridElement3.style.display = 'grid';
            booksGridElement3.classList.remove('loading');
        }
    }
}

// Load user's borrowed books
async function loadBorrowedBooks() {
    try {
        // Show loading indicator
        const borrowedTable = document.getElementById('borrowedTable');
        const borrowedLoading = document.getElementById('borrowedLoading');
        if (borrowedTable && borrowedLoading) {
            borrowedTable.style.display = 'none';
            borrowedLoading.style.display = 'flex';
            borrowedTable.parentElement.classList.add('loading');
        }

        const borrowedQuery = window.query(
            window.collection(window.firebaseDb, 'borrowedBooks'),
            window.where('borrowerId', '==', currentUser.uid),
            window.where('status', '==', 'active')
        );
        const borrowedSnapshot = await window.getDocs(borrowedQuery);
        borrowedBooks = [];
        borrowedSnapshot.forEach(doc => {
            borrowedBooks.push({ id: doc.id, ...doc.data() });
        });

        // Hide loading indicator
        if (borrowedTable && borrowedLoading) {
            borrowedLoading.style.display = 'none';
            borrowedTable.style.display = 'table';
            borrowedTable.parentElement.classList.remove('loading');
        }
    } catch (error) {
        console.error('Error loading borrowed books:', error);
        showMessage('Error loading borrowed books.', 'error');

        // Hide loading indicator on error
        const borrowedTable = document.getElementById('borrowedTable');
        const borrowedLoading = document.getElementById('borrowedLoading');
        if (borrowedTable && borrowedLoading) {
            borrowedLoading.style.display = 'none';
            borrowedTable.style.display = 'table';
            borrowedTable.parentElement.classList.remove('loading');
        }
    }
}

// Load borrowing history
async function loadBorrowingHistory() {
    try {
        // Show loading indicator
        const historyTable = document.getElementById('historyTable');
        const historyLoading = document.getElementById('historyLoading');
        if (historyTable && historyLoading) {
            historyTable.style.display = 'none';
            historyLoading.style.display = 'flex';
            historyTable.parentElement.classList.add('loading');
        }

        const historyQuery = window.query(
            window.collection(window.firebaseDb, 'borrowedBooks'),
            window.where('borrowerId', '==', currentUser.uid)
        );
        const historySnapshot = await window.getDocs(historyQuery);
        borrowingHistory = [];
        historySnapshot.forEach(doc => {
            borrowingHistory.push({ id: doc.id, ...doc.data() });
        });
        filteredHistory = [...borrowingHistory];

        // Hide loading indicator
        if (historyTable && historyLoading) {
            historyLoading.style.display = 'none';
            historyTable.style.display = 'table';
            historyTable.parentElement.classList.remove('loading');
        }
    } catch (error) {
        console.error('Error loading borrowing history:', error);
        showMessage('Error loading borrowing history.', 'error');

        // Hide loading indicator on error
        const historyTable = document.getElementById('historyTable');
        const historyLoading = document.getElementById('historyLoading');
        if (historyTable && historyLoading) {
            historyLoading.style.display = 'none';
            historyTable.style.display = 'table';
            historyTable.parentElement.classList.remove('loading');
        }
    }
}

// Update dashboard statistics
function updateStats() {
    // Show loading indicator
    const statsGrid = document.getElementById('statsGrid');
    const statsLoading = document.getElementById('statsLoading');
    if (statsGrid && statsLoading) {
        statsGrid.style.display = 'none';
        statsLoading.style.display = 'flex';
        statsGrid.classList.add('loading');
    }

    const currentBorrowed = borrowedBooks.length;
    const dueSoon = borrowedBooks.filter(book => {
        const dueDate = new Date(book.dueDate);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
    }).length;
    const overdueBooks = borrowedBooks.filter(book => {
        const dueDate = new Date(book.dueDate);
        const today = new Date();
        return dueDate < today;
    }).length;
    const totalBorrowed = borrowingHistory.length;

    document.getElementById('currentBorrowed').textContent = currentBorrowed;
    document.getElementById('dueSoon').textContent = dueSoon;
    document.getElementById('overdueBooks').textContent = overdueBooks;
    document.getElementById('totalBorrowed').textContent = totalBorrowed;

    // Hide loading indicator
    if (statsGrid && statsLoading) {
        statsLoading.style.display = 'none';
        statsGrid.style.display = 'grid';
        statsGrid.classList.remove('loading');
    }
}

// Show section
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
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.error('❌ Section not found:', sectionName);
    }

    // Add active class to selected nav item
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    // Display section-specific data (data is already loaded automatically)
    if (sectionName === 'overview') {
        // Statistics are already calculated and displayed in updateStats()
    } else if (sectionName === 'browse') {
        displayBooks();
    } else if (sectionName === 'borrowed') {
        displayBorrowedBooks();
    } else if (sectionName === 'history') {
        displayBorrowingHistory();
    }
}

// Display books in browse section
function displayBooks() {

    const booksGrid = document.getElementById('booksGrid');

    if (!booksGrid) {
        console.error('❌ Books grid element not found!');
        return;
    }

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-search" aria-hidden="true"></i>
                <p>No books found</p>
                <small>Try adjusting your search criteria</small>
            </div>
        `;
        return;
    }


    booksGrid.innerHTML = filteredBooks.map(book => {
        const isBorrowed = borrowedBooks.some(borrowed => borrowed.bookId === book.id);
        const canBorrow = book.availability === 'available' && !isBorrowed && borrowedBooks.length < 5;

        return `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-header">
                    <div class="book-cover">
                        <i class="fas fa-book" aria-hidden="true"></i>
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p>by ${book.author}</p>
                        <p class="isbn">ISBN: ${book.isbn}</p>
                        ${book.category ? `<p class="category"><i class="fas fa-tag" aria-hidden="true"></i> ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}</p>` : ''}
                        ${book.publishedYear ? `<p class="year"><i class="fas fa-calendar" aria-hidden="true"></i> ${book.publishedYear}</p>` : ''}
                        <div class="book-status ${book.availability === 'available' ? 'status-available' : 'status-borrowed'}">
                            <i class="fas fa-${book.availability === 'available' ? 'check-circle' : 'times-circle'}" aria-hidden="true"></i>
                            ${book.availability === 'available' ? 'Available' : 'Borrowed'}
                        </div>
                    </div>
                </div>
                ${book.description ? `<div class="book-description"><p>${book.description}</p></div>` : ''}
                <div class="book-actions">
                    <button class="btn-borrow" ${!canBorrow ? 'disabled' : ''} onclick="openBorrowModal('${book.id}')">
                        ${isBorrowed ? 'Already Borrowed' :
                book.availability !== 'available' ? 'Not Available' :
                    borrowedBooks.length >= 5 ? 'Borrow Limit Reached' : 'Borrow Book'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Display borrowed books
function displayBorrowedBooks() {
    const tbody = document.getElementById('borrowedTableBody');

    if (borrowedBooks.length === 0) {
        tbody.innerHTML = `
            <tr class="no-data">
                <td colspan="5">
                    <div class="no-data-message">
                        <i class="fas fa-book-reader" aria-hidden="true"></i>
                        <p>No borrowed books found</p>
                        <small>Start browsing books to borrow some!</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = borrowedBooks.map(borrowed => {
        const book = books.find(b => b.id === borrowed.bookId);
        if (!book) return '';

        const dueDate = new Date(borrowed.dueDate);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let statusClass = 'status-available';
        let statusText = 'On Time';

        if (diffDays < 0) {
            statusClass = 'status-borrowed';
            statusText = 'Overdue';
        } else if (diffDays <= 3) {
            statusClass = 'status-warning';
            statusText = 'Due Soon';
        }

        return `
            <tr>
                <td>
                    <div class="book-info">
                        <strong>${book.title}</strong>
                        <div class="book-details">
                            <small><i class="fas fa-user-edit" aria-hidden="true"></i> ${book.author}</small>
                            <small><i class="fas fa-barcode" aria-hidden="true"></i> ${book.isbn}</small>
                        </div>
                    </div>
                </td>
                <td>${formatDate(borrowed.borrowDate)}</td>
                <td>${formatDate(borrowed.dueDate)}</td>
                <td>
                    <span class="book-status ${statusClass}">
                        <i class="fas fa-${diffDays < 0 ? 'exclamation-triangle' : diffDays <= 3 ? 'clock' : 'check-circle'}" aria-hidden="true"></i>
                        ${statusText}
                    </span>
                </td>
                <td>
                    <button class="btn-borrow" onclick="openReturnModal('${borrowed.id}')">
                        Return Book
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Display borrowing history
function displayBorrowingHistory() {
    const tbody = document.getElementById('historyTableBody');

    if (filteredHistory.length === 0) {
        tbody.innerHTML = `
            <tr class="no-data">
                <td colspan="5">
                    <div class="no-data-message">
                        <i class="fas fa-history" aria-hidden="true"></i>
                        <p>No borrowing history found</p>
                        <small>Your borrowing history will appear here</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredHistory.map(history => {
        const book = books.find(b => b.id === history.bookId);
        if (!book) return '';

        let statusClass = 'status-available';
        let statusText = 'Returned';

        if (history.status === 'active') {
            const dueDate = new Date(history.dueDate);
            const today = new Date();
            if (dueDate < today) {
                statusClass = 'status-borrowed';
                statusText = 'Overdue';
            } else {
                statusClass = 'status-warning';
                statusText = 'Currently Borrowed';
            }
        }

        return `
            <tr>
                <td>
                    <div class="book-info">
                        <strong>${book.title}</strong>
                        <div class="book-details">
                            <small><i class="fas fa-user-edit" aria-hidden="true"></i> ${book.author}</small>
                            <small><i class="fas fa-barcode" aria-hidden="true"></i> ${book.isbn}</small>
                        </div>
                    </div>
                </td>
                <td>${formatDate(history.borrowDate)}</td>
                <td>${formatDate(history.dueDate)}</td>
                <td>${history.returnDate ? formatDate(history.returnDate) : '-'}</td>
                <td>
                    <span class="book-status ${statusClass}">
                        <i class="fas fa-${history.status === 'returned' ? 'check-circle' : 'book-reader'}" aria-hidden="true"></i>
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter books
function filterBooks() {
    const searchTerm = document.getElementById('bookSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const availabilityFilter = document.getElementById('availabilityFilter')?.value || '';

    filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm);

        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        const matchesAvailability = !availabilityFilter || book.availability === availabilityFilter;

        return matchesSearch && matchesCategory && matchesAvailability;
    });

    displayBooks();
}

// Filter history
function filterHistory() {
    const searchTerm = document.getElementById('historySearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    filteredHistory = borrowingHistory.filter(history => {
        const book = books.find(b => b.id === history.bookId);
        if (!book) return false;

        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || history.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    displayBorrowingHistory();
}

// Open borrow modal
function openBorrowModal(bookId) {

    const book = books.find(b => b.id === bookId);
    if (!book) {
        console.error('❌ Book not found for ID:', bookId);
        showMessage('Book not found.', 'error');
        return;
    }


    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrowing period

    // Update modal content
    const borrowModal = document.getElementById('borrowModal');
    if (!borrowModal) {
        console.error('❌ Borrow modal element not found');
        showMessage('Modal not found.', 'error');
        return;
    }

    document.getElementById('borrowBookTitle').textContent = book.title;
    document.getElementById('borrowBookAuthor').textContent = book.author;
    document.getElementById('borrowBookISBN').textContent = `ISBN: ${book.isbn}`;
    document.getElementById('borrowDueDate').textContent = dueDate.toLocaleDateString();
    document.getElementById('currentBorrowedCount').textContent = borrowedBooks.length;

    borrowModal.classList.add('active');
    window.currentBorrowBookId = bookId;

}

// Close borrow modal
function closeBorrowModal() {
    document.getElementById('borrowModal').classList.remove('active');
    window.currentBorrowBookId = null;
}

// Confirm borrow
async function confirmBorrow() {

    if (!window.currentBorrowBookId) {
        console.error('❌ No book ID selected for borrowing');
        showMessage('No book selected for borrowing.', 'error');
        return;
    }

    // Show loading state
    const borrowBtn = document.querySelector('#borrowModal .btn-primary');
    const originalText = borrowBtn.innerHTML;
    borrowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Borrowing...';
    borrowBtn.disabled = true;

    try {
        const book = books.find(b => b.id === window.currentBorrowBookId);
        if (!book) {
            console.error('❌ Book not found:', window.currentBorrowBookId);
            showMessage('Book not found.', 'error');
            return;
        }


        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Add to borrowed books
        const borrowData = {
            bookId: window.currentBorrowBookId,
            borrowerId: currentUser.uid,
            borrowerName: userData.fullName || userData.name,
            borrowerEmail: userData.email,
            bookTitle: book.title,
            bookAuthor: book.author,
            bookISBN: book.isbn,
            borrowDate: new Date().toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'active',
            returnDate: null
        };

        await window.addDoc(window.collection(window.firebaseDb, 'borrowedBooks'), borrowData);

        // Update book availability
        await window.updateDoc(window.doc(window.firebaseDb, 'books', window.currentBorrowBookId), {
            availability: 'borrowed'
        });

        showMessage('Book borrowed successfully!', 'success');
        closeBorrowModal();

        // Reload data
        await loadDashboardData();

    } catch (error) {
        console.error('❌ Error borrowing book:', error);
        console.error('Error details:', error.message);
        showMessage(`Error borrowing book: ${error.message}`, 'error');
    } finally {
        // Reset button state
        const borrowBtn = document.querySelector('#borrowModal .btn-primary');
        borrowBtn.innerHTML = '<i class="fas fa-book"></i> Confirm Borrow';
        borrowBtn.disabled = false;
    }
}

// Open return modal
function openReturnModal(borrowedId) {
    const borrowed = borrowedBooks.find(b => b.id === borrowedId);
    if (!borrowed) return;

    const book = books.find(b => b.id === borrowed.bookId);
    if (!book) return;

    document.getElementById('returnBookTitle').textContent = book.title;
    document.getElementById('returnBookAuthor').textContent = book.author;
    document.getElementById('returnBookISBN').textContent = `ISBN: ${book.isbn}`;
    document.getElementById('returnBorrowDate').textContent = formatDate(borrowed.borrowDate);
    document.getElementById('returnDueDate').textContent = formatDate(borrowed.dueDate);

    const dueDate = new Date(borrowed.dueDate);
    const today = new Date();
    const status = dueDate < today ? 'Overdue' : 'On Time';
    document.getElementById('returnStatus').textContent = status;

    document.getElementById('returnModal').classList.add('active');
    window.currentReturnBorrowedId = borrowedId;
}

// Close return modal
function closeReturnModal() {
    document.getElementById('returnModal').classList.remove('active');
    window.currentReturnBorrowedId = null;
}

// Confirm return
async function confirmReturn() {
    if (!window.currentReturnBorrowedId) return;

    // Show loading state
    const returnBtn = document.querySelector('#returnModal .btn-primary');
    const originalText = returnBtn.innerHTML;
    returnBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Returning...';
    returnBtn.disabled = true;

    try {
        const borrowed = borrowedBooks.find(b => b.id === window.currentReturnBorrowedId);
        if (!borrowed) return;

        // Update borrowed book status
        await window.updateDoc(window.doc(window.firebaseDb, 'borrowedBooks', window.currentReturnBorrowedId), {
            status: 'returned',
            returnDate: new Date().toISOString().split('T')[0]
        });

        // Update book availability
        await window.updateDoc(window.doc(window.firebaseDb, 'books', borrowed.bookId), {
            availability: 'available'
        });

        showMessage('Book returned successfully!', 'success');
        closeReturnModal();

        // Reload data
        await loadDashboardData();

    } catch (error) {
        console.error('Error returning book:', error);
        showMessage('Error returning book. Please try again.', 'error');
    } finally {
        // Reset button state
        returnBtn.innerHTML = '<i class="fas fa-undo"></i> Confirm Return';
        returnBtn.disabled = false;
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

// Automatically load all dashboard sections
async function autoLoadAllSections() {

    try {
        // Wait a bit for the DOM to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Load and display all sections automatically
        await loadAndDisplaySection('overview');

        await loadAndDisplaySection('browse');

        await loadAndDisplaySection('borrowed');

        await loadAndDisplaySection('history');

        await loadAndDisplaySection('profile');

        // Set the overview section as active by default (shows statistics immediately)
        showSection('overview');


    } catch (error) {
        console.error('❌ Error auto-loading sections:', error);
        showMessage('Error loading dashboard sections.', 'error');
    }
}

// Load and display a specific section
async function loadAndDisplaySection(sectionName) {

    try {
        switch (sectionName) {
            case 'overview':
                // Overview section shows statistics (already calculated in updateStats)
                break;

            case 'browse':
                // Books are already loaded in loadDashboardData, just display them
                if (books.length > 0) {
                    displayBooks();
                }
                break;

            case 'borrowed':
                // Borrowed books are already loaded, just display them
                if (borrowedBooks.length > 0) {
                    displayBorrowedBooks();
                }
                break;

            case 'history':
                // History is already loaded, just display it
                if (borrowingHistory.length > 0) {
                    displayBorrowingHistory();
                }
                break;

            case 'profile':
                // Profile data is already loaded in checkUserStatus
                break;

            default:
        }

    } catch (error) {
        console.error(`❌ Error loading section ${sectionName}:`, error);
    }
}

// Show/hide main loading overlay
function showMainLoading(show) {
    let loadingOverlay = document.getElementById('mainLoadingOverlay');

    if (!loadingOverlay) {
        // Create loading overlay if it doesn't exist
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'mainLoadingOverlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="loading-text">
                    <h3>Loading Dashboard...</h3>
                    <p>Fetching data from Firebase</p>
                </div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    if (show) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.style.display = 'none';
        loadingOverlay.classList.remove('active');
    }
}

// Show message
function showMessage(message, type) {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Hide both messages first
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    if (type === 'error') {
        errorMessage.querySelector('.message-text').textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    } else if (type === 'success') {
        successMessage.querySelector('.message-text').textContent = message;
        successMessage.style.display = 'block';
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
}

// Add sample books to Firebase
async function addSampleBooks() {
    const sampleBooks = [
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            isbn: "9780743273565",
            category: "fiction",
            availability: "available",
            description: "A classic American novel about the Jazz Age and the American Dream.",
            publishedYear: 1925,
            publisher: "Scribner",
            language: "English",
            pages: 180,
            condition: "Good",
            location: "Fiction Section A1",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            isbn: "9780061120084",
            category: "fiction",
            availability: "available",
            description: "A gripping tale of racial injustice and childhood innocence.",
            publishedYear: 1960,
            publisher: "J.B. Lippincott & Co.",
            language: "English",
            pages: 281,
            condition: "Excellent",
            location: "Fiction Section A2",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "1984",
            author: "George Orwell",
            isbn: "9780451524935",
            category: "fiction",
            availability: "available",
            description: "A dystopian social science fiction novel about totalitarian control.",
            publishedYear: 1949,
            publisher: "Secker & Warburg",
            language: "English",
            pages: 328,
            condition: "Good",
            location: "Fiction Section A3",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "Introduction to Algorithms",
            author: "Thomas H. Cormen",
            isbn: "9780262033848",
            category: "academic",
            availability: "available",
            description: "Comprehensive textbook on computer algorithms and data structures.",
            publishedYear: 2009,
            publisher: "MIT Press",
            language: "English",
            pages: 1312,
            condition: "Excellent",
            location: "Computer Science Section B1",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "Clean Code",
            author: "Robert C. Martin",
            isbn: "9780132350884",
            category: "academic",
            availability: "available",
            description: "A handbook of agile software craftsmanship.",
            publishedYear: 2008,
            publisher: "Prentice Hall",
            language: "English",
            pages: 464,
            condition: "Good",
            location: "Computer Science Section B2",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            isbn: "9780062316097",
            category: "non-fiction",
            availability: "available",
            description: "An exploration of how Homo sapiens came to dominate the world.",
            publishedYear: 2014,
            publisher: "Harper",
            language: "English",
            pages: 443,
            condition: "Excellent",
            location: "History Section C1",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "The Selfish Gene",
            author: "Richard Dawkins",
            isbn: "9780192860927",
            category: "non-fiction",
            availability: "available",
            description: "A book on evolution that introduced the concept of the 'selfish gene'.",
            publishedYear: 1976,
            publisher: "Oxford University Press",
            language: "English",
            pages: 360,
            condition: "Good",
            location: "Science Section D1",
            addedDate: new Date().toISOString().split('T')[0]
        },
        {
            title: "Oxford English Dictionary",
            author: "Oxford University Press",
            isbn: "9780198611868",
            category: "reference",
            availability: "available",
            description: "The definitive record of the English language.",
            publishedYear: 2020,
            publisher: "Oxford University Press",
            language: "English",
            pages: 2400,
            condition: "Excellent",
            location: "Reference Section E1",
            addedDate: new Date().toISOString().split('T')[0]
        }
    ];

    try {
        for (const book of sampleBooks) {
            await window.addDoc(window.collection(window.firebaseDb, 'books'), book);
        }
    } catch (error) {
        console.error('❌ Error adding sample books:', error);
        throw error;
    }
}

// Helper functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Setup event listeners
function setupEventListeners() {
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


// Sidebar functionality - Works for both Mobile and Desktop
let sidebarOpen = false;
let sidebarCollapsed = false;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggle = document.querySelector('.sidebar-toggle');

    // Add click effect
    if (toggle) {
        toggle.classList.add('clicked');
        setTimeout(() => {
            toggle.classList.remove('clicked');
        }, 800);
    }

    if (window.innerWidth <= 1024) { // Updated to cover tablets as mobile
        // Mobile behavior - slide in/out
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');

        // Update state variable
        sidebarOpen = sidebar.classList.contains('active');

    } else {
        // Desktop behavior - collapse/expand
        sidebarCollapsed = !sidebarCollapsed;

        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            // Update toggle button icon
            const toggleIcon = toggle.querySelector('i');
            if (toggleIcon) toggleIcon.className = 'fas fa-bars';
            // Store state in localStorage
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            sidebar.classList.remove('collapsed');
            // Update toggle button icon
            const toggleIcon = toggle.querySelector('i');
            if (toggleIcon) toggleIcon.className = 'fas fa-times';
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

// Export functions for global access
window.showSection = showSection;
window.handleLogout = handleLogout;
window.showMessage = showMessage;
window.filterBooks = filterBooks;
window.filterHistory = filterHistory;
window.openBorrowModal = openBorrowModal;
window.closeBorrowModal = closeBorrowModal;
window.confirmBorrow = confirmBorrow;
window.openReturnModal = openReturnModal;
window.closeReturnModal = closeReturnModal;
window.confirmReturn = confirmReturn;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

// Initialize the dashboard when the page loads and Firebase is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar first
    initializeSidebar();

    if (window.firebaseReady && window.firebaseAuth && window.firebaseDb) {
        initializeUserDashboard();
    } else {
        // Listen for Firebase ready event
        window.addEventListener('firebaseReady', () => {
            initializeUserDashboard();
        });

        // Listen for Firebase error event
        window.addEventListener('firebaseError', (event) => {
            console.error('❌ Firebase initialization error:', event.detail);
            showMessage('Firebase initialization failed. Please refresh the page and try again.', 'error');
        });

        // Fallback timeout in case Firebase ready event never fires
        setTimeout(() => {
            if (!window.firebaseReady) {
                // Try to initialize anyway if Firebase functions are available
                if (window.firebaseAuth && window.firebaseDb && window.collection && window.getDocs) {
                    initializeUserDashboard();
                } else {
                    showMessage('Firebase initialization timeout. Please refresh the page and try again.', 'error');
                }
            }
        }, 5000); // 5 second timeout
    }
});
