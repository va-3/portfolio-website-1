/**
 * Mobile Fullscreen Modal System (2026)
 * Handles About Me and Timeline modals with swipe gestures
 */

// Modal state management
const modals = {
    about: document.getElementById('about-modal'),
    timeline: document.getElementById('timeline-modal')
};

let previousFocus = null; // For accessibility: restore focus when modal closes
let touchStartY = 0;
let touchCurrentY = 0;
let isDragging = false;
let modalIsOpen = false; // Prevent multiple simultaneous modal opens

/**
 * Initialize mobile modal system
 * Only activates on mobile viewports (< 769px)
 */
function initMobileModals() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    initAboutModal();
    initTimelineModals();
    initModalControls();
}

/**
 * About Me Modal Setup
 */
function initAboutModal() {
    const aboutCard = document.querySelector('.about-text-card');
    const videoContainer = document.querySelector('.video-container');
    const video = videoContainer ? videoContainer.querySelector('video') : null;

    if (!aboutCard) return;

    // Make About Me card tappable
    aboutCard.addEventListener('click', () => {
        openAboutModal();
    });

    // Mobile video fullscreen behavior
    if (video && videoContainer) {
        // Tap video container to enter fullscreen
        videoContainer.addEventListener('click', (e) => {
            // Only trigger if clicking the video itself, not the controls
            if (e.target === video || e.target === videoContainer) {
                enterVideoFullscreen(video);
            }
        });

        // Listen for fullscreen exit to reset video
        document.addEventListener('fullscreenchange', () => handleFullscreenExit(video));
        document.addEventListener('webkitfullscreenchange', () => handleFullscreenExit(video));
    }
}

/**
 * Enter fullscreen mode for video (mobile optimized)
 */
function enterVideoFullscreen(video) {
    if (!video) return;

    // Request fullscreen using the appropriate API
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // iOS Safari
    } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // Older iOS
    }
}

/**
 * Handle video state when exiting fullscreen
 */
function handleFullscreenExit(video) {
    // Check if we're NOT in fullscreen anymore
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

    if (!isFullscreen && video) {
        // Reset video to initial state
        video.pause();
        video.currentTime = 0;
        video.load(); // Reload to show poster image
    }
}

/**
 * Open About Me modal and populate content
 */
function openAboutModal() {
    // Prevent multiple simultaneous opens (fixes duplication bug)
    if (modalIsOpen) return;

    const modal = modals.about;
    const modalBioText = modal.querySelector('.modal-bio-text');

    // Completely clear any existing content first
    modalBioText.innerHTML = '';

    // Clone bio paragraphs only (no video)
    const aboutParagraphs = document.querySelectorAll('.about-paragraph');
    aboutParagraphs.forEach(p => {
        const clone = p.cloneNode(true);
        clone.style.display = 'block'; // Override inline display
        clone.style.webkitLineClamp = 'unset';
        clone.style.webkitBoxOrient = 'unset';
        clone.style.overflow = 'visible';
        modalBioText.appendChild(clone);
    });

    // Open modal
    openModal(modal);
}

/**
 * Timeline Modal Setup
 */
function initTimelineModals() {
    const timelineItems = document.querySelectorAll('.timeline-content');

    timelineItems.forEach((item, index) => {
        // Make timeline cards tappable
        item.style.cursor = 'pointer';

        item.addEventListener('click', () => {
            openTimelineModal(item);
        });
    });
}

/**
 * Open Timeline modal with specific item content
 */
function openTimelineModal(timelineItem) {
    const modal = modals.timeline;
    const modalContent = modal.querySelector('.modal-timeline-content');

    // Clone timeline content
    const clone = timelineItem.cloneNode(true);

    // Remove the "Tap for details" indicator
    const tapIndicator = clone.querySelector('::after');
    if (tapIndicator) {
        clone.style.position = 'relative';
    }

    // Override line-clamp on bullet points
    const ul = clone.querySelector('ul');
    if (ul) {
        ul.style.display = 'block';
        ul.style.webkitLineClamp = 'unset';
        ul.style.webkitBoxOrient = 'unset';
        ul.style.overflow = 'visible';
    }

    modalContent.innerHTML = '';
    modalContent.appendChild(clone);

    // Open modal
    openModal(modal);
}

