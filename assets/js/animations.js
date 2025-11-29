// Loading Animation
class LoadingAnimation {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingTitle = document.querySelector('.loading-title');
        this.init();
    }

    init() {
        // Check if we're on the index page and loading screen exists
        const isIndexPage = window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname === '';

        // Check if this is a navigation from another page in the same session
        const isInternalNavigation = sessionStorage.getItem('navigatedFromPage');

        if (isIndexPage && this.loadingScreen && !isInternalNavigation) {
            logger.log('Starting loading sequence - fresh visit or page refresh');
            document.body.classList.add('loading');
            this.startLoadingSequence();
        } else {
            logger.log('Skipping loading sequence - internal navigation detected');
            this.skipLoading();
        }

        // Clear the navigation flag after checking
        sessionStorage.removeItem('navigatedFromPage');
    }

    startLoadingSequence() {
        logger.log('Loading sequence started');

        // Ensure loading screen is visible
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }

        // After loading completes, start transition
        setTimeout(() => {
            logger.log('Loading complete, starting transition');
            this.finishLoading();
        }, 1400); // 1.4 seconds total
    }

    finishLoading() {
        logger.log('Finishing loading');

        // Shrink title
        if (this.loadingTitle) {
            this.loadingTitle.classList.add('shrink');
        }

        // Start main content transition
        setTimeout(() => {
            logger.log('Showing main content');
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');

            // Hide loading screen
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');

                // Remove loading screen from DOM after transition
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 1000);
            }

            // Trigger hero animations
            this.triggerHeroAnimations();
        }, 1000);
    }

    skipLoading() {
        logger.log('Skipping loading');

        // Hide loading screen immediately
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }

        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        // Trigger hero animations immediately
        this.triggerHeroAnimations();
    }

    triggerHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease-out';
        }
    }

    // Method to reset navigation flag (for testing)
    resetNavigation() {
        sessionStorage.removeItem('navigatedFromPage');
        logger.log('Navigation flag reset');
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );

            // Observe elements that should animate on scroll
            const animateElements = document.querySelectorAll(
                '.overview-card, .project-card, .blog-card, .achievement-item, .timeline-item'
            );

            animateElements.forEach(el => {
                this.observer.observe(el);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Particle Background Enhancement
class ParticleBackground {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;

        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -3;
            opacity: 0.3;
        `;

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(74, 158, 255, ${particle.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}
