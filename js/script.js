// ===================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}, { passive: true });

// ===================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation, { passive: true });
window.addEventListener('load', highlightNavigation);

// ===================================
// TIMELINE DOT SCROLL TRACKING
// ===================================
function updateTimelineDot() {
    const timeline = document.querySelector('.timeline');
    const dot = document.querySelector('.timeline-dot-animated');

    if (!timeline || !dot) return;

    // Get timeline boundaries
    const timelineRect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollY = window.pageYOffset || window.scrollY;

    // Calculate the timeline's absolute position
    const timelineTop = timelineRect.top + scrollY;
    const timelineHeight = timelineRect.height;

    // Track based on how much of timeline has scrolled past viewport top
    const scrolledPast = scrollY - timelineTop + (viewportHeight * 0.3);
    const progress = Math.max(0, Math.min(1, scrolledPast / timelineHeight));

    // Update dot position
    const newTop = progress * timelineHeight;
    dot.style.top = `${newTop}px`;

    // Ensure dot is visible
    dot.style.opacity = '1';

    // Scale based on progress
    const scale = progress > 0 && progress < 1 ? 1 : 0.8;
    dot.style.transform = `translateX(-50%) scale(${scale})`;
}

// Use requestAnimationFrame for smooth 60fps animation
let timelineTicking = false;
function requestTimelineUpdate() {
    if (!timelineTicking) {
        requestAnimationFrame(() => {
            updateTimelineDot();
            timelineTicking = false;
        });
        timelineTicking = true;
    }
}

// Attach event listeners for timeline dot
window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
window.addEventListener('resize', updateTimelineDot);
document.addEventListener('DOMContentLoaded', updateTimelineDot);

// ===================================
// FADE-IN ANIMATION ON SCROLL
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all major elements for fade-in effect
const fadeElements = [
    '.stat-card',
    '.goal-card',
    '.highlight-card',
    '.interest-card'
];

fadeElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// ===================================
// TYPING EFFECT FOR HERO TAGLINE (Optional Enhancement)
// ===================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment to enable typing effect
// window.addEventListener('load', () => {
//     const tagline = document.querySelector('.hero-tagline');
//     if (tagline) {
//         const text = tagline.textContent;
//         typeWriter(tagline, text, 50);
//     }
// });

// ===================================
// VIDEO PLAYER ENHANCEMENT (When video is added)
// ===================================
function initializeVideoPlayer() {
    const videoWrapper = document.getElementById('video-wrapper');
    const video = videoWrapper?.querySelector('video');

    if (video) {
        // Add custom play button overlay
        const playButton = document.createElement('div');
        playButton.className = 'video-play-button';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        playButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: rgba(37, 99, 235, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        `;

        videoWrapper.appendChild(playButton);

        // Play video on button click
        playButton.addEventListener('click', () => {
            video.play();
            playButton.style.display = 'none';
        });

        // Show button when video is paused
        video.addEventListener('pause', () => {
            playButton.style.display = 'flex';
        });

        // Hide button when video is playing
        video.addEventListener('play', () => {
            playButton.style.display = 'none';
        });
    }
}

// Call when video is added
window.addEventListener('load', initializeVideoPlayer);

// ===================================
// SMOOTH PAGE LOAD
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);
});

// ===================================
// PERFORMANCE OPTIMIZATION: Debounce scroll events
// ===================================
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(highlightNavigation, 10), { passive: true });

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Announce section changes to screen readers
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.querySelector('.section-title')?.textContent ||
                               entry.target.querySelector('h1, h2')?.textContent;
            if (sectionName) {
                // Update document title for screen readers
                document.title = `${sectionName} - Vishnu Anapalli | Professional Portfolio`;
            }
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ===================================
// CONSOLE MESSAGE (Optional - Professional Touch)
// ===================================
console.log(
    '%c👋 Hello, Developer!',
    'font-size: 24px; font-weight: bold; color: #2563eb;'
);
console.log(
    '%cInterested in the code behind this portfolio? Check out the repository!',
    'font-size: 14px; color: #475569;'
);
console.log(
    '%cBuilt with HTML, CSS, and vanilla JavaScript',
    'font-size: 12px; color: #94a3b8;'
);

// ===================================
// INITIALIZE ALL FEATURES ON LOAD
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active navigation link
    highlightNavigation();

    // Initialize any animations
    document.body.style.visibility = 'visible';

    // Log successful initialization
    console.log('Portfolio website initialized successfully!');
});

// ===================================
// EXPORT FOR TESTING (Optional)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        typeWriter,
        initializeVideoPlayer
    };
}
