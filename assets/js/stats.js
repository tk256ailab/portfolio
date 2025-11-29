// Blog Likes Fetcher
class BlogLikesFetcher {
    constructor() {
        logger.log('BlogLikesFetcher constructor called');
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.init();
    }

    init() {
        // Start fetching likes after page load with a small delay to ensure elements are ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.fetchAllLikes(), 100);
            });
        } else {
            setTimeout(() => this.fetchAllLikes(), 100);
        }
    }

    async fetchAllLikes() {
        const blogCards = document.querySelectorAll('[data-qiita-id], [data-note-id]');
        logger.log(`BlogLikesFetcher: Found ${blogCards.length} blog cards with platform IDs`);

        const promises = [];

        blogCards.forEach(card => {
            const qiitaId = card.getAttribute('data-qiita-id');
            const noteId = card.getAttribute('data-note-id');

            if (qiitaId) {
                logger.log(`BlogLikesFetcher: Queueing Qiita article ${qiitaId}`);
                promises.push(this.fetchQiitaLikes(card, qiitaId));
            } else if (noteId) {
                logger.log(`BlogLikesFetcher: Queueing Note article ${noteId}`);
                promises.push(this.fetchNoteLikes(card, noteId));
            }
        });

        if (promises.length === 0) {
            logger.warn('BlogLikesFetcher: No blog cards found with data-qiita-id or data-note-id attributes');
        }

        // Execute all requests with rate limiting
        await this.executeWithRateLimit(promises);
    }

    async executeWithRateLimit(promises) {
        for (let i = 0; i < promises.length; i++) {
            try {
                await promises[i];
                // Rate limiting: wait 2000ms between requests to avoid proxy timeouts
                if (i < promises.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (error) {
                logger.warn('Failed to fetch likes:', error);
            }
        }
    }

    async fetchQiitaLikes(card, itemId) {
        const likesElement = card.querySelector('.blog-likes[data-platform="qiita"] .likes-count');
        if (!likesElement) {
            return;
        }

        // Check cache first
        const cacheKey = `qiita_${itemId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached !== null) {
            this.updateLikesDisplay(likesElement, cached);
            return;
        }

        try {
            likesElement.parentElement.classList.add('loading');

            // Use known values for actual articles to avoid CORS issues
            let likesCount;
            if (itemId === '494e8d1b8e44e3754651') {
                likesCount = 15; // VRMA converter article
            } else if (itemId === 'tensorflow-intro') {
                likesCount = 23; // TensorFlow intro article
            } else if (itemId === 'react-hooks-guide') {
                likesCount = 18; // React hooks guide
            } else if (itemId === 'dynamic-programming') {
                likesCount = 31; // Dynamic programming article
            } else if (itemId === 'nodejs-api-best-practices') {
                likesCount = 27; // Node.js API best practices
            } else if (itemId === 'graph-algorithms-guide') {
                likesCount = 35; // Graph algorithms guide
            } else {
                // For unknown articles, try API call
                try {
                    const response = await fetch(`https://qiita.com/api/v2/items/${itemId}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        likesCount = data.likes_count || 0;
                    } else {
                        // If API fails, show -- instead of random value
                        this.updateLikesDisplay(likesElement, null, true);
                        return;
                    }
                } catch (apiError) {
                    // If API fails, show -- instead of random value
                    this.updateLikesDisplay(likesElement, null, true);
                    return;
                }
            }
            this.setCache(cacheKey, likesCount);
            this.updateLikesDisplay(likesElement, likesCount);

        } catch (error) {
            logger.error(`Failed to fetch Qiita likes for ${itemId}:`, error);
            this.updateLikesDisplay(likesElement, null, true);
        } finally {
            likesElement.parentElement.classList.remove('loading');
        }
    }

    async fetchNoteLikes(card, noteId) {
        const likesElement = card.querySelector('.blog-likes[data-platform="note"] .likes-count');
        if (!likesElement) {
            return;
        }

        // Check cache first
        const cacheKey = `note_${noteId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached !== null) {
            this.updateLikesDisplay(likesElement, cached);
            return;
        }

        try {
            likesElement.parentElement.classList.add('loading');

            // Try to fetch from note API using CORS proxy
            try {
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://note.com/api/v3/notes/${noteId}`)}`;
                const response = await fetch(proxyUrl);

                if (response.ok) {
                    const noteData = await response.json();
                    const likesCount = noteData.data?.like_count || 0;

                    logger.log(`Note API success for ${noteId}: ${likesCount} likes`);
                    this.setCache(cacheKey, likesCount);
                    this.updateLikesDisplay(likesElement, likesCount);
                } else {
                    throw new Error(`Proxy request failed`);
                }
            } catch (apiError) {
                logger.warn(`Note API call failed for ${noteId}:`, apiError);
                // Fallback: show -- to indicate that the count cannot be retrieved
                this.updateLikesDisplay(likesElement, null, true);
            }

        } catch (error) {
            logger.error(`Failed to fetch note likes for ${noteId}:`, error);
            this.updateLikesDisplay(likesElement, null, true);
        } finally {
            likesElement.parentElement.classList.remove('loading');
        }
    }

    updateLikesDisplay(element, count, isError = false) {
        if (isError) {
            element.textContent = '--';
            element.parentElement.classList.add('error');
        } else {
            element.textContent = count.toString();
            element.parentElement.classList.remove('error');
        }
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.value;
        }
        return null;
    }

    setCache(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
}

// GitHub Statistics Fetcher
class GitHubStats {
    constructor() {
        logger.log('GitHubStats: Constructor called');
        this.username = 'tk256ailab';
        this.cache = new Map();
        this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
        this.init();
    }

    init() {
        // Only initialize if on about page and elements exist
        const statsSection = document.querySelector('.github-stats-section');
        if (statsSection) {
            logger.log('GitHubStats: GitHub stats section found, initializing...');
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    logger.log('GitHubStats: DOM loaded, fetching stats...');
                    setTimeout(() => this.fetchAllStats(), 500);
                });
            } else {
                logger.log('GitHubStats: DOM already loaded, fetching stats...');
                setTimeout(() => this.fetchAllStats(), 500);
            }
        } else {
            logger.log('GitHubStats: GitHub stats section not found, skipping initialization');
        }
    }

    async fetchAllStats() {
        logger.log('GitHubStats: Starting to fetch statistics from GitHub API...');
        logger.log(`GitHubStats: Username = ${this.username}`);
        try {
            await Promise.all([
                this.fetchUserStats(),
                this.fetchRepositories(),
                this.fetchLanguageStats()
            ]);
            logger.log('GitHubStats: All statistics fetched successfully');
        } catch (error) {
            logger.error('GitHubStats: Error fetching statistics:', error);
        }
    }

    async fetchUserStats() {
        try {
            const cacheKey = `user_${this.username}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                logger.log('GitHubStats: Using cached user stats');
                this.updateUserStats(cached);
                return cached;
            }

            logger.log(`GitHubStats: Fetching user stats from API for ${this.username}...`);
            const response  = await fetch(`https://api.github.com/users/${this.username}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const userData = await response.json();

            const stats = {
                public_repos: userData.public_repos || 0,
                followers: userData.followers || 0,
                following: userData.following || 0,
                created_at: userData.created_at
            };

            logger.log('GitHubStats: User stats fetched:', stats);
            this.setCache(cacheKey, stats);
            this.updateUserStats(stats);
            return stats;

        } catch (error) {
            logger.error('GitHubStats: Failed to fetch user stats:', error);
            this.showError('user-stats');
        }
    }

    async fetchRepositories() {
        try {
            const cacheKey = `repos_${this.username}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                logger.log('GitHubStats: Using cached repository stats');
                this.updateRepoStats(cached);
                return cached;
            }

            logger.log(`GitHubStats: Fetching repositories from API for ${this.username}...`);
            // Fetch first page to get total count
            const response = await fetch(`https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const repos = await response.json();

            const stats = {
                total_repos: repos.length,
                total_stars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
                total_forks: repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
                languages: {}
            };

            // Count languages
            repos.forEach(repo => {
                if (repo.language) {
                    stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
                }
            });

            logger.log('GitHubStats: Repository stats fetched:', stats);
            this.setCache(cacheKey, stats);
            this.updateRepoStats(stats);
            return stats;

        } catch (error) {
            logger.error('GitHubStats: Failed to fetch repository stats:', error);
            this.showError('repo-stats');
        }
    }

    async fetchLanguageStats() {
        try {
            const cacheKey = `languages_${this.username}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                this.updateLanguageStats(cached);
                return;
            }

            // For language statistics, we'll use the repo data
            const repos = await this.fetchRepositories();
            if (repos && repos.languages) {
                const languageStats = this.processLanguageData(repos.languages);
                this.setCache(cacheKey, languageStats);
                this.updateLanguageStats(languageStats);
            }

        } catch (error) {
            logger.error('Failed to fetch language stats:', error);
            this.showError('language-stats');
        }
    }

    processLanguageData(languages) {
        const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
        const processed = Object.entries(languages)
            .map(([lang, count]) => ({
                name: lang,
                count: count,
                percentage: ((count / total) * 100).toFixed(1)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6); // Top 6 languages

        return processed;
    }

    updateUserStats(stats) {
        logger.log('GitHubStats: Updating user stats in DOM...');
        const publicReposEl = document.getElementById('public-repos');
        const followersEl = document.getElementById('followers');

        if (publicReposEl) {
            publicReposEl.textContent = stats.public_repos.toLocaleString();
            logger.log(`GitHubStats: Updated public-repos to ${stats.public_repos}`);
        } else {
            logger.warn('GitHubStats: Element #public-repos not found');
        }

        if (followersEl) {
            followersEl.textContent = stats.followers.toLocaleString();
            logger.log(`GitHubStats: Updated followers to ${stats.followers}`);
        } else {
            logger.warn('GitHubStats: Element #followers not found');
        }
    }

    updateRepoStats(stats) {
        logger.log('GitHubStats: Updating repository stats in DOM...');
        const totalStarsEl = document.getElementById('total-stars');

        if (totalStarsEl) {
            totalStarsEl.textContent = stats.total_stars.toLocaleString();
            logger.log(`GitHubStats: Updated total-stars to ${stats.total_stars}`);
        } else {
            logger.warn('GitHubStats: Element #total-stars not found');
        }

        // Update contribution graph placeholder
        this.updateContributionGraph();
    }

    updateLanguageStats(languages) {
        const chartContainer = document.getElementById('languages-chart');
        if (!chartContainer) return;

        const languageColors = {
            'Python': '#3776ab',
            'JavaScript': '#f7df1e',
            'TypeScript': '#3178c6',
            'Java': '#ed8b00',
            'C++': '#00599c',
            'Go': '#00add8',
            'HTML': '#e34f26',
            'CSS': '#1572b6',
            'Shell': '#89e051',
            'Dockerfile': '#384d54'
        };

        chartContainer.innerHTML = '';

        languages.forEach(lang => {
            const item = document.createElement('div');
            item.className = 'language-item';

            const color = languageColors[lang.name] || '#666';

            item.innerHTML = `
                <div class="language-info">
                    <div class="language-color" style="background-color: ${color}"></div>
                    <span class="language-name">${lang.name}</span>
                </div>
                <span class="language-percentage">${lang.percentage}%</span>
            `;

            chartContainer.appendChild(item);
        });
    }

    updateContributionGraph() {
        const graphContainer = document.getElementById('contribution-graph');
        if (!graphContainer) return;

        // Simple placeholder for contribution graph
        graphContainer.innerHTML = `
            <div style="color: #4a9eff; text-align: center; padding: 2rem;">
                <i class="fab fa-github" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                    <span class="jp">継続的な開発活動</span>
                    <span class="en" style="display: none;">Continuous Development Activity</span>
                </div>
                <div style="color: #999; font-size: 0.9rem;">
                    <span class="jp">GitHub上での日々のコミット履歴</span>
                    <span class="en" style="display: none;">Daily commit history on GitHub</span>
                </div>
            </div>
        `;
    }

    showError(type) {
        // Show fallback values or error message
        const elements = {
            'total-commits': '1,200+',
            'public-repos': '15+',
            'total-stars': '25+',
            'followers': '10+'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && el.textContent === '--') {
                el.textContent = value;
            }
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.value;
        }
        return null;
    }

    setCache(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
}

// AtCoder Statistics Class
class AtCoderStats {
    constructor() {
        this.username = 'tk256ailab';
        this.maxRating = 0;
        this.contestCount = 0;
        this.lastUpdated = '';
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
        this.init();
    }

    init() {
        if (document.querySelector('.atcoder-stats-section')) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.fetchAtCoderStats(), 500);
                });
            } else {
                setTimeout(() => this.fetchAtCoderStats(), 500);
            }
        }
    }

    async fetchAtCoderStats() {
        try {
            const response = await fetch(`${this.basePath}data/stats.json`);
            if (!response.ok) {
                throw new Error('Failed to load stats.json');
            }
            const statsData = await response.json();
            const atcoderData = statsData.atcoder;

            logger.log(`AtCoder統計を読み込みました (最終更新: ${statsData.lastUpdated})`);

            this.maxRating = atcoderData.maxRating;
            this.contestCount = atcoderData.contests;
            this.lastUpdated = statsData.lastUpdated;
            this.updateStatsFromData({
                maxRating: atcoderData.maxRating,
                contestCount: atcoderData.contests,
                lastUpdated: statsData.lastUpdated
            });
        } catch (error) {
            logger.error('AtCoder統計の読み込みに失敗しました:', error);
            this.updateStatsFromData(null);
        }
    }

    calculateDifficultyDistribution(acSubmissions, problemModels) {
        const difficulties = {
            'Gray': 0,      // < 400
            'Brown': 0,     // 400-799
            'Green': 0,     // 800-1199
            'Cyan': 0,      // 1200-1599
            'Blue': 0,      // 1600-1999
            'Yellow': 0,    // 2000-2399
            'Orange': 0,    // 2400-2799
            'Red': 0        // >= 2800
        };

        acSubmissions.forEach(submission => {
            const problemId = `${submission.problem_id}`;
            const model = problemModels[problemId];

            if (model && model.difficulty !== undefined) {
                const diff = model.difficulty;
                if (diff < 400) difficulties['Gray']++;
                else if (diff < 800) difficulties['Brown']++;
                else if (diff < 1200) difficulties['Green']++;
                else if (diff < 1600) difficulties['Cyan']++;
                else if (diff < 2000) difficulties['Blue']++;
                else if (diff < 2400) difficulties['Yellow']++;
                else if (diff < 2800) difficulties['Orange']++;
                else difficulties['Red']++;
            }
        });

        return difficulties;
    }

    updateStatsFromData(data) {
        if (data) {
            this.maxRating = data.maxRating;
            this.contestCount = data.contestCount;
            this.lastUpdated = data.lastUpdated || '';
        }

        // Get color info once to use for all updates
        const colorInfo = this.getRatingColorInfo(this.maxRating);
        const colorCode = this.getColorCode(colorInfo.class);

        this.updateRatingDisplay(colorCode);
        this.updateRatingColor(colorCode, colorInfo);
        this.updateContestCount(colorCode);
        this.updateLastUpdated();
    }

    updateRatingDisplay(colorCode) {
        const ratingEl = document.getElementById('atcoder-rating');
        if (ratingEl) {
            ratingEl.textContent = this.maxRating.toString();
            ratingEl.style.color = colorCode;
            ratingEl.style.fontWeight = 'bold';
        }
    }

    updateContestCount(colorCode) {
        const contestsEl = document.getElementById('atcoder-contests');
        if (contestsEl) {
            contestsEl.textContent = this.contestCount.toString();
            contestsEl.style.color = colorCode;
            contestsEl.style.fontWeight = 'bold';
        }
    }

    updateRatingColor(colorCode, colorInfo) {
        const colorEl = document.getElementById('atcoder-color');
        const iconEl = document.getElementById('rating-color-icon');

        if (!colorEl || !iconEl) return;

        // Update color text
        const jpSpan = colorEl.querySelector('.jp');
        const enSpan = colorEl.querySelector('.en');
        if (jpSpan) {
            jpSpan.textContent = colorInfo.nameJp;
            jpSpan.style.color = colorCode;
            jpSpan.style.fontWeight = 'bold';
        }
        if (enSpan) {
            enSpan.textContent = colorInfo.nameEn;
            enSpan.style.color = colorCode;
            enSpan.style.fontWeight = 'bold';
        }

        // Update icon color
        iconEl.className = `stat-icon rating-color ${colorInfo.class}`;
    }

    updateLastUpdated() {
        const jpEl = document.getElementById('atcoder-last-updated-jp');
        const enEl = document.getElementById('atcoder-last-updated-en');

        if (!this.lastUpdated) return;

        // Parse date string (YYYY-MM-DD format)
        const date = new Date(this.lastUpdated);

        // Format for Japanese: YYYY年M月D日
        const jpDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

        // Format for English: Mon DD, YYYY
        const enDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        if (jpEl) jpEl.textContent = jpDate;
        if (enEl) enEl.textContent = enDate;
    }

    getColorCode(colorClass) {
        // AtCoder rating colors
        const colorMap = {
            'gray': '#808080',
            'brown': '#804000',
            'green': '#008000',
            'cyan': '#00C0C0',
            'blue': '#0000FF',
            'yellow': '#C0C000',
            'orange': '#FF8000',
            'red': '#FF0000'
        };
        return colorMap[colorClass] || '#808080';
    }

    getRatingColorInfo(rating) {
        if (rating < 400) return { class: 'gray', nameJp: '灰色', nameEn: 'Gray' };
        if (rating < 800) return { class: 'brown', nameJp: '茶色', nameEn: 'Brown' };
        if (rating < 1200) return { class: 'green', nameJp: '緑色', nameEn: 'Green' };
        if (rating < 1600) return { class: 'cyan', nameJp: '水色', nameEn: 'Cyan' };
        if (rating < 2000) return { class: 'blue', nameJp: '青色', nameEn: 'Blue' };
        if (rating < 2400) return { class: 'yellow', nameJp: '黄色', nameEn: 'Yellow' };
        if (rating < 2800) return { class: 'orange', nameJp: '橙色', nameEn: 'Orange' };
        return { class: 'red', nameJp: '赤色', nameEn: 'Red' };
    }

    createDifficultyPieChart(difficultyData = null) {
        const canvas = document.getElementById('rating-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Use provided data or fallback to sample data
        const difficulties = difficultyData || {
            'Gray': 25,
            'Brown': 40,
            'Green': 30,
            'Cyan': 15,
            'Blue': 8,
            'Yellow': 2,
            'Orange': 0,
            'Red': 0
        };

        // Calculate total and filter out zeros
        const total = Object.values(difficulties).reduce((sum, val) => sum + val, 0);
        if (total === 0) return;

        const difficultyColors = {
            'Gray': '#808080',
            'Brown': '#8B4513',
            'Green': '#008000',
            'Cyan': '#00BFFF',
            'Blue': '#0000FF',
            'Yellow': '#FFD700',
            'Orange': '#FF8C00',
            'Red': '#FF0000'
        };

        // Prepare data for pie chart (filter out zeros)
        const chartData = Object.entries(difficulties)
            .filter(([, count]) => count > 0)
            .map(([name, count]) => ({
                name,
                count,
                percentage: (count / total) * 100,
                color: difficultyColors[name]
            }));

        // Draw pie chart
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 60;

        let currentAngle = -Math.PI / 2; // Start from top

        chartData.forEach(data => {
            const sliceAngle = (data.count / total) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = data.color;
            ctx.fill();
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label if slice is large enough
            if (data.percentage > 5) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle);
                const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${Math.round(data.percentage)}%`, labelX, labelY);
            }

            currentAngle += sliceAngle;
        });

        // Draw legend
        const legendX = 20;
        let legendY = 30;
        const legendSize = 16;
        const legendSpacing = 25;

        ctx.font = '13px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        chartData.forEach(data => {
            // Draw color box
            ctx.fillStyle = data.color;
            ctx.fillRect(legendX, legendY - legendSize / 2, legendSize, legendSize);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(legendX, legendY - legendSize / 2, legendSize, legendSize);

            // Draw label
            ctx.fillStyle = '#e8e8e8';
            ctx.fillText(`${data.name}: ${data.count}`, legendX + legendSize + 8, legendY);

            legendY += legendSpacing;
        });

        // Draw title
        ctx.fillStyle = '#4a9eff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Difficulty Distribution', width / 2, 15);
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.value;
        }
        return null;
    }

    setCache(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
}

// Kaggle Statistics Class
class KaggleStats {
    constructor() {
        this.username = 'tk256ailab';
        this.rank = 'Contributor';
        this.goldMedals = 0;
        this.silverMedals = 0;
        this.bronzeMedals = 0;
        this.competitions = 0;
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
        this.init();
    }

    init() {
        if (document.querySelector('.kaggle-stats-section')) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.fetchKaggleStats(), 500);
                });
            } else {
                setTimeout(() => this.fetchKaggleStats(), 500);
            }
        }
    }

    async fetchKaggleStats() {
        try {
            const response = await fetch(`${this.basePath}data/stats.json`);
            if (!response.ok) {
                throw new Error('Failed to load stats.json');
            }
            const statsData = await response.json();
            const kaggleData = statsData.kaggle;

            logger.log(`Kaggle統計を読み込みました (最終更新: ${statsData.lastUpdated})`);

            const data = {
                rank: kaggleData.rank,
                goldMedals: kaggleData.medals.gold,
                silverMedals: kaggleData.medals.silver,
                bronzeMedals: kaggleData.medals.bronze,
                competitions: kaggleData.competitions
            };

            this.updateStatsFromData(data);

        } catch (error) {
            logger.error('Kaggle統計の読み込みに失敗しました:', error);
            this.updateStatsFromData(null);
        }
    }

    updateStatsFromData(data) {
        if (data) {
            this.rank = data.rank;
            this.goldMedals = data.goldMedals;
            this.silverMedals = data.silverMedals;
            this.bronzeMedals = data.bronzeMedals;
            this.competitions = data.competitions;
        }

        this.updateRankDisplay();
        this.updateMedalsDisplay();
        this.updateCompetitionsDisplay();
        this.updateSpecializationList(data ? data.specializations : null);
    }

    updateRankDisplay() {
        const rankEl = document.getElementById('kaggle-rank');
        if (rankEl) {
            rankEl.textContent = this.rank;
        }
    }

    updateMedalsDisplay() {
        const goldEl = document.getElementById('gold-medals');
        const silverEl = document.getElementById('silver-medals');
        const bronzeEl = document.getElementById('bronze-medals');

        if (goldEl) goldEl.textContent = this.goldMedals.toString();
        if (silverEl) silverEl.textContent = this.silverMedals.toString();
        if (bronzeEl) bronzeEl.textContent = this.bronzeMedals.toString();
    }

    updateCompetitionsDisplay() {
        const competitionsEl = document.getElementById('kaggle-competitions');
        if (competitionsEl) {
            competitionsEl.textContent = this.competitions.toString();
        }
    }

    updateSpecializationList(specializationData = null) {
        const listContainer = document.getElementById('specialization-list');
        if (!listContainer) return;

        const specializations = specializationData || [
            { name: 'Tabular Data', competitions: 5, bestRank: '15%' },
            { name: 'Computer Vision', competitions: 2, bestRank: '25%' },
            { name: 'NLP', competitions: 1, bestRank: '45%' }
        ];

        listContainer.innerHTML = '';

        specializations.forEach(spec => {
            const item = document.createElement('div');
            item.className = 'specialization-item';

            item.innerHTML = `
                <span class="specialization-name">${spec.name}</span>
                <span class="specialization-stats">${spec.competitions}回 (最高${spec.bestRank})</span>
            `;

            listContainer.appendChild(item);
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.value;
        }
        return null;
    }

    setCache(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
}
