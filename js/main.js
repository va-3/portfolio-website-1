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

    // Navbar scroll effect with throttling
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    let navbarTicking = false;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-md)';
        }

        lastScroll = currentScroll;
        navbarTicking = false;
    }

    window.addEventListener('scroll', function() {
        if (!navbarTicking) {
            requestAnimationFrame(updateNavbar);
            navbarTicking = true;
        }
    }, { passive: true });

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

    // Add active state to current section in nav with throttling
    const sections = document.querySelectorAll('section[id]');
    let navTicking = false;

    function updateActiveNav() {
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

        navTicking = false;
    }

    window.addEventListener('scroll', function() {
        if (!navTicking) {
            requestAnimationFrame(updateActiveNav);
            navTicking = true;
        }
    }, { passive: true });

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

// ===================================
// TIMELINE DOT SCROLL TRACKING
// ===================================
// Cache DOM elements for performance
let timelineElement = null;
let dotElement = null;
let timelineOffsetTop = 0;
let timelineHeight = 0;

function cacheTimelineElements() {
    timelineElement = document.querySelector('.timeline');
    dotElement = document.querySelector('.timeline-dot-animated');

    if (timelineElement) {
        const rect = timelineElement.getBoundingClientRect();
        timelineOffsetTop = rect.top + window.scrollY;
        timelineHeight = rect.height;
    }
}

function updateTimelineDot() {
    if (!timelineElement || !dotElement) return;

    const viewportHeight = window.innerHeight;
    const scrollY = window.pageYOffset || window.scrollY;

    // Calculate progress through timeline (0 to 1)
    const scrolledPast = scrollY - timelineOffsetTop + (viewportHeight * 0.3);
    const progress = Math.max(0, Math.min(1, scrolledPast / timelineHeight));

    // Update dot position using transform for GPU acceleration
    const newTop = progress * timelineHeight;
    const scale = progress > 0 && progress < 1 ? 1 : 0.8;

    // Use translate3d for GPU acceleration (Y-axis only, X position set via CSS)
    dotElement.style.transform = `translate3d(0, ${newTop}px, 0) scale(${scale})`;
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

// Recalculate dimensions on resize
function handleResize() {
    cacheTimelineElements();
    updateTimelineDot();
}

// Initialize and attach event listeners with passive flag for better scroll performance
document.addEventListener('DOMContentLoaded', () => {
    cacheTimelineElements();
    updateTimelineDot();
});

window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
window.addEventListener('resize', handleResize);

// ===================================
// Universal Fullscreen Video Handler
// Works on ALL devices (desktop + mobile)
// ===================================

/**
 * Handle fullscreen video with letterboxing to show complete frame
 * Applies on ALL screen sizes, not just mobile
 */
function initUniversalFullscreenVideo() {
    const videos = document.querySelectorAll('.video-container video');

    videos.forEach(video => {
        // Generate unique storage key for this video
        const videoId = video.src || 'about-video';
        const storageKey = `video-progress-${videoId}`;

        // Restore saved progress on page load
        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress) {
            const savedTime = parseFloat(savedProgress);
            video.currentTime = savedTime;
            console.log(`[Video Progress] Restored saved position: ${savedTime.toFixed(2)}s`);
        }

        // Save progress as video plays (debounced to avoid excessive writes)
        let saveTimeout;
        video.addEventListener('timeupdate', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                // Don't save if at the very end (within 2 seconds)
                if (video.duration - video.currentTime > 2) {
                    localStorage.setItem(storageKey, video.currentTime.toString());
                }
            }, 1000); // Save every 1 second of playback
        });

        // Clear saved progress when video ends
        video.addEventListener('ended', () => {
            localStorage.removeItem(storageKey);
            console.log('[Video Progress] Video completed - cleared saved progress');
        });

        // Click to fullscreen - prevent inline playback
        video.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Enter fullscreen mode
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }

            console.log('[Fullscreen] User clicked video - entering fullscreen mode');
        });

        // Prevent default play behavior on click
        video.addEventListener('play', (e) => {
            const isFullscreen = document.fullscreenElement === video ||
                               document.webkitFullscreenElement === video ||
                               document.mozFullScreenElement === video;

            // Only allow play if already in fullscreen
            if (!isFullscreen) {
                e.preventDefault();
                video.pause();
                console.log('[Fullscreen] Prevented inline play - use fullscreen only');
            }
        });

        // Listen for all fullscreen change events (all vendor prefixes)
        document.addEventListener('fullscreenchange', () => handleVideoFullscreen(video));
        document.addEventListener('webkitfullscreenchange', () => handleVideoFullscreen(video));
        document.addEventListener('mozfullscreenchange', () => handleVideoFullscreen(video));
        document.addEventListener('MSFullscreenChange', () => handleVideoFullscreen(video));

        console.log('[Fullscreen Init] Attached click-to-fullscreen handler with progress saving');
    });
}

