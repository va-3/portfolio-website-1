// ===================================
// Main JavaScript - Portfolio Website
// ===================================

// Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-md)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Height of fixed navbar
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery lightbox effect (simple version)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                padding: 20px;
            `;

            const img = this.querySelector('img').cloneNode(true);
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;

            lightbox.appendChild(img);
            document.body.appendChild(lightbox);

            // Close lightbox on click
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });

            // Close on escape key
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    if (document.body.contains(lightbox)) {
                        document.body.removeChild(lightbox);
                    }
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        });
    });

    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animation
    const animateElements = document.querySelectorAll(
        '.goal-card, .timeline-item, .gallery-item, .fact-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Profile photo error handling
    const profilePhoto = document.getElementById('profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('error', function() {
            // Set a placeholder if image fails to load
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="350" height="350"><rect fill="%23667eea" width="350" height="350"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">Profile Photo</text></svg>';
        });
    }

    // Gallery images error handling
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('error', function() {
            const index = Array.from(this.parentElement.parentElement.children).indexOf(this.parentElement) + 1;
            this.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23${getRandomColor()}" width="400" height="400"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">Gallery ${index}</text></svg>`;
        });
    });

    // Helper function to generate random colors for placeholders
    function getRandomColor() {
        const colors = ['667eea', '764ba2', '2563eb', '8b5cf6', 'f59e0b', '10b981'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Video player enhancements
    const video = document.querySelector('.video-container video');
    if (video) {
        video.addEventListener('error', function() {
            this.parentElement.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 60px 20px;
                    text-align: center;
                    border-radius: 12px;
                ">
                    <i class="fas fa-video" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.125rem;">Video will be available soon</p>
                    <p style="opacity: 0.8; margin-top: 0.5rem;">Place your 30-second video in videos/about-me.mp4</p>
                </div>
            `;
        });
    }

    // Add active state to current section in nav
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';

        // Check if we're at the bottom of the page
        const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50;

        if (isAtBottom) {
            // If at bottom, highlight Contact
            current = 'contact';
        } else {
            // Normal scroll spy behavior
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add fade-in animation to sections on load
    setTimeout(() => {
        document.querySelector('.hero').style.opacity = '1';
    }, 100);

    console.log('Portfolio website initialized successfully!');
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
    .hero {
        opacity: 0;
        transition: opacity 0.8s ease;
    }
`;
document.head.appendChild(style);
