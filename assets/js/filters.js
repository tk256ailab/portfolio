// Base Filter Class - Common functionality for BlogFilter and ProjectFilter
class BaseFilter {
  constructor(config) {
    this.grid = document.querySelector(config.gridSelector);
    this.searchInput = document.getElementById(config.searchInputId);
    this.tagFiltersContainer = document.getElementById(config.tagFiltersId);
    this.tagFilterButtons = [];
    this.currentTagFilter = 'all';
    this.currentSearchTerm = '';
    this.allItems = [];
    this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    this.dataUrl = config.dataUrl;
    this.tagColorMap = config.tagColorMap || {};
  }

  async loadData() {
    try {
      const response = await fetch(`${this.basePath}${this.dataUrl}`);
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }
      const data = await response.json();

      // Add basePath to image paths
      this.allItems = data.map(item => ({
        ...item,
        image: item.image ? `${this.basePath}${item.image}` : null
      }));

      this.init();
    } catch (error) {
      logger.error('Error loading data:', error);
      this.allItems = [];
      this.init();
    }
  }

  init() {
    this.render();
    this.generateTagFilters();
    this.bindEvents();
    this.applyTagColors();
  }

  getFilteredItems() {
    return this.allItems.filter(item => {
      const matchesTag = this.currentTagFilter === 'all' ||
                        (item.tags && item.tags.some(tag => tag.toLowerCase() === this.currentTagFilter));
      const matchesSearch = this.currentSearchTerm === '' ||
                           item.title.toLowerCase().includes(this.currentSearchTerm) ||
                           item.description.toLowerCase().includes(this.currentSearchTerm) ||
                           (item.tags && item.tags.some(tag => tag.toLowerCase().includes(this.currentSearchTerm)));

      return matchesTag && matchesSearch;
    });
  }

  generateTagFilters() {
    const tagMap = new Map();

    // Count occurrences of each tag
    this.allItems.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (!tagMap.has(lowerTag)) {
            tagMap.set(lowerTag, { original: tag, count: 0 });
          }
          tagMap.get(lowerTag).count++;
        });
      }
    });

    // Update "All" button with total count
    const allButton = this.tagFiltersContainer.querySelector('[data-tag="all"]');
    if (allButton) {
      const totalCount = this.allItems.length;
      allButton.innerHTML = `<span class="jp">すべて (${totalCount})</span><span class="en" style="display: none;">All (${totalCount})</span>`;
    }

    // Generate tag filter buttons with counts
    tagMap.forEach((data, lowerTag) => {
      const button = document.createElement('button');
      button.className = 'tag-filter-btn';
      button.setAttribute('data-tag', lowerTag);
      button.innerHTML = `<span class="jp">${data.original} (${data.count})</span><span class="en" style="display: none;">${data.original} (${data.count})</span>`;
      this.tagFiltersContainer.appendChild(button);
      this.tagFilterButtons.push(button);
    });
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.currentSearchTerm = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    if (this.tagFiltersContainer) {
      this.tagFiltersContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target.closest('.tag-filter-btn');
        if (target) {
          const tag = target.getAttribute('data-tag');
          if (tag && tag !== '') {
            this.setTagFilter(tag);
            this.updateActiveTagButton(target);
          }
        }
      });
    }
  }

  setTagFilter(tag) {
    if (tag && tag !== '') {
      this.currentTagFilter = tag;
      this.applyFilters();
    }
  }

  applyFilters() {
    this.render();
    this.applyTagColors();
  }

  updateActiveTagButton(activeButton) {
    if (!activeButton) return;

    this.tagFilterButtons.forEach(button => {
      button.classList.remove('active');
    });
    const allButton = document.querySelector('.tag-filter-btn[data-tag="all"]');
    if (allButton) {
      allButton.classList.remove('active');
    }
    activeButton.classList.add('active');
  }

  applyTagColors() {
    setTimeout(() => {
      const cards = document.querySelectorAll(this.cardSelector);
      cards.forEach(card => {
        const tags = card.querySelectorAll('.project-tag');
        tags.forEach(tag => {
          const tagText = tag.textContent.toLowerCase();
          if (this.tagColorMap[tagText]) {
            tag.classList.add(this.tagColorMap[tagText]);
          }
        });
      });
    }, 100);
  }

  // Must be implemented by subclasses
  render() {
    throw new Error('render() must be implemented by subclass');
  }
}

// Blog Filter Functionality
class BlogFilter extends BaseFilter {
  constructor() {
    super({
      gridSelector: '.blog-grid',
      searchInputId: 'blog-search',
      tagFiltersId: 'blog-tag-filters',
      dataUrl: 'data/blogs.json',
      tagColorMap: {
        'ai': 'tag-ai',
        'machine learning': 'tag-ml',
        'deep learning': 'tag-deep-learning',
        'tensorflow': 'tag-tensorflow',
        'blender': 'tag-blender',
        '3d modeling': 'tag-3d-modeling',
        'vrm': 'tag-vrm',
        'character design': 'tag-character-design',
        'tool development': 'tag-tool-development',
        'python': 'tag-python',
        'animation': 'tag-animation',
        'react': 'tag-react',
        'javascript': 'tag-javascript',
        'web development': 'tag-web-dev',
        'frontend': 'tag-frontend',
        'node.js': 'tag-nodejs',
        'rest api': 'tag-rest-api',
        'backend': 'tag-backend',
        'express.js': 'tag-expressjs',
        'algorithm': 'tag-algorithm',
        'data structures': 'tag-data-structures',
        'dynamic programming': 'tag-dynamic-programming',
        'graph theory': 'tag-graph-theory',
        'computer science': 'tag-computer-science',
        'nlp': 'tag-nlp',
        'transformer': 'tag-transformer',
        'unity': 'tag-unity',
        'aituber': 'tag-aituber',
        'software development': 'tag-software-dev'
      }
    });

    this.cardSelector = '.blog-card';

    if (this.grid && this.tagFiltersContainer) {
      this.loadData();
    }
  }

