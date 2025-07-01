// Main Application JavaScript
class KnowledgeBaseApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.isMobileNavOpen = false;
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupLanguage();
        this.setupNavigation();
        this.setupSearch();
        this.setupKeyboardShortcuts();
        this.setupEventListeners();
        this.setupAnalytics();
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeToggle();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeToggle();
        this.showNotification(`Switched to ${this.currentTheme} theme`);
    }

    updateThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            
            if (this.currentTheme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    // Language Management
    setupLanguage() {
        this.updateLanguage();
        this.updateLanguageToggle();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateLanguage();
        this.updateLanguageToggle();
        this.showNotification(`Language changed to ${lang === 'en' ? 'English' : 'Español'}`);
    }

    updateLanguage() {
        document.documentElement.setAttribute('lang', this.currentLanguage);
        
        // Update all elements with data attributes
        const elements = document.querySelectorAll('[data-en], [data-es]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update placeholders
        const inputs = document.querySelectorAll('[data-en-placeholder], [data-es-placeholder]');
        inputs.forEach(input => {
            const placeholder = input.getAttribute(`data-${this.currentLanguage}-placeholder`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
    }

    updateLanguageToggle() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    // Navigation Management
    setupNavigation() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.sidebar = document.querySelector('.sidebar');
        this.mobileNavOverlay = document.querySelector('#mobileNavOverlay');
        
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileNav());
        }
        
        if (this.mobileNavOverlay) {
            this.mobileNavOverlay.addEventListener('click', () => this.closeMobileNav());
        }
        
        // Close mobile nav on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && this.isMobileNavOpen) {
                this.closeMobileNav();
            }
        });
    }

    toggleMobileNav() {
        this.isMobileNavOpen = !this.isMobileNavOpen;
        
        if (this.isMobileNavOpen) {
            this.sidebar.classList.add('active');
            this.mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.closeMobileNav();
        }
    }

    closeMobileNav() {
        this.isMobileNavOpen = false;
        this.sidebar.classList.remove('active');
        this.mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Search Management
    setupSearch() {
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchModal = document.querySelector('#searchModal');
        this.searchClose = document.querySelector('.search-close');
        this.searchInput = document.querySelector('.search-modal-input');
        this.searchHeroInput = document.querySelector('.search-hero-input');
        
        if (this.searchToggle) {
            this.searchToggle.addEventListener('click', () => this.openSearch());
        }
        
        if (this.searchClose) {
            this.searchClose.addEventListener('click', () => this.closeSearch());
        }
        
        if (this.searchModal) {
            this.searchModal.addEventListener('click', (e) => {
                if (e.target === this.searchModal) {
                    this.closeSearch();
                }
            });
        }
        
        // Hero search input
        if (this.searchHeroInput) {
            this.searchHeroInput.addEventListener('focus', () => this.openSearch());
        }
    }

    openSearch() {
        this.searchModal.classList.add('active');
        if (this.searchInput) {
            setTimeout(() => this.searchInput.focus(), 100);
        }
        document.body.style.overflow = 'hidden';
    }

    closeSearch() {
        this.searchModal.classList.remove('active');
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        document.body.style.overflow = '';
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K: Open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Ctrl+D: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Ctrl+L: Toggle language
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                const newLang = this.currentLanguage === 'en' ? 'es' : 'en';
                this.setLanguage(newLang);
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                if (this.searchModal.classList.contains('active')) {
                    this.closeSearch();
                }
                if (this.isMobileNavOpen) {
                    this.closeMobileNav();
                }
            }
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Language toggle
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
        
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        
        // Track page events
        this.trackPageEvents();
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        
        // Auto remove after 3 seconds
        setTimeout(() => this.removeNotification(notification), 3000);
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Analytics and Tracking
    setupAnalytics() {
        // Track page views
        this.trackPageView();
        
        // Track user interactions
        this.trackUserInteractions();
    }

    trackPageView() {
        // Simple page view tracking
        const pageData = {
            page: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: this.currentLanguage,
            theme: this.currentTheme
        };
        
        // In a real app, you'd send this to your analytics service
        console.log('Page View:', pageData);
    }

    trackPageEvents() {
        // Track article clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.article-card a, .nav-link, .quick-action-card')) {
                const link = e.target.closest('a');
                if (link) {
                    this.trackEvent('article_click', {
                        url: link.href,
                        text: link.textContent.trim()
                    });
                }
            }
        });
        
        // Track search usage
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 2) {
                    this.trackEvent('search_input', {
                        query: e.target.value,
                        length: e.target.value.length
                    });
                }
            });
        }
    }

    trackUserInteractions() {
        // Track theme changes
        const originalToggleTheme = this.toggleTheme.bind(this);
        this.toggleTheme = () => {
            originalToggleTheme();
            this.trackEvent('theme_change', { theme: this.currentTheme });
        };
        
        // Track language changes
        const originalSetLanguage = this.setLanguage.bind(this);
        this.setLanguage = (lang) => {
            originalSetLanguage(lang);
            this.trackEvent('language_change', { language: lang });
        };
    }

    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            language: this.currentLanguage,
            theme: this.currentTheme,
            ...data
        };
        
        // In a real app, you'd send this to your analytics service
        console.log('Event:', eventData);
    }

    // Error Handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // In a real app, you'd send this to your error tracking service
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context: context
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePageLoad();
        });
        
        // Monitor navigation performance
        this.observeNavigation();
    }
    
    measurePageLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
        };
        
        console.log('Performance Metrics:', metrics);
    }
    
    observeNavigation() {
        // Monitor navigation timing
        if ('navigation' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Navigation Timing:', {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp: navigation.connectEnd - navigation.connectStart,
                request: navigation.responseEnd - navigation.requestStart,
                dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                load: navigation.loadEventEnd - navigation.loadEventStart
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.kbApp = new KnowledgeBaseApp();
        window.performanceMonitor = new PerformanceMonitor();
        
        // Global error handler
        window.addEventListener('error', (e) => {
            window.kbApp.handleError(e.error, 'Global Error Handler');
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            window.kbApp.handleError(new Error(e.reason), 'Unhandled Promise Rejection');
        });
        
    } catch (error) {
        console.error('Failed to initialize Knowledge Base App:', error);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KnowledgeBaseApp, PerformanceMonitor };
} 