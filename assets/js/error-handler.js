// Error Handler - Global error handling and debugging
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.init();
    }

    init() {
        // Catch all errors
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.message, e.filename, e.lineno);
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Promise Rejection', e.reason);
        });

        // Log page load
        logger.log('%c Portfolio Site Loaded', 'color: #4a9eff; font-size: 16px; font-weight: bold');
        logger.log('Current path:', window.location.pathname);
        logger.log('Is in pages directory:', window.location.pathname.includes('/pages/'));
    }

    logError(type, message, file = '', line = '') {
        const error = {
            type,
            message,
            file,
            line,
            timestamp: new Date().toISOString()
        };

        this.errors.push(error);

        logger.error(`%c ${type}:`, 'color: #e74c3c; font-weight: bold', message);
        if (file) logger.error('File:', file, 'Line:', line);

        // Show user-friendly error message
        this.showErrorNotification(type, message);
    }

    showErrorNotification(type, message) {
        // Only show critical errors to users
        if (type === 'JavaScript Error' || type === 'Promise Rejection') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
            `;
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">⚠️ ${type}</div>
                <div style="font-size: 14px;">${message}</div>
                <div style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
                    Check the browser console for details
                </div>
            `;

            document.body.appendChild(notification);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
        }
    }

    getErrors() {
        return this.errors;
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Debug helper - add to window for easy access
window.debugPortfolio = function() {
    logger.log('%c=== Portfolio Debug Info ===', 'color: #4a9eff; font-size: 14px; font-weight: bold');
    logger.log('Path:', window.location.pathname);
    logger.log('In pages dir:', window.location.pathname.includes('/pages/'));
    logger.log('Component loader initialized:', typeof componentLoader !== 'undefined');
    logger.log('Errors:', errorHandler.getErrors());

    // Check loaded resources
    const resources = performance.getEntriesByType('resource');
    const cssFiles = resources.filter(r => r.name.includes('.css'));
    const jsFiles = resources.filter(r => r.name.includes('.js'));

    logger.log('CSS files loaded:', cssFiles.length);
    cssFiles.forEach(f => logger.log('  ✓', f.name));

    logger.log('JS files loaded:', jsFiles.length);
    jsFiles.forEach(f => logger.log('  ✓', f.name));

    // Check if components are loaded
    logger.log('Header loaded:', !!document.querySelector('header nav'));
    logger.log('Footer loaded:', !!document.querySelector('footer'));
    logger.log('Stars loaded:', !!document.querySelector('.stars'));

    logger.log('%c Run window.debugPortfolio() to see this info again', 'color: #999; font-style: italic');
};

logger.log('%c 💡 Tip: Run window.debugPortfolio() to see debug information', 'color: #4a9eff; font-style: italic');