  render() {
    if (!this.grid) return;

    const filteredBlogs = this.getFilteredItems();

    this.grid.innerHTML = filteredBlogs.map(blog => {
      const platformIcon = blog.platform === 'note' ? 'fa-sticky-note' : 'fa-pen-square';
      const platformName = blog.platform === 'note' ? 'note' : 'Qiita';
      const dataAttr = blog.noteId ? `data-note-id="${blog.noteId}"` :
                      blog.qiitaId ? `data-qiita-id="${blog.qiitaId}"` : '';

      return `
        <article class="blog-card" data-category="${blog.category}" ${dataAttr}>
          ${blog.image ? `
          <div class="blog-image">
            <img src="${blog.image}" alt="${blog.title}" loading="lazy">
          </div>` : ''}
          <div class="blog-info">
            <div class="blog-meta-top">
              <span class="blog-date">${blog.date}</span>
              ${blog.platform ? `
              <div class="blog-likes" data-platform="${blog.platform}">
                <i class="fas fa-heart"></i>
                <span class="likes-count">--</span>
              </div>` : ''}
            </div>
            <h3>
              <span class="jp">${blog.title}</span>
              <span class="en" style="display: none;">${blog.titleEn}</span>
            </h3>
            <p>
              <span class="jp">${blog.description}</span>
              <span class="en" style="display: none;">${blog.descriptionEn}</span>
            </p>
            <div class="project-tags">
              ${blog.tags ? blog.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('') : ''}
            </div>
            <div class="blog-links">
              <a href="${blog.url}" target="_blank" rel="noopener noreferrer" class="blog-link">
                <i class="fas ${platformIcon}"></i>
                <span class="jp">${platformName}で読む</span>
                <span class="en" style="display: none;">Read on ${platformName}</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Fetch blog likes after rendering
    if (typeof BlogLikesFetcher !== 'undefined' && window.blogLikesFetcher) {
      window.blogLikesFetcher.fetchAllLikes();
    }
  }
}

// Project Filter Functionality
class ProjectFilter extends BaseFilter {
  constructor() {
    super({
      gridSelector: '.projects-grid',
      searchInputId: 'project-search',
      tagFiltersId: 'project-tag-filters',
      dataUrl: 'data/projects.json',
      tagColorMap: {
        'python': 'tag-python',
        'javascript': 'tag-javascript',
        'react': 'tag-react',
        'node.js': 'tag-nodejs',
        'three.js': 'tag-threejs',
        'webgl': 'tag-webgl',
        'vrm': 'tag-vrm',
        'animation': 'tag-animation',
        'machine learning': 'tag-ml',
        'data science': 'tag-datascience',
        'kaggle': 'tag-kaggle',
        'openai api': 'tag-openai',
        'fastapi': 'tag-fastapi',
        'ai': 'tag-ai'
      }
    });

    this.cardSelector = '.project-card';

    if (this.grid && this.tagFiltersContainer) {
      this.loadData();
    }
  }

  render() {
    if (!this.grid) return;

    const filteredProjects = this.getFilteredItems();

    this.grid.innerHTML = filteredProjects.map(project => `
      <div class="project-card" data-category="${project.category}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.src='${this.basePath}assets/images/placeholder-project.jpg'">
        </div>
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">
              <span class="jp">${project.title}</span>
              <span class="en" style="display: none;">${project.titleEn}</span>
            </h3>
            ${project.github ? `<div class="project-stats">
              <div class="star-count" data-repo="${project.github.replace('https://github.com/', '')}">
                <i class="fas fa-star"></i>
                <span class="star-number">--</span>
              </div>
            </div>` : ''}
          </div>
          <p class="project-description">
            <span class="jp">${project.description}</span>
            <span class="en" style="display: none;">${project.descriptionEn}</span>
          </p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
              <i class="fab fa-github"></i>
              <span class="jp">ソースコード</span>
              <span class="en" style="display: none;">Source Code</span>
            </a>` : ''}
            ${project.demo && project.demo !== '#' ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link">
              <i class="fas fa-external-link-alt"></i>
              <span class="jp">デモ</span>
              <span class="en" style="display: none;">Demo</span>
            </a>` : ''}
            ${project.demo === '#' ? `<a href="${project.demo}" class="project-link">
              <span class="jp">🌸 桜夜と会う (準備中)</span>
              <span class="en" style="display: none;">🌸 Meet Sayo (Under Preparation)</span>
            </a>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Fetch GitHub stars after rendering
    this.fetchGitHubStars();
  }

  async fetchGitHubStars() {
    const starElements = document.querySelectorAll('.star-count');

    for (const element of starElements) {
      const repo = element.getAttribute('data-repo');
      if (!repo) continue;

      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        if (response.ok) {
          const data = await response.json();
          const starNumber = element.querySelector('.star-number');
          if (starNumber) {
            starNumber.textContent = data.stargazers_count.toLocaleString();
          }
        } else {
          logger.warn(`Failed to fetch stars for ${repo}`);
          const starNumber = element.querySelector('.star-number');
          if (starNumber) {
            starNumber.textContent = '0';
          }
        }
      } catch (error) {
        logger.error(`Error fetching stars for ${repo}:`, error);
        const starNumber = element.querySelector('.star-number');
        if (starNumber) {
          starNumber.textContent = '0';
        }
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}
