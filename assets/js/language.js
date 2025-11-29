// Language Toggle Functionality
class LanguageToggle {
    constructor() {
        this.currentLang = 'en'; // Default to English
        this.langButton = document.getElementById('lang-toggle');
        this.jpElements = document.querySelectorAll('.jp');
        this.enElements = document.querySelectorAll('.en');
        this.typewriters = new Map();

        this.init();
    }

    init() {
        if (this.langButton) {
            this.langButton.addEventListener('click', () => this.toggleLanguage());
        }

        // Load saved language preference first, then set language
        this.loadSavedLanguage();

        // Store original text for both language elements
        this.storeOriginalTexts();
    }

    storeOriginalTexts() {
        const heroIntro = document.querySelector('.hero .intro');
        if (heroIntro) {
            const jpElement = heroIntro.querySelector('.jp');
            const enElement = heroIntro.querySelector('.en');

            if (jpElement && !jpElement.getAttribute('data-original')) {
                jpElement.setAttribute('data-original', jpElement.textContent);
            }
            if (enElement && !enElement.getAttribute('data-original')) {
                enElement.setAttribute('data-original', enElement.textContent);
            }
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'jp' ? 'en' : 'jp';
        this.setLanguage(this.currentLang);

        // Save language preference
        localStorage.setItem('preferredLanguage', this.currentLang);

        // Restart typewriter for visible intro text
        this.initTypewriterForVisibleIntro();
    }

    setLanguage(lang) {
        // Update body class for CSS-based language switching
        document.body.classList.remove('lang-jp', 'lang-en');
        document.body.classList.add(`lang-${lang}`);

        // Also update individual element styles for compatibility
        if (lang === 'jp') {
            this.jpElements.forEach(el => el.style.display = 'block');
            this.enElements.forEach(el => el.style.display = 'none');
            if (this.langButton) this.langButton.textContent = 'EN';
        } else {
            this.jpElements.forEach(el => el.style.display = 'none');
            this.enElements.forEach(el => el.style.display = 'block');
            if (this.langButton) this.langButton.textContent = 'JP';
        }

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update search input placeholders
        this.updateSearchPlaceholders(lang);

        logger.log('Language set to:', lang);
    }

    initTypewriterForVisibleIntro() {
        const heroIntro = document.querySelector('.hero .intro');
        if (!heroIntro) {
            logger.log('Hero intro element not found');
            return;
        }

        logger.log('Initializing typewriter for language:', this.currentLang);

        // Stop existing typewriters
        this.typewriters.forEach(typewriter => typewriter.stop());
        this.typewriters.clear();

        // Get both language elements
        const jpElement = heroIntro.querySelector('.jp');
        const enElement = heroIntro.querySelector('.en');

        if (!jpElement || !enElement) {
            logger.log('Language elements not found');
            return;
        }

        // Determine which element is currently visible
        const visibleElement = this.currentLang === 'jp' ? jpElement : enElement;

        // Ensure the element is visible
        if (window.getComputedStyle(visibleElement).display === 'none') {
            logger.log('Visible element is actually hidden, forcing visibility');
            this.setLanguage(this.currentLang); // Re-apply language visibility
        }

        if (visibleElement) {
            // Store original text if not already stored
            if (!visibleElement.getAttribute('data-original')) {
                visibleElement.setAttribute('data-original', visibleElement.textContent);
            }

            const originalText = visibleElement.getAttribute('data-original');
            logger.log('Starting typewriter with text:', originalText);

            const typewriter = new TypewriterEffect(visibleElement, [originalText], 80);
            this.typewriters.set(this.currentLang, typewriter);
        } else {
            logger.log('Visible element not found for language:', this.currentLang);
        }
    }

    // Load saved language preference
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'jp' || savedLang === 'en')) {
            this.currentLang = savedLang;
            logger.log('Loaded saved language:', savedLang);
        } else {
            // First time visit or no saved preference - default to EN
            this.currentLang = 'en';
            localStorage.setItem('preferredLanguage', 'en');
            logger.log('No saved language found, defaulting to EN');
        }
        this.setLanguage(this.currentLang);
    }

    // Initialize typewriter for current visible language
    initInitialTypewriter() {
        logger.log('Initializing typewriter for current language:', this.currentLang);

        // Wait a bit longer to ensure all elements are properly set up
        setTimeout(() => {
            // Store original texts again to be safe
            this.storeOriginalTexts();
            // Initialize typewriter
            this.initTypewriterForVisibleIntro();
        }, 200);
    }

    updateSearchPlaceholders(lang) {
        // Update project search placeholder
        const projectSearch = document.getElementById('project-search');
        if (projectSearch) {
            const placeholder = lang === 'jp' ? projectSearch.getAttribute('data-jp') : projectSearch.getAttribute('data-en');
            if (placeholder) {
                projectSearch.placeholder = placeholder;
            }
        }

        // Update blog search placeholder
        const blogSearch = document.getElementById('blog-search');
        if (blogSearch) {
            const placeholder = lang === 'jp' ? blogSearch.getAttribute('data-jp') : blogSearch.getAttribute('data-en');
            if (placeholder) {
                blogSearch.placeholder = placeholder;
            }
        }
    }
}

// Typewriter Effect for Hero Text
class TypewriterEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isActive = true;
        this.originalText = element ? element.textContent : '';

        if (this.element && this.texts.length > 0) {
            this.init();
        }
    }

    init() {
        if (this.element) {
            this.element.textContent = '';
            this.type();
        }
    }

    stop() {
        this.isActive = false;
    }

    type() {
        if (!this.isActive || !this.element) return;

        const currentText = this.texts[this.currentTextIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            if (this.texts.length === 1) {
                // Single text, don't delete
                return;
            }
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before starting new text
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}
