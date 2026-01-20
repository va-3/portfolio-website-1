/**
 * Desktop Fullscreen Video Handler (2026)
 * Ensures video uses object-fit: contain when fullscreen
 * Only runs on desktop viewports (> 768px) - mobile handled by mobile-modals.js
 */

(function() {
    'use strict';

    // Only run on desktop
    if (window.innerWidth <= 768) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const video = document.querySelector('.video-container video');
        if (!video) {
            console.warn('Video element not found for fullscreen handler');
            return;
        }

        console.log('Desktop fullscreen video handler initialized');

        // Listen for all fullscreen change events (cross-browser)
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    /**
     * Handle video styling when entering/exiting fullscreen
     * Uses inline styles with highest specificity to override any CSS
     */
    function handleFullscreenChange() {
        // Check if we're in fullscreen mode (cross-browser)
        const fullscreenElement = document.fullscreenElement ||
                                 document.webkitFullscreenElement ||
                                 document.mozFullScreenElement ||
                                 document.msFullscreenElement;

        if (fullscreenElement && fullscreenElement.tagName === 'VIDEO') {
            // Entering fullscreen - force contain to prevent zoom/crop
            console.log('Desktop fullscreen entered: Applying contain styles');

            // Use requestAnimationFrame for reliable style application
            requestAnimationFrame(() => {
                fullscreenElement.style.objectFit = 'contain';
                fullscreenElement.style.objectPosition = 'center';
                fullscreenElement.style.width = '100%';
                fullscreenElement.style.height = '100%';
                fullscreenElement.style.maxHeight = 'none';
                fullscreenElement.style.backgroundColor = '#000';

                console.log('Fullscreen video styles applied:', {
                    objectFit: fullscreenElement.style.objectFit,
                    width: fullscreenElement.style.width,
                    height: fullscreenElement.style.height
                });
            });
        } else if (!fullscreenElement) {
            // Exiting fullscreen - remove inline styles to restore normal state
            const video = document.querySelector('.video-container video');
            if (video) {
                console.log('Desktop fullscreen exited: Restoring normal state');
                video.style.objectFit = '';
                video.style.objectPosition = '';
                video.style.width = '';
                video.style.height = '';
                video.style.maxHeight = '';
                video.style.backgroundColor = '';
            }
        }
    }
})();
