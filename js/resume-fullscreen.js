/**
 * Resume Fullscreen Modal
 * Handles click-to-fullscreen functionality for resume preview
 */

(function() {
    // Get DOM elements
    const modal = document.getElementById('resume-fullscreen-modal');
    const resumePreviewContainer = document.querySelector('.resume-preview-container');
    const overlay = document.querySelector('.resume-modal-overlay');
    const container = document.querySelector('.resume-modal-container');
    const downloadBtnPreview = document.querySelector('.resume-preview-container .resume-download-btn');
    const downloadBtnModal = document.querySelector('.resume-modal-download-btn');

    if (!modal || !resumePreviewContainer) {
        console.warn('Resume fullscreen modal elements not found');
        return;
    }

    /**
     * Opens the fullscreen resume modal
     */
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    /**
     * Closes the fullscreen resume modal
     */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Click on resume preview (except download button) → open fullscreen
    resumePreviewContainer.addEventListener('click', function(e) {
        // Don't open modal if clicking the download button
        if (e.target.closest('.resume-download-btn')) {
            return;
        }
        openModal();
    });

    // Click grey overlay (old overlay element) → close modal
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Click grey background (container, but not PDF wrapper) → close modal
    if (container) {
        container.addEventListener('click', function(e) {
            // Only close if clicking the grey background, not the PDF wrapper or its children
            if (e.target === container) {
                closeModal();
            }
        });
    }

    // ESC key → close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent modal download button from closing modal
    if (downloadBtnModal) {
        downloadBtnModal.addEventListener('click', function(e) {
            // Let the download happen, but don't propagate to overlay
            e.stopPropagation();
        });
    }

    // Prevent preview download button from opening modal
    if (downloadBtnPreview) {
        downloadBtnPreview.addEventListener('click', function(e) {
            // Let the download happen, but don't propagate to container
            e.stopPropagation();
        });
    }

})();
