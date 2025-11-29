// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle anchor links within the same page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Navbar Scroll Effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('header');
        this.lastScrollTop = 0;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(74, 158, 255, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }

        this.lastScrollTop = scrollTop;
    }
}

// Mobile Menu Toggle (for very small screens)
class MobileMenu {
    constructor() {
        this.navMenu = document.querySelector('.nav-menu');
        this.createMobileMenuButton();
        this.init();
    }

    createMobileMenuButton() {
        // Only create if screen is very small
        if (window.innerWidth <= 480) {
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.cssText = `
                display: none;
                background: none;
                border: none;
                color: #4a9eff;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
            `;

            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.appendChild(mobileMenuBtn);
                this.mobileMenuBtn = mobileMenuBtn;
            }
        }
    }

    init() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 480 && this.navMenu) {
                this.navMenu.style.display = 'flex';
            }
        });
    }

    toggleMobileMenu() {
        if (this.navMenu) {
            const isVisible = this.navMenu.style.display === 'flex';
            this.navMenu.style.display = isVisible ? 'none' : 'flex';
            this.mobileMenuBtn.innerHTML = isVisible ? '☰' : '✕';
        }
    }
}

// Theme Color Manager
class ThemeManager {
    constructor() {
        this.themes = {
            default: '#4a9eff',
            purple: '#9b59b6',
            green: '#2ecc71',
            orange: '#f39c12'
        };

        this.currentTheme = 'default';
        this.init();
    }

    init() {
        // You can add theme switching functionality here if needed
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        }
    }

    setTheme(themeName) {
        if (this.themes[themeName]) {
            document.documentElement.style.setProperty('--primary-color', this.themes[themeName]);
            this.currentTheme = themeName;
            localStorage.setItem('theme', themeName);
        }
    }
}
