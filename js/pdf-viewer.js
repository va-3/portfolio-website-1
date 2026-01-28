/**
 * PDF Viewer using PDF.js
 * Handles responsive PDF rendering with mobile optimization and high-DPI support
 *
 * Features:
 * - Lazy loading (PDF.js loaded only when needed)
 * - Responsive viewport scaling
 * - High-DPI/Retina display support
 * - Multi-page navigation
 * - Touch-optimized controls
 */

(function() {
    // PDF.js state
    let pdfjsLib = null;
    let pdfDocument = null;
    let isInitialized = false;

    // Viewer state
    const state = {
        currentPage: 1,
        totalPages: 0,
        zoom: 1.0,
        isRendering: false
    };

    // DOM elements (will be initialized when modal opens)
    let canvas = null;
    let context = null;
    let canvasContainer = null;
    let pageNumDisplay = null;
    let pageCountDisplay = null;
    let prevButton = null;
    let nextButton = null;

    // iOS Safari detection
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    /**
     * Lazy load PDF.js library from CDN
     * Only loads when user first opens the resume modal
     */
    async function loadPDFJS() {
        if (pdfjsLib) return pdfjsLib;

        try {
            // Load PDF.js from CDN using newer version with better compatibility
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });

            // Access PDF.js from global scope
            pdfjsLib = window.pdfjsLib;

            if (!pdfjsLib) {
                throw new Error('PDF.js library not found in global scope');
            }

            // Set worker source (version-matched for reliability)
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            console.log('PDF.js loaded successfully');
            return pdfjsLib;
        } catch (error) {
            console.error('Failed to load PDF.js:', error);
            throw new Error('PDF viewer failed to initialize');
        }
    }

    /**
     * Initialize PDF viewer
     * Called once when modal first opens
     */
    async function initializePDFViewer() {
        if (isInitialized) {
            console.log('PDF viewer already initialized');
            return;
        }

        console.log('Initializing PDF viewer...');

        try {
            // Load PDF.js library
            console.log('Loading PDF.js library...');
            await loadPDFJS();
            console.log('PDF.js library loaded');

            // Get DOM elements
            canvas = document.getElementById('pdf-canvas');
            context = canvas.getContext('2d');
            canvasContainer = document.querySelector('.pdf-canvas-container');
            pageNumDisplay = document.getElementById('page-num');
            pageCountDisplay = document.getElementById('page-count');
            prevButton = document.getElementById('pdf-prev');
            nextButton = document.getElementById('pdf-next');

            if (!canvas || !context) {
                throw new Error('PDF canvas not found');
            }

            console.log('DOM elements found, loading PDF document...');

            // Load the PDF document
            const loadingTask = pdfjsLib.getDocument('images/vishnu-a-resume.pdf');
            pdfDocument = await loadingTask.promise;

            console.log('PDF document loaded, total pages:', pdfDocument.numPages);

            state.totalPages = pdfDocument.numPages;
            state.currentPage = 1;

            // Update UI
            if (pageCountDisplay) {
                pageCountDisplay.textContent = state.totalPages;
            }

            // Set up navigation controls
            setupNavigationControls();

            // Render first page
            console.log('Rendering first page...');
            await renderPage(state.currentPage);

            // Handle window resize for responsive rendering
            window.addEventListener('resize', debounce(handleResize, 300));

            isInitialized = true;
            console.log('PDF viewer initialized successfully');
        } catch (error) {
            console.error('Error initializing PDF viewer:', error);
            console.error('Error details:', error.message, error.stack);
            showErrorMessage('Failed to load PDF. Please try downloading instead.');
        }
    }

    /**
     * Clean up canvas memory (iOS Safari compatibility)
     * Safari hoards canvas memory - this forces release before new render
     */
    function cleanupCanvas() {
        if (canvas && context) {
            // Shrink canvas to 1x1 to release memory
            canvas.width = 1;
            canvas.height = 1;
            context.clearRect(0, 0, 1, 1);
        }
    }

    /**
     * Render a specific page with responsive viewport and high-DPI support
     */
    async function renderPage(pageNumber) {
        if (!pdfDocument || state.isRendering) return;

        state.isRendering = true;
        updateNavigationButtons();

        try {
            // Clean up canvas before rendering (iOS Safari memory management)
            cleanupCanvas();

            // Get the page
            const page = await pdfDocument.getPage(pageNumber);

            // Calculate responsive viewport
            // Wait a frame to ensure container has proper dimensions after modal opens
            await new Promise(resolve => requestAnimationFrame(resolve));

            const containerWidth = canvasContainer ? canvasContainer.clientWidth : window.innerWidth * 0.9;
            const containerHeight = canvasContainer ? canvasContainer.clientHeight : window.innerHeight * 0.8;

            console.log('Container dimensions:', { containerWidth, containerHeight });

            // Get page viewport at scale 1.0 first
            const viewport = page.getViewport({ scale: 1.0 });

            // Calculate scale to fit container while maintaining aspect ratio
            const scaleX = containerWidth / viewport.width;
            const scaleY = containerHeight / viewport.height;
            const scale = Math.min(scaleX, scaleY) * state.zoom;

            // Get final viewport with calculated scale
            const scaledViewport = page.getViewport({ scale: scale });

            // High-DPI/Retina display support with iOS Safari limits
            // iOS has 384 MB canvas memory limit - cap at 2x to prevent crashes
            let outputScale = window.devicePixelRatio || 1;
            if (isIOSSafari && outputScale > 2) {
                outputScale = 2; // Cap at 2x for iOS to stay under memory limit
                console.log('iOS detected: capping devicePixelRatio at 2x');
            }

            // Set canvas dimensions (pixel perfect for high-DPI)
            canvas.width = Math.floor(scaledViewport.width * outputScale);
            canvas.height = Math.floor(scaledViewport.height * outputScale);

            // Set CSS dimensions to viewport size
            canvas.style.width = Math.floor(scaledViewport.width) + 'px';
            canvas.style.height = Math.floor(scaledViewport.height) + 'px';

            // Apply high-DPI transform
            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            // Render the page
            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport,
                transform: transform
            };

            await page.render(renderContext).promise;

            // Update current page display
            state.currentPage = pageNumber;
            if (pageNumDisplay) {
                pageNumDisplay.textContent = pageNumber;
            }

            state.isRendering = false;
            updateNavigationButtons();
        } catch (error) {
            console.error('Error rendering page:', error);
            state.isRendering = false;
            updateNavigationButtons();
        }
    }

    /**
     * Set up navigation controls (prev/next buttons, keyboard)
     */
    function setupNavigationControls() {
        // Previous page button
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (state.currentPage > 1) {
                    renderPage(state.currentPage - 1);
                }
            });
        }

        // Next page button
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (state.currentPage < state.totalPages) {
                    renderPage(state.currentPage + 1);
                }
            });
        }

        // Keyboard navigation (when modal is active)
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboardNavigation(e) {
        const modal = document.getElementById('resume-fullscreen-modal');
        if (!modal || !modal.classList.contains('active')) return;

        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                if (state.currentPage > 1) {
                    renderPage(state.currentPage - 1);
                }
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
                if (state.currentPage < state.totalPages) {
                    e.preventDefault(); // Prevent page scroll
                    renderPage(state.currentPage + 1);
                }
                break;
            case 'Home':
                renderPage(1);
                break;
            case 'End':
                renderPage(state.totalPages);
                break;
        }
    }

    /**
     * Update navigation button states
     */
    function updateNavigationButtons() {
        if (prevButton) {
            prevButton.disabled = state.currentPage <= 1 || state.isRendering;
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        }

        if (nextButton) {
            nextButton.disabled = state.currentPage >= state.totalPages || state.isRendering;
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        }
    }

    /**
     * Handle window resize - re-render current page
     */
    function handleResize() {
        if (pdfDocument && state.currentPage) {
            renderPage(state.currentPage);
        }
    }

    /**
     * Show error message to user
     */
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'pdf-error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 59, 48, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            font-size: 16px;
            text-align: center;
            z-index: 10000;
        `;

        if (canvasContainer) {
            canvasContainer.appendChild(errorDiv);
        }
    }

    /**
     * Debounce utility for resize events
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Public API - Initialize viewer when modal opens
     */
    window.PDFViewer = {
        init: initializePDFViewer,
        renderPage: renderPage,
        nextPage: () => renderPage(state.currentPage + 1),
        prevPage: () => renderPage(state.currentPage - 1),
        getCurrentPage: () => state.currentPage,
        getTotalPages: () => state.totalPages
    };

})();
