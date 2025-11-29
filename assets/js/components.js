// Component Loader - Loads HTML components dynamically
class ComponentLoader {
    constructor() {
        this.componentsPath = '';
        this.basePath = '';
        this.init();
    }

    init() {
        // Determine the correct path based on current page location
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            this.componentsPath = '../components/';
            this.basePath = '../';
        } else {
            this.componentsPath = 'components/';
            this.basePath = '';
        }
    }

    async loadComponent(componentName, targetSelector) {
        try {
            const response = await fetch(`${this.componentsPath}${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}: ${response.status}`);
            }

            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);

            if (targetElement) {
                targetElement.innerHTML = html;

                // After loading header, fix navigation links
                if (componentName === 'header') {
                    this.fixNavigationLinks();
                }

                return true;
            } else {
                logger.warn(`Target selector "${targetSelector}" not found for ${componentName}`);
                return false;
            }
        } catch (error) {
            logger.error(`Error loading component ${componentName}:`, error);
            return false;
        }
    }

    fixNavigationLinks() {
        const navLinks = document.querySelectorAll('header .nav-link, header .logo a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            // If we're in a subdirectory (pages/), adjust the paths
            if (this.basePath === '../') {
                if (href === 'index.html') {
                    link.setAttribute('href', '../index.html');
                } else if (href.startsWith('pages/')) {
                    // Remove 'pages/' prefix since we're already in pages/
                    link.setAttribute('href', href.replace('pages/', ''));
                }
            }

            // Add click handler to set navigation flag
            link.addEventListener('click', () => {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                sessionStorage.setItem('navigatedFromPage', currentPage);
                logger.log(`Navigation from ${currentPage} to ${href}`);
            });
        });

        this.updateActiveNavLink();
    }

    async loadAll() {
        const components = [
            { name: 'header', selector: '#header-placeholder' },
            { name: 'footer', selector: '#footer-placeholder' },
            { name: 'loading', selector: '#loading-placeholder' }
        ];

        const promises = components.map(comp =>
            this.loadComponent(comp.name, comp.selector)
        );

        await Promise.all(promises);
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href) {
                // Normalize paths for comparison
                const normalizedHref = href.replace('../', '').replace('.html', '');
                const normalizedPath = currentPath.replace('.html', '');

                // Check if current page matches the link
                if (normalizedPath.includes(normalizedHref) ||
                    (normalizedPath.endsWith('/') && normalizedHref === 'index') ||
                    (normalizedPath.endsWith('index') && normalizedHref === 'index')) {
                    link.classList.add('active');
                }
            }
        });
    }
}

// Initialize component loader before other scripts
const componentLoader = new ComponentLoader();
