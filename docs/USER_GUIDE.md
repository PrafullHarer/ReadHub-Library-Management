# 📚 ReadHub Library Management System - User Guide

Welcome to ReadHub, a modern digital library management system designed for educational institutions. This guide will help you get started and make the most of all the features available.

**Version 1.2.0** | Last Updated: December 2025

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [For Students/Members](#for-studentsmembers)
3. [For Administrators](#for-administrators)
4. [Common Features](#common-features)
5. [Mobile Experience](#mobile-experience)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## 🚀 Getting Started

### Accessing the System

1. Open your web browser (Chrome, Firefox, Safari, or Edge recommended)
2. Navigate to the ReadHub homepage:
   - **Production**: `https://your-domain.vercel.app/` or your custom domain
   - **Local Development**: `http://localhost:8000`
3. Click **"Login"** in the navigation bar or go to `/login`

### Available Pages

| URL | Page |
|-----|------|
| `/` | Welcome/Home page |
| `/login` | Login page |
| `/admin` | Admin Dashboard |
| `/dashboard` | Student Dashboard |
| `/contact` | Contact/Feedback page |

### First-Time Login

If you're a new user, your administrator should have created an account for you. Use the credentials provided to log in:

1. Select your **Account Type** (Student/Member or Administrator)
2. Enter your **Email Address**
3. Enter your **Password**
4. Click **"Sign In"**

> 💡 **Tip:** The system works great on mobile devices - bookmark the login page for quick access!

---

## 👤 For Students/Members

### Dashboard Overview

After logging in, you'll see your personalized student dashboard with:

- **Profile Information** - Your name, student ID, and membership details
- **Borrowed Books** - List of books you currently have
- **Available Books** - Browse the library catalog
- **Billing Information** - View your dues and payment status

### Borrowing a Book

1. Navigate to the **"Available Books"** section
2. Use the search bar to find books by **title**, **author**, or **ISBN**
3. Click on a book to view its details
4. Click **"Borrow"** to check out the book
5. Note the **due date** displayed

### Returning a Book

1. Go to **"My Borrowed Books"** section
2. Find the book you want to return
3. Click **"Return"** button
4. Confirm the return

### Viewing Your History

- Access your complete borrowing history from the dashboard
- See all past and current borrowings
- Check for any overdue books or pending fines

### Making Payments

ReadHub supports **UPI payments** for dues:

1. Navigate to the **Billing** section
2. View your outstanding amount
3. Click **"Pay Now"** button
4. You'll be redirected to complete payment via UPI
5. Payment confirmation will update automatically

### Downloading Bill PDF

1. Go to your billing section
2. Click **"Download Bill"**
3. A PDF will be generated with:
   - Your student details
   - Absent days with shift information
   - Final payable amount
   - UPI payment link

---

## 🔧 For Administrators

### Admin Dashboard Overview

The admin dashboard provides comprehensive control over the library system:

| Section | Description |
|---------|-------------|
| **Overview** | Key statistics and metrics at a glance |
| **Books** | Manage the book catalog |
| **Users** | Manage student and member accounts |
| **Borrowed Books** | Track all borrowing activities |
| **Feedback** | Handle user feedback and suggestions |
| **Reports** | Analytics and insights |

### Managing Books

#### Adding a New Book

1. Go to **"Books"** section
2. Click **"Add Book"** button
3. Fill in the book details:
   - Title
   - Author
   - ISBN
   - Condition (Excellent, Good, Fair, Poor)
   - Description
4. Click **"Save"**

#### Editing a Book

1. Find the book in the list
2. Click the **"Edit"** icon
3. Update the necessary fields
4. Click **"Save Changes"**

#### Deleting a Book

1. Find the book in the list
2. Click the **"Delete"** icon
3. Confirm deletion

> ⚠️ **Warning:** Deleting a book is permanent and cannot be undone.

### Managing Users

#### Adding a New User

1. Navigate to **"Users"** section
2. Click **"Add User"**
3. Fill in member details:
   - Full Name
   - Email
   - Student ID
   - Department
   - Year
   - Phone Number
   - Password
4. Click **"Create User"**

#### Editing User Information

1. Find the user in the list
2. Click the **"Edit"** icon
3. Update the required fields
4. Save changes

#### Managing User Status

Users can have the following statuses:
- **Active** - Full access to the library
- **Pending** - Awaiting admin approval
- **Suspended** - Temporarily blocked access

### Tracking Borrowed Books

#### Viewing All Borrowings

1. Go to **"Borrowed Books"** section
2. View list of all active, overdue, and returned books

#### Search Options

- **General Search**: Search by book title, author, borrower name, email, or department
- **Student ID Search**: Dedicated search box for finding by student ID

#### Filtering

Filter borrowings by:
- **Status**: Active, Overdue, or Returned
- **Date Range**: Specific borrowing periods

### Managing Feedback

#### Viewing Feedback

1. Navigate to **"Feedback"** section
2. See all submitted feedback sorted by date

#### Feedback Types

- 💡 **Suggestion** - User ideas and improvements
- 😊 **Compliment** - Positive feedback
- 😟 **Complaint** - Issues and concerns
- 🐛 **Bug Report** - System problems
- ✨ **Feature Request** - New feature ideas

#### Responding to Feedback

1. Click on a feedback item
2. Review the details
3. Update the status:
   - **New** → **In Progress** → **Resolved** → **Closed**
4. Add an admin response
5. Set priority if needed (Low, Medium, High, Urgent)

---

## 🌟 Common Features

### Search & Filtering

All sections support powerful search capabilities:

- **Quick Search**: Type in the search bar to filter results
- **Advanced Filters**: Use dropdown menus for specific criteria
- **Multi-field Search**: Search across multiple fields simultaneously

### Navigation

- Use the **sidebar** on desktop for quick navigation
- On mobile, tap the **menu icon** to access navigation
- **Breadcrumbs** help you track your location

### Responsive Design

ReadHub works seamlessly on:
- 💻 **Desktop computers**
- 💻 **Laptops**
- 📱 **Tablets**
- 📱 **Smartphones**

### Logging Out

1. Click your **profile icon** or **Logout** button
2. Confirm logout
3. You'll be redirected to the login page

---

## 📱 Mobile Experience

ReadHub is fully optimized for mobile devices with touch-friendly interactions.

### Mobile Features

- **Touch-Optimized Buttons**: All buttons are sized for easy tapping
- **Swipe Navigation**: Navigate between sections with smooth gestures
- **Responsive Tables**: Tables scroll horizontally on smaller screens
- **Collapsible Sidebar**: Tap the menu icon to access navigation
- **Pull-to-Refresh**: Standard mobile gestures supported

### Mobile-Specific Tips

1. **Add to Home Screen**: Install ReadHub as a web app for quick access
2. **UPI Payments**: Tap "Pay Now" to open your UPI app directly
3. **PDF Downloads**: Bills are saved to your Downloads folder
4. **Landscape Mode**: Use landscape orientation for better table viewing

### Supported Devices

| Device Type | Minimum Requirements |
|-------------|---------------------|
| **iPhone** | iOS 13+ with Safari |
| **Android** | Android 8+ with Chrome |
| **iPad** | iPadOS 13+ |
| **Android Tablet** | Android 8+ |

---

## 🔧 Troubleshooting

### Common Issues

#### Can't Log In

- ✅ Verify you selected the correct account type
- ✅ Check your email for typos
- ✅ Ensure Caps Lock is off when entering password
- ✅ Try clearing browser cache
- ✅ Contact your administrator if problems persist

#### Page Not Loading

- ✅ Check your internet connection
- ✅ Refresh the page (F5 or Ctrl+R)
- ✅ Try a different browser
- ✅ Clear browser cache and cookies

#### Book Borrowing Failed

- ✅ Ensure the book is marked as "Available"
- ✅ Check if you have any overdue books
- ✅ Verify your account is in "Active" status

#### Payment Issues

- ✅ Ensure a stable internet connection
- ✅ Verify the UPI app is installed on your device
- ✅ Check if the correct amount is displayed
- ✅ Try again after a few minutes

### Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

---

## ❓ FAQs

### General Questions

**Q: How do I reset my password?**
> Contact your system administrator to reset your password.

**Q: Can I access ReadHub on my phone?**
> Yes! ReadHub is fully responsive and works on all mobile devices.

**Q: How many books can I borrow at once?**
> This depends on your membership type and institution's policy. Check with your administrator.

### For Students

**Q: How do I know when my book is due?**
> Due dates are displayed in your "Borrowed Books" section.

**Q: What happens if I return a book late?**
> Late returns may incur fines. Check the billing section for any dues.

**Q: How do I submit feedback?**
> Use the "Contact" page to submit suggestions, complaints, or bug reports.

### For Administrators

**Q: How do I generate reports?**
> Navigate to the Reports section in the admin dashboard for various analytics options.

**Q: Can I export data?**
> Export functionality varies by section. Look for export buttons in each section.

**Q: How do I backup the database?**
> Database backups are managed through Firebase console. See the Developer Documentation for details.

---

## 📞 Need Help?

If you need additional assistance:

- **Email**: contact@readhub.com
- **Phone**: +91 99999 99999
- **Address**: KIT College of Engineering, Kolhapur, Maharashtra, India

---

## 🎯 Quick Tips

1. 📖 **Bookmark** the login page for quick access
2. 🔔 **Check regularly** for due dates to avoid fines
3. 📱 **Use mobile** for quick book searches on-the-go
4. 💬 **Submit feedback** to help improve the system
5. 🔐 **Never share** your login credentials

---

*ReadHub Library Management System - Modernizing library operations for educational institutions worldwide.* 📚✨