/**
 * Apply fullscreen styles with maximum priority to force letterboxing
 */
function handleVideoFullscreen(video) {
    const fullscreenElement = document.fullscreenElement ||
                             document.webkitFullscreenElement ||
                             document.mozFullScreenElement ||
                             document.msFullscreenElement;

    console.log('[Fullscreen] State change detected:', {
        fullscreenElement: fullscreenElement?.tagName,
        isVideo: fullscreenElement === video,
        videoSrc: video?.src
    });

    if (fullscreenElement && fullscreenElement === video) {
        // Entering fullscreen - force letterboxing with !important
        console.log('[Fullscreen] Entering fullscreen mode - applying letterbox styles');

        // Use requestAnimationFrame to ensure timing after fullscreen transition
        requestAnimationFrame(() => {
            // Apply styles with maximum priority (!important flag)
            video.style.setProperty('object-fit', 'contain', 'important');
            video.style.setProperty('object-position', 'center center', 'important');

            // Force aspect ratio preservation with letterboxing
            video.style.setProperty('max-width', '100vw', 'important');
            video.style.setProperty('max-height', '100vh', 'important');
            video.style.setProperty('width', 'auto', 'important');
            video.style.setProperty('height', 'auto', 'important');

            // Center the video in fullscreen viewport
            video.style.setProperty('position', 'absolute', 'important');
            video.style.setProperty('top', '50%', 'important');
            video.style.setProperty('left', '50%', 'important');
            video.style.setProperty('transform', 'translate(-50%, -50%)', 'important');

            // Black background for letterboxing
            video.style.setProperty('background-color', '#000', 'important');

            // Force repaint to ensure styles apply immediately
            void video.offsetHeight;

            // Auto-play video in fullscreen with controls
            video.controls = true;
            video.play().catch(err => {
                console.warn('[Fullscreen] Auto-play blocked:', err);
            });

            // Debug: verify applied styles
            const computed = getComputedStyle(video);
            console.log('[Fullscreen] Styles applied:', {
                objectFit: computed.objectFit,
                objectPosition: computed.objectPosition,
                width: computed.width,
                height: computed.height,
                position: computed.position,
                transform: computed.transform
            });
        });
    } else if (!fullscreenElement && video) {
        // Exiting fullscreen - remove all inline styles, keep progress saved
        console.log('[Fullscreen] Exiting fullscreen mode - restoring normal styles');

        // Pause video but DON'T reset currentTime (progress is saved in localStorage)
        video.pause();
        video.controls = false; // Remove controls when exiting fullscreen

        // Note: We don't call video.load() or reset currentTime
        // Progress is preserved in localStorage and will resume on next click

        video.style.removeProperty('object-fit');
        video.style.removeProperty('object-position');
        video.style.removeProperty('width');
        video.style.removeProperty('height');
        video.style.removeProperty('max-width');
        video.style.removeProperty('max-height');
        video.style.removeProperty('position');
        video.style.removeProperty('top');
        video.style.removeProperty('left');
        video.style.removeProperty('transform');
        video.style.removeProperty('background-color');

        console.log('[Fullscreen] Normal styles restored, progress saved at', video.currentTime.toFixed(2) + 's');
    }
}

// Initialize universal fullscreen handler on page load
document.addEventListener('DOMContentLoaded', initUniversalFullscreenVideo);
