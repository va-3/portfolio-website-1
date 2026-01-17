// ===================================
// Simple PDF Loading Handler
// Shows thumbnail instantly, reveals PDF when ready
// ===================================

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const pdfObject = document.getElementById('resume-iframe');
        const placeholder = document.getElementById('pdf-placeholder');

        if (!pdfObject || !placeholder) {
            console.warn('PDF elements not found');
            return;
        }

        // Handle PDF load completion
        pdfObject.addEventListener('load', function() {
            // Hide placeholder, show PDF
            placeholder.classList.add('hidden');
            pdfObject.classList.add('loaded');
            console.log('PDF loaded and revealed');
        });

        // Fallback: if onload doesn't fire, reveal after timeout
        setTimeout(function() {
            if (!pdfObject.classList.contains('loaded')) {
                placeholder.classList.add('hidden');
                pdfObject.classList.add('loaded');
                console.log('PDF revealed via timeout fallback');
            }
        }, 3000);
    }
})();
