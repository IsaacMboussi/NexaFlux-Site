// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    }
});

// Back to Top Button
document.addEventListener('scroll', () => {
    const backToTop = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Utility function for showing notifications
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => notification.remove(), 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
};

// Contact Form with enhanced functionality
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    // Form validation
    const validateForm = (formData) => {
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (message.length < 10) {
            throw new Error('Message must be at least 10 characters long');
        }
        
        return true;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        
        try {
            // Validate form
            validateForm(formData);
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            
            // Send to your backend
            const response = await fetch('https://api.nexaflux.com/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }
            
            showNotification('Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
            
            // Track successful submission (if using analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            }
            
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Error:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Newsletter subscription with enhanced functionality
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    let isSubmitting = false;

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const email = emailInput.value;

        try {
            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Subscribing...';

            // Check if email already exists
            const checkResponse = await fetch(`https://api.nexaflux.com/v1/newsletter/check-email?email=${encodeURIComponent(email)}`);
            const checkData = await checkResponse.json();

            if (checkData.exists) {
                throw new Error('This email is already subscribed!');
            }

            // Subscribe the email
            const response = await fetch('https://api.nexaflux.com/v1/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    source: 'website',
                    timestamp: new Date().toISOString()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Subscription failed');
            }

            showNotification('Thanks for subscribing! Please check your email to confirm.');
            newsletterForm.reset();

            // Track successful subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_subscription', {
                    'event_category': 'Newsletter',
                    'event_label': 'Homepage Subscribe'
                });
            }

        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Error:', error);
        } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        }
    });
}

// Cookie Banner
const cookieBanner = document.querySelector('.cookie-banner');
const acceptCookiesBtn = document.querySelector('.accept-cookies');

if (cookieBanner && acceptCookiesBtn) {
    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.style.display = 'flex';
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.opacity = '0';
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 300);
    });
}

// FAQ Accordion Animation
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
        if (item.open) {
            // Close other open details
            document.querySelectorAll('.faq-item[open]').forEach(openItem => {
                if (openItem !== item) openItem.removeAttribute('open');
            });
        }
    });
});

// Form Input Animation
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    // Add placeholder to maintain label position when field has content
    input.setAttribute('placeholder', ' ');
    
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Add this CSS for notifications and loading spinner
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        border-left: 4px solid #28a745;
    }

    .notification.error {
        border-left: 4px solid #dc3545;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.5;
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
});