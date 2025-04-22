// Store messages in localStorage for demo purposes
// In a real application, these would be stored in a database
const STORAGE_KEY = 'contact_messages';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // In a real application, use proper authentication

// Initialize storage
if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

// Scroll Animation Logic
function handleScrollAnimations() {
    const rocket = document.querySelector('.rocket');
    const serviceCards = document.querySelectorAll('.service-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Rocket animation - appears when scrolling starts
    if (window.scrollY > 50) {
        rocket.classList.add('visible');
    } else {
        rocket.classList.remove('visible');
    }

    // Service cards animation
    serviceCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = card.getBoundingClientRect().bottom;
        
        if (cardTop < window.innerHeight * 0.8 && cardBottom > 0) {
            card.classList.add('visible');
        }
    });

    // Testimonial cards animation
    testimonialCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = card.getBoundingClientRect().bottom;
        
        if (cardTop < window.innerHeight * 0.8 && cardBottom > 0) {
            card.classList.add('visible');
        }
    });
}

// Add scroll event listener with throttling
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScrollAnimations();
            ticking = false;
        });
        ticking = true;
    }
});

// Initial check for elements in view
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimations();
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value,
            date: new Date().toISOString(),
            id: Date.now()
        };

        // Save message
        const messages = JSON.parse(localStorage.getItem(STORAGE_KEY));
        messages.push(formData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

        // Show success message
        document.getElementById('successMessage').style.display = 'block';
        contactForm.reset();

        // Hide success message after 3 seconds
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 3000);
    });
}

// Admin Login Handling
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('messagesContainer').style.display = 'block';
            loadMessages();
        } else {
            document.getElementById('loginError').style.display = 'block';
            setTimeout(() => {
                document.getElementById('loginError').style.display = 'none';
            }, 3000);
        }
    });
}

// Load and display messages in admin panel
function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;

    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY));
    messagesList.innerHTML = messages.length === 0 
        ? '<p>No messages yet.</p>' 
        : messages.reverse().map(message => createMessageCard(message)).join('');
}

// Create HTML for message card
function createMessageCard(message) {
    const date = new Date(message.date).toLocaleString();
    return `
        <div class="message-card" data-id="${message.id}">
            <div class="message-header">
                <h3>${message.name}</h3>
                <span class="message-meta">${date}</span>
            </div>
            <div class="message-content">
                <p><strong>Email:</strong> ${message.email}</p>
                ${message.company ? `<p><strong>Company:</strong> ${message.company}</p>` : ''}
                <p><strong>Message:</strong> ${message.message}</p>
            </div>
            <div class="message-actions">
                <button class="action-btn reply-btn" onclick="replyToMessage('${message.email}')">
                    <i class="fas fa-reply"></i> Reply
                </button>
                <button class="action-btn delete-btn" onclick="deleteMessage(${message.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
}

// Reply to message
function replyToMessage(email) {
    window.location.href = `mailto:${email}`;
}

// Delete message
function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        const messages = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const updatedMessages = messages.filter(message => message.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
        loadMessages();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 