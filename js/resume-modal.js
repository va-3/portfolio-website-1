// ===================================
// Resume Modal JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const resumeIframe = document.getElementById('resume-iframe');
    const resumeModal = document.getElementById('resume-modal');

    // Open modal when PDF is clicked
    if (resumeIframe) {
        resumeIframe.addEventListener('click', function() {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal when clicking on backdrop (dark background)
    if (resumeModal) {
        resumeModal.addEventListener('click', function(e) {
            // Only close if clicking directly on the modal backdrop, not the content
            if (e.target === resumeModal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Helper function to close modal
    function closeModal() {
        resumeModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
});