/**
 * Generic modal open function
 */
function openModal(modal) {
    // Set modal open state
    modalIsOpen = true;

    // Store previously focused element
    previousFocus = document.activeElement;

    // Prevent body scroll (iOS-compatible approach)
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    // Store scroll position for restoration
    modal.dataset.scrollY = scrollY;

    // Show modal
    modal.classList.add('active');

    // Focus first focusable element
    setTimeout(() => {
        const focusable = modal.querySelector('button, a, input');
        if (focusable) focusable.focus();
    }, 300); // Wait for animation

    // Setup swipe-to-close
    setupSwipeToClose(modal);
}

/**
 * Generic modal close function
 */
function closeModal(modal) {
    modal.classList.remove('active');

    // Reset modal open state
    modalIsOpen = false;

    // Restore body scroll and position
    const scrollY = modal.dataset.scrollY || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, parseInt(scrollY));

    // Restore focus
    if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
    }

    // Reset transform
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = '';
}

/**
 * Initialize modal controls (close buttons, overlay clicks, escape key)
 */
function initModalControls() {
    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.fullscreen-modal');
            closeModal(modal);
        });
    });

    // Overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.fullscreen-modal');
            closeModal(modal);
        });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any active modal
            Object.values(modals).forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
}

/**
 * Swipe-to-close gesture support
 * Allows user to swipe down from top to close modal (like iOS)
 *
 * Implementation Strategy:
 * - 100px distance threshold OR fast velocity (iOS-like)
 * - Only works when scrolled to top (prevents scroll conflicts)
 * - 1:1 visual feedback (responsive feel)
 */
function setupSwipeToClose(modal) {
    const modalContent = modal.querySelector('.modal-content');

    let touchStartTime = 0;
    const DISTANCE_THRESHOLD = 100; // 100px minimum swipe distance
    const VELOCITY_THRESHOLD = 0.5; // pixels per millisecond (fast flick)

    // Touch start
    modalContent.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isDragging = true;
    }, { passive: true });

    // Touch move
    modalContent.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        touchCurrentY = e.touches[0].clientY;
        const diff = touchCurrentY - touchStartY;

        // Only allow dragging down when scrolled to top (prevents scroll conflicts)
        if (modalContent.scrollTop === 0 && diff > 0) {
            // 1:1 visual feedback - modal follows finger exactly
            e.preventDefault(); // Prevent scroll bounce
            modalContent.style.transform = `translateY(${diff}px)`;
            modalContent.style.transition = 'none'; // Remove transition during drag
        }
    }, { passive: false }); // passive: false allows preventDefault

    // Touch end
    modalContent.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const diff = touchCurrentY - touchStartY;
        const duration = Date.now() - touchStartTime;
        const velocity = diff / duration; // pixels per millisecond

        // Close threshold: 100px distance OR fast velocity (iOS pattern)
        const shouldClose = diff > DISTANCE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

        if (shouldClose && diff > 0) {
            // Animate modal closing downward
            modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 1, 1)';
            modalContent.style.transform = 'translateY(100%)';

            setTimeout(() => {
                closeModal(modal);
                modalContent.style.transform = ''; // Reset for next open
            }, 300);
        } else {
            // Snap back with smooth animation
            modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            modalContent.style.transform = 'translateY(0)';

            setTimeout(() => {
                modalContent.style.transition = ''; // Remove transition
            }, 300);
        }
    }, { passive: true });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileModals);
} else {
    initMobileModals();
}

// Re-initialize on resize (if switching between mobile/desktop)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Clean up and re-init if needed
        if (window.innerWidth <= 768) {
            initMobileModals();
        }
    }, 250);
});
