// App Initializer - Centralized initialization for all pages
class AppInitializer {
  static async init() {
    logger.log('AppInitializer: Starting initialization...');

    // Load components first
    await componentLoader.loadAll();
    logger.log('AppInitializer: Components loaded');

    // Initialize core modules
    this.initLanguage();
    this.initLoading();
    this.initFilters();
    this.initAnimations();
    this.initNavigation();

    // Delay stats initialization to ensure DOM elements are ready
    // This is especially important for blog cards which are loaded asynchronously
    setTimeout(() => {
      this.initStats();
    }, 500);

    logger.log('AppInitializer: All modules initialized');
  }

  static initLanguage() {
    if (typeof LanguageToggle !== 'undefined') {
      window.languageToggle = new LanguageToggle();
    }
  }

  static initLoading() {
    if (typeof LoadingAnimation !== 'undefined') {
      window.loadingAnimation = new LoadingAnimation();
    }
  }

  static initFilters() {
    // Initialize blog filter if on blog page
    if (document.querySelector('.blog-grid') && typeof BlogFilter !== 'undefined') {
      window.blogFilter = new BlogFilter();
    }

    // Initialize project filter if on projects page
    if (document.querySelector('.projects-grid') && typeof ProjectFilter !== 'undefined') {
      window.projectFilter = new ProjectFilter();
    }
  }

  static initAnimations() {
    if (typeof SmoothScroll !== 'undefined') {
      window.smoothScroll = new SmoothScroll();
    }

    if (typeof AnimationObserver !== 'undefined') {
      window.animationObserver = new AnimationObserver();
    }

    // Initialize particle background on desktop only
    if (window.innerWidth > 768 && typeof ParticleBackground !== 'undefined') {
      window.particleBackground = new ParticleBackground();
    }
  }

  static initNavigation() {
    if (typeof NavbarScroll !== 'undefined') {
      window.navbarScroll = new NavbarScroll();
    }

    if (typeof MobileMenu !== 'undefined') {
      window.mobileMenu = new MobileMenu();
    }

    if (typeof ThemeManager !== 'undefined') {
      window.themeManager = new ThemeManager();
    }
  }

  static initStats() {
    // Initialize blog likes fetcher
    if (document.querySelector('[data-qiita-id], [data-note-id]') && typeof BlogLikesFetcher !== 'undefined') {
      window.blogLikesFetcher = new BlogLikesFetcher();
    }

    // Initialize GitHub stats
    if (document.querySelector('.github-stats-section') && typeof GitHubStats !== 'undefined') {
      window.gitHubStats = new GitHubStats();
    }

    // Initialize AtCoder stats
    if (document.querySelector('.atcoder-stats-section') && typeof AtCoderStats !== 'undefined') {
      window.atcoderStats = new AtCoderStats();
    }

    // Initialize Kaggle stats
    if (document.querySelector('.kaggle-stats-section') && typeof KaggleStats !== 'undefined') {
      window.kaggleStats = new KaggleStats();
    }
  }
}
