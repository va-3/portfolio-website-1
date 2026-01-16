/**
 * Theme Management & Dobby Logo Renderer
 * TheraBridge-inspired theme system with localStorage persistence
 */

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.toggle = document.getElementById('theme-toggle');
        this.init();
    }

    getInitialTheme() {
        // Check localStorage first
        const stored = localStorage.getItem('portfolio-theme');
        if (stored) return stored;

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);

        // Add click listener
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        // Update all Dobby logo instances
        if (window.dobbyLogos && window.dobbyLogos.length > 0) {
            window.dobbyLogos.forEach(logo => {
                logo.updateTheme(theme === 'dark');
            });
        }
    }
}

// Dobby Logo Renderer (Vanilla JS)
class DobbyLogo {
    constructor(containerId, size = 50) {
        this.container = document.getElementById(containerId);
        this.size = size;
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (this.container) {
            this.render();
            // Track all instances
            if (!window.dobbyLogos) {
                window.dobbyLogos = [];
            }
            window.dobbyLogos.push(this);
        }
    }

    updateTheme(isDark) {
        this.isDark = isDark;
        this.render();
    }

    render() {
        const mainColor = this.isDark ? '#B794D4' : '#5AB9B4';
        const pupilColor = this.isDark ? '#1a1625' : '#1a1a1a';

        this.container.innerHTML = `
            <svg
                width="${this.size}"
                height="${this.size}"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="transition: all 0.3s ease;"
                onmouseenter="this.classList.add('hovering')"
                onmouseleave="this.classList.remove('hovering')"
            >
                <!-- Left Ear -->
                <polygon
                    class="ear-left"
                    points="15,55 35,35 35,65"
                    fill="${mainColor}"
                    style="transform-origin: 35px 50px; transition: transform 0.4s ease;"
                />

                <!-- Right Ear -->
                <polygon
                    class="ear-right"
                    points="105,55 85,35 85,65"
                    fill="${mainColor}"
                    style="transform-origin: 85px 50px; transition: transform 0.4s ease;"
                />

                <!-- Head -->
                <rect
                    x="30"
                    y="30"
                    width="60"
                    height="60"
                    rx="14"
                    fill="${mainColor}"
                />

                <!-- Left Eye White -->
                <circle cx="45" cy="55" r="8" fill="white" />
                <!-- Left Pupil -->
                <circle cx="45" cy="57" r="4" fill="${pupilColor}" />
                <!-- Left Highlight -->
                <circle cx="47" cy="54" r="1.5" fill="white" />

                <!-- Right Eye White -->
                <circle cx="75" cy="55" r="8" fill="white" />
                <!-- Right Pupil -->
                <circle cx="75" cy="57" r="4" fill="${pupilColor}" />
                <!-- Right Highlight -->
                <circle cx="77" cy="54" r="1.5" fill="white" />

                <!-- Smile -->
                <path
                    d="M48 74 Q60 82 72 74"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    fill="none"
                />
            </svg>
        `;

        // Add hover effects
        const svg = this.container.querySelector('svg');
        if (svg) {
            const leftEar = svg.querySelector('.ear-left');
            const rightEar = svg.querySelector('.ear-right');

            svg.addEventListener('mouseenter', () => {
                if (leftEar) leftEar.style.transform = 'rotate(-10deg)';
                if (rightEar) rightEar.style.transform = 'rotate(10deg)';
            });

            svg.addEventListener('mouseleave', () => {
                if (leftEar) leftEar.style.transform = 'rotate(0deg)';
                if (rightEar) rightEar.style.transform = 'rotate(0deg)';
            });
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme and expose globally
    window.themeManager = new ThemeManager();

    // Initialize Dobby logo in hero (if exists - now using card)
    const heroLogo = document.getElementById('dobby-logo');
    if (heroLogo) {
        new DobbyLogo('dobby-logo', 50);
    }
});
