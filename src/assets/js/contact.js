// Contact Page JavaScript - ReadHub Library Management

document.addEventListener('DOMContentLoaded', function() {
    console.log('📞 Contact page loaded, initializing...');
    // Initialize contact form
    initContactForm();
    
    // Initialize animations
    initAnimations();
    console.log('✅ Contact page initialization completed');
});

// Contact Form Functionality
function initContactForm() {
    console.log('📝 Initializing contact form...');
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log('✅ Contact form found, adding event listener');
        contactForm.addEventListener('submit', handleFormSubmit);
    } else {
        console.warn('⚠️ Contact form not found');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📤 Contact form submission started');
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get form values
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    console.log('📋 Form data collected:', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        subject: subject,
        messageLength: message ? message.length : 0
    });
    
    // Validate form
    if (!validateForm(firstName, lastName, email, subject, message)) {
        console.warn('⚠️ Form validation failed');
        return;
    }
    
    console.log('✅ Form validation passed');
    // Show loading state
    showLoadingState();
    
    // Save feedback to Firebase
    saveFeedbackToFirebase(firstName, lastName, email, phone, subject, message);
}

function validateForm(firstName, lastName, email, subject, message) {
    let isValid = true;
    const errors = [];
    
    // Clear previous error states
    clearErrorStates();
    
    // Validate first name
    if (!firstName || firstName.trim().length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName || lastName.trim().length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!subject || subject.trim().length < 5) {
        showFieldError('subject', 'Subject must be at least 5 characters long');
        isValid = false;
    }
    
    // Validate message
    if (!message || message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
}

function clearErrorStates() {
    const errorFields = document.querySelectorAll('.form-input.error, .form-textarea.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.remove();
    });
}

function showLoadingState() {
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <div class="button-loader">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <span>Sending...</span>
        `;
    }
}

function hideLoadingState() {
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = `
            <i class="fas fa-paper-plane"></i>
            <span>Send Message</span>
        `;
    }
}

function showSuccessMessage() {
    showMessage('success', 'Message sent successfully! We\'ll get back to you soon.');
}

function showErrorMessage(message) {
    showMessage('error', message);
}

function showMessage(type, text) {
    // Remove existing message
    const existingMessage = document.querySelector('.message-container');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${type}-message`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    messageContainer.innerHTML = `
        <div class="message-content">
            <i class="${icon}"></i>
            <span class="message-text">${text}</span>
        </div>
    `;
    
    document.body.appendChild(messageContainer);
    
    // Show message
    setTimeout(() => {
        messageContainer.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageContainer.classList.remove('show');
        setTimeout(() => {
            if (messageContainer.parentNode) {
                messageContainer.parentNode.removeChild(messageContainer);
            }
        }, 300);
    }, 5000);
}

// Animation Functions
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.team-member, .contact-card, .form-wrapper');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initSmoothScrolling();

// Form field focus effects
function initFormFieldEffects() {
    const formFields = document.querySelectorAll('.form-input, .form-textarea');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (field.value) {
            field.parentNode.classList.add('focused');
        }
    });
}

// Initialize form field effects
initFormFieldEffects();

// Social link click tracking (for analytics)
function initSocialTracking() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.querySelector('i').className;
            console.log(`Social link clicked: ${platform}`);
            
            // Add analytics tracking here if needed
            // Example: gtag('event', 'social_click', { platform: platform });
        });
    });
}

// Initialize social tracking
initSocialTracking();

// Firebase feedback saving function
async function saveFeedbackToFirebase(firstName, lastName, email, phone, subject, message) {
    try {
        console.log('🔥 Saving feedback to Firebase...');
        
        // Check if Firebase is available
        if (!window.firebaseDb || !window.addDoc || !window.collection) {
            console.warn('⚠️ Firebase not available, falling back to simulation');
            setTimeout(() => {
                hideLoadingState();
                showSuccessMessage();
                document.getElementById('contactForm').reset();
            }, 2000);
            return;
        }
        
        // Determine feedback type based on subject content
        const feedbackType = determineFeedbackType(subject, message);
        
        // Create feedback data
        const feedbackData = {
            userName: `${firstName} ${lastName}`,
            userEmail: email,
            userPhone: phone || '',
            subject: subject,
            message: message,
            type: feedbackType,
            status: 'new',
            priority: 'medium',
            createdAt: new Date(),
            adminResponse: '',
            updatedAt: null,
            updatedBy: null
        };
        
        console.log('📝 Feedback data prepared:', feedbackData);
        
        // Save to Firebase
        await window.addDoc(window.collection(window.firebaseDb, 'feedback'), feedbackData);
        
        console.log('✅ Feedback saved successfully to Firebase');
        hideLoadingState();
        showSuccessMessage();
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error('❌ Error saving feedback to Firebase:', error);
        hideLoadingState();
        showErrorMessage('Failed to send message. Please try again later.');
    }
}

// Determine feedback type based on content
function determineFeedbackType(subject, message) {
    const content = (subject + ' ' + message).toLowerCase();
    
    if (content.includes('bug') || content.includes('error') || content.includes('problem') || content.includes('issue')) {
        return 'bug-report';
    } else if (content.includes('suggest') || content.includes('recommend') || content.includes('improve') || content.includes('enhance')) {
        return 'suggestion';
    } else if (content.includes('complaint') || content.includes('angry') || content.includes('disappointed') || content.includes('frustrated')) {
        return 'complaint';
    } else if (content.includes('thank') || content.includes('great') || content.includes('excellent') || content.includes('love') || content.includes('amazing')) {
        return 'compliment';
    } else if (content.includes('feature') || content.includes('request') || content.includes('add') || content.includes('new functionality')) {
        return 'feature-request';
    } else {
        return 'general';
    }
}

// Utility function to format phone number
function formatPhoneNumber(input) {
    const phoneNumber = input.value.replace(/\D/g, '');
    const formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    input.value = formattedNumber;
}

// Add phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
}

// Add character counter for message textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-top: 0.5rem;
    `;
    
    messageTextarea.parentNode.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - messageTextarea.value.length;
        counter.textContent = `${remaining} characters remaining`;
        counter.style.color = remaining < 100 ? 'var(--danger-color)' : 'var(--text-muted)';
    }
    
    messageTextarea.addEventListener('input', updateCounter);
    updateCounter();
}
