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

    // Mobile click-to-fullscreen functionality (same as desktop)
    if (video) {
        // Generate unique storage key for progress saving
        const videoId = video.src || 'about-video-mobile';
        const storageKey = `video-progress-${videoId}`;

        // Restore saved progress on page load
        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress) {
            const savedTime = parseFloat(savedProgress);
            video.currentTime = savedTime;
            console.log(`[Mobile Video Progress] Restored saved position: ${savedTime.toFixed(2)}s`);
        }

        // Save progress as video plays (debounced)
        let saveTimeout;
        video.addEventListener('timeupdate', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (video.duration - video.currentTime > 2) {
                    localStorage.setItem(storageKey, video.currentTime.toString());
                }
            }, 1000);
        });

        // Clear saved progress when video ends
        video.addEventListener('ended', () => {
            localStorage.removeItem(storageKey);
            console.log('[Mobile Video Progress] Video completed - cleared saved progress');
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

            console.log('[Mobile Fullscreen] User clicked video - entering fullscreen mode');
        });

        // Prevent default play behavior on click
        video.addEventListener('play', (e) => {
            const isFullscreen = document.fullscreenElement === video ||
                               document.webkitFullscreenElement === video ||
                               document.mozFullScreenElement === video;

            if (!isFullscreen) {
                e.preventDefault();
                video.pause();
                console.log('[Mobile Fullscreen] Prevented inline play - use fullscreen only');
            }
        });

        // Listen for all fullscreen change events
        document.addEventListener('fullscreenchange', () => handleFullscreenChange(video));
        document.addEventListener('webkitfullscreenchange', () => handleFullscreenChange(video));
        document.addEventListener('mozfullscreenchange', () => handleFullscreenChange(video));
        document.addEventListener('MSFullscreenChange', () => handleFullscreenChange(video));
    }
}

/**
 * Handle video state and styling when entering/exiting fullscreen
 * Enhanced with !important flags and proper timing for maximum browser compatibility
 */
function handleFullscreenChange(video) {
    // Check if we're in fullscreen mode
    const fullscreenElement = document.fullscreenElement ||
                             document.webkitFullscreenElement ||
                             document.mozFullScreenElement ||
                             document.msFullscreenElement;

    console.log('[Fullscreen Debug] Change detected:', {
        fullscreenElement: fullscreenElement,
        fullscreenElementTag: fullscreenElement?.tagName,
        videoElement: video,
        isVideoFullscreen: fullscreenElement === video
    });

    if (fullscreenElement && fullscreenElement.tagName === 'VIDEO') {
        // Entering fullscreen - apply styles with maximum priority using !important
        const fullscreenVideo = fullscreenElement;

        // Use requestAnimationFrame to ensure timing after fullscreen transition completes
        requestAnimationFrame(() => {
            // setProperty with 'important' flag gives highest CSS priority (beats all other rules)
            fullscreenVideo.style.setProperty('object-fit', 'contain', 'important');
            fullscreenVideo.style.setProperty('object-position', 'center center', 'important');

            // Force aspect ratio preservation with letterboxing
            fullscreenVideo.style.setProperty('max-width', '100vw', 'important');
            fullscreenVideo.style.setProperty('max-height', '100vh', 'important');
            fullscreenVideo.style.setProperty('width', 'auto', 'important');
            fullscreenVideo.style.setProperty('height', 'auto', 'important');

            // Center the video in fullscreen viewport
            fullscreenVideo.style.setProperty('position', 'absolute', 'important');
            fullscreenVideo.style.setProperty('top', '50%', 'important');
            fullscreenVideo.style.setProperty('left', '50%', 'important');
            fullscreenVideo.style.setProperty('transform', 'translate(-50%, -50%)', 'important');

            // Black background for letterboxing
            fullscreenVideo.style.setProperty('background-color', '#000', 'important');

            // Force repaint to ensure styles take effect immediately
            void fullscreenVideo.offsetHeight; // Trigger reflow

            // Auto-play video in fullscreen with controls
            fullscreenVideo.controls = true;
            fullscreenVideo.play().catch(err => {
                console.warn('[Mobile Fullscreen] Auto-play blocked:', err);
            });

            // Debug: verify applied styles
            const computed = getComputedStyle(fullscreenVideo);
            console.log('[Mobile Fullscreen Debug] Applied contain styling with letterboxing:', {
                objectFit: computed.objectFit,
                objectPosition: computed.objectPosition,
                width: computed.width,
                height: computed.height,
                position: computed.position
            });
        });
    } else if (!fullscreenElement && video) {
        // Exiting fullscreen - keep progress saved, don't reset
        console.log('[Mobile Fullscreen] Exiting fullscreen mode - preserving progress');

        // Pause video but DON'T reset currentTime (progress saved in localStorage)
        video.pause();
        video.controls = false; // Remove controls when exiting fullscreen

        // Note: We don't call video.load() or reset currentTime
        // Progress is preserved in localStorage and will resume on next click

        // Remove inline styles to let CSS take over (collapsed card state)
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

        console.log('[Mobile Fullscreen] Progress saved at', video.currentTime.toFixed(2) + 's');
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

    // Restore body scroll and position to where user was before opening modal
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

    // Navigation link handlers (home button and nav links)
    initNavigationHandlers();
}

/**
 * Initialize navigation handlers for navbar links
 * Handles home button and nav links when modals are open
 */
function initNavigationHandlers() {
    // Helper function to check if any modal is open
    const isAnyModalOpen = () => {
        return Object.values(modals).some(modal => modal.classList.contains('active'));
    };

    // Helper function to get the currently open modal
    const getOpenModal = () => {
        return Object.values(modals).find(modal => modal.classList.contains('active'));
    };

    // Helper to check if Dobby chat is open
    const isChatOpen = () => {
        const chatCard = document.getElementById('ai-chat-card');
        return chatCard && chatCard.classList.contains('expanded');
    };

    // Home button handler
    const navHomeButton = document.querySelector('.home-link');
    if (navHomeButton) {
        navHomeButton.addEventListener('click', function(e) {
            // Only handle if a fullscreen modal is open AND chat is not open
            if (isAnyModalOpen() && !isChatOpen()) {
                e.preventDefault();
                const openModal = getOpenModal();
                closeModal(openModal); // Close and keep user at same scroll position
            }
            // If chat is open or no modal is open, let chatbot.js or default behavior handle it
        });
    }

    // Navigation links handler (About, Experience, Gallery, Contact)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle if a fullscreen modal is open AND chat is not open
            if (isAnyModalOpen() && !isChatOpen()) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const openModal = getOpenModal();

                // Close modal first
                closeModal(openModal);

                // After modal closes, scroll to target section
                setTimeout(() => {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
            // If chat is open or no modal is open, let chatbot.js or default behavior handle it
        });
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
