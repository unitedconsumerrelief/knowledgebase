// Search functionality using Lunr.js
class KnowledgeBaseSearch {
    constructor() {
        this.index = null;
        this.articles = [];
        this.searchInput = null;
        this.searchResults = null;
        this.currentQuery = '';
        this.selectedIndex = -1;
        this.searchTimeout = null;
        
        this.init();
    }
    
    async init() {
        await this.loadLunr();
        this.setupSearchIndex();
        this.setupEventListeners();
        this.loadArticles();
    }
    
    async loadLunr() {
        // Load Lunr.js from CDN if not already loaded
        if (typeof lunr === 'undefined') {
            await this.loadScript('https://unpkg.com/lunr@2.3.9/lunr.js');
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setupSearchIndex() {
        // Create Lunr search index
        this.index = lunr(function () {
            this.field('title', { boost: 10 });
            this.field('content', { boost: 5 });
            this.field('category', { boost: 3 });
            this.field('tags', { boost: 2 });
            this.ref('id');
            
            // Add search pipeline functions
            this.pipeline.remove(lunr.stemmer);
            this.searchPipeline.remove(lunr.stemmer);
        });
    }
    
    loadArticles() {
        // Sample articles data - in a real app, this would come from your CMS or API
        this.articles = [
            {
                id: 'como-agregar-un-acreedor',
                title: 'Cómo Agregar un Acreedor',
                titleEn: 'How to Add a Creditor',
                content: 'Aprende el proceso paso a paso para agregar acreedores a tu cuenta de alivio de deuda. Este artículo te guiará a través de todos los pasos necesarios para configurar correctamente la información del acreedor.',
                contentEn: 'Learn the step-by-step process for adding creditors to your debt settlement account. This article will guide you through all the necessary steps to properly configure creditor information.',
                category: 'Proceso',
                categoryEn: 'Process',
                tags: ['acreedor', 'deuda', 'proceso', 'configuración'],
                tagsEn: ['creditor', 'debt', 'process', 'setup'],
                url: 'articles/como-agregar-un-acreedor.html',
                language: 'es'
            },
            {
                id: 'tips-de-venta',
                title: 'Tips de Venta',
                titleEn: 'Sales Tips',
                content: 'Tips y estrategias esenciales para ventas exitosas de alivio de deuda. Incluye técnicas de persuasión, manejo de objeciones y mejores prácticas para cerrar ventas.',
                contentEn: 'Essential tips and strategies for successful debt settlement sales. Includes persuasion techniques, objection handling, and best practices for closing sales.',
                category: 'Ventas',
                categoryEn: 'Sales',
                tags: ['ventas', 'estrategias', 'objeciones', 'cierre'],
                tagsEn: ['sales', 'strategies', 'objections', 'closing'],
                url: 'articles/tips-de-venta.html',
                language: 'es'
            },
            {
                id: 'como-establecer-un-plan',
                title: 'Cómo Establecer un Plan',
                titleEn: 'How to Set Up a Plan',
                content: 'Guía completa para establecer planes de alivio de deuda para tus clientes. Cubre la configuración inicial, términos y condiciones, y seguimiento del progreso.',
                contentEn: 'Complete guide to setting up debt settlement plans for your clients. Covers initial setup, terms and conditions, and progress tracking.',
                category: 'Proceso',
                categoryEn: 'Process',
                tags: ['plan', 'configuración', 'cliente', 'seguimiento'],
                tagsEn: ['plan', 'setup', 'client', 'tracking'],
                url: 'articles/como-establecer-un-plan.html',
                language: 'es'
            },
            {
                id: 'debt-settlement-key-acronyms',
                title: 'Debt Settlement Key Acronyms',
                titleEn: 'Debt Settlement Key Acronyms',
                content: 'Essential terminology and acronyms for debt settlement professionals. A comprehensive glossary of terms used in the debt settlement industry.',
                contentEn: 'Essential terminology and acronyms for debt settlement professionals. A comprehensive glossary of terms used in the debt settlement industry.',
                category: 'Reference',
                categoryEn: 'Reference',
                tags: ['terminology', 'acronyms', 'glossary', 'reference'],
                tagsEn: ['terminology', 'acronyms', 'glossary', 'reference'],
                url: 'articles/debt-settlement-key-acronyms.html',
                language: 'en'
            },
            {
                id: 'english-objections',
                title: 'English Objections',
                titleEn: 'English Objections',
                content: 'Common objections in English and how to handle them effectively. Includes response scripts and techniques for overcoming customer concerns.',
                contentEn: 'Common objections in English and how to handle them effectively. Includes response scripts and techniques for overcoming customer concerns.',
                category: 'Sales',
                categoryEn: 'Sales',
                tags: ['objections', 'responses', 'scripts', 'english'],
                tagsEn: ['objections', 'responses', 'scripts', 'english'],
                url: 'articles/english-objections.html',
                language: 'en'
            },
            {
                id: 'como-agregar-un-contacto',
                title: 'Cómo Agregar un Contacto',
                titleEn: 'How to Add a Contact',
                content: 'Instrucciones detalladas para agregar nuevos contactos al sistema. Incluye información personal, datos de contacto y configuración de preferencias.',
                contentEn: 'Detailed instructions for adding new contacts to the system. Includes personal information, contact details, and preference settings.',
                category: 'Configuración',
                categoryEn: 'Setup',
                tags: ['contacto', 'sistema', 'información', 'preferencias'],
                tagsEn: ['contact', 'system', 'information', 'preferences'],
                url: 'articles/como-agregar-un-contacto.html',
                language: 'es'
            },
            {
                id: 'como-agregar-una-cuenta-de-banco',
                title: 'Cómo Agregar una Cuenta de Banco',
                titleEn: 'How to Add a Bank Account',
                content: 'Proceso completo para agregar información de cuenta bancaria al sistema. Incluye verificación de datos y configuración de pagos automáticos.',
                contentEn: 'Complete process for adding bank account information to the system. Includes data verification and automatic payment setup.',
                category: 'Configuración',
                categoryEn: 'Setup',
                tags: ['banco', 'cuenta', 'pagos', 'verificación'],
                tagsEn: ['bank', 'account', 'payments', 'verification'],
                url: 'articles/como-agregar-una-cuenta-de-banco.html',
                language: 'es'
            },
            {
                id: 'como-enviar-un-contrato',
                title: 'Cómo Enviar un Contrato',
                titleEn: 'How to Send a Contract',
                content: 'Guía paso a paso para enviar contratos a los clientes. Incluye preparación de documentos, métodos de envío y seguimiento de firmas.',
                contentEn: 'Step-by-step guide for sending contracts to clients. Includes document preparation, delivery methods, and signature tracking.',
                category: 'Proceso',
                categoryEn: 'Process',
                tags: ['contrato', 'envío', 'firma', 'documentos'],
                tagsEn: ['contract', 'delivery', 'signature', 'documents'],
                url: 'articles/como-enviar-un-contrato.html',
                language: 'es'
            },
            {
                id: 'como-generar-un-reporte-de-credito',
                title: 'Cómo Generar un Reporte de Crédito',
                titleEn: 'How to Generate a Credit Report',
                content: 'Instrucciones para generar reportes de crédito detallados. Incluye análisis de puntaje, historial de pagos y recomendaciones de mejora.',
                contentEn: 'Instructions for generating detailed credit reports. Includes score analysis, payment history, and improvement recommendations.',
                category: 'Reportes',
                categoryEn: 'Reports',
                tags: ['reporte', 'crédito', 'puntaje', 'análisis'],
                tagsEn: ['report', 'credit', 'score', 'analysis'],
                url: 'articles/como-generar-un-reporte-de-credito.html',
                language: 'es'
            },
            {
                id: 'lista-de-objeciones-comunes',
                title: 'Lista de Objeciones Comunes',
                titleEn: 'List of Common Objections',
                content: 'Lista completa de objeciones comunes en español y sus respuestas efectivas. Incluye técnicas de persuasión y scripts de respuesta.',
                contentEn: 'Complete list of common objections in Spanish and their effective responses. Includes persuasion techniques and response scripts.',
                category: 'Ventas',
                categoryEn: 'Sales',
                tags: ['objeciones', 'respuestas', 'español', 'ventas'],
                tagsEn: ['objections', 'responses', 'spanish', 'sales'],
                url: 'articles/lista-de-objeciones-comunes.html',
                language: 'es'
            }
        ];
        
        // Add articles to search index
        this.articles.forEach(article => {
            this.index.add({
                id: article.id,
                title: `${article.title} ${article.titleEn}`,
                content: `${article.content} ${article.contentEn}`,
                category: `${article.category} ${article.categoryEn}`,
                tags: `${article.tags.join(' ')} ${article.tagsEn.join(' ')}`
            });
        });
    }
    
    setupEventListeners() {
        this.searchInput = document.querySelector('.search-modal-input');
        this.searchResults = document.querySelector('#searchResults');
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            this.searchInput.addEventListener('keydown', (e) => {
                this.handleSearchKeydown(e);
            });
        }
    }
    
    handleSearchInput(query) {
        this.currentQuery = query.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }
    
    handleSearchKeydown(e) {
        const results = this.searchResults.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                this.updateSelection(results);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(results);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
                    const link = results[this.selectedIndex].querySelector('a');
                    if (link) {
                        window.location.href = link.href;
                    }
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.clearSearch();
                break;
        }
    }
    
    updateSelection(results) {
        results.forEach((result, index) => {
            result.classList.toggle('selected', index === this.selectedIndex);
        });
    }
    
    performSearch() {
        if (!this.currentQuery) {
            this.showPlaceholder();
            return;
        }
        
        try {
            const searchResults = this.index.search(this.currentQuery);
            this.displayResults(searchResults);
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        }
    }
    
    displayResults(results) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        const resultsHtml = results.map((result, index) => {
            const article = this.articles.find(a => a.id === result.ref);
            if (!article) return '';
            
            const currentLang = window.kbApp?.currentLanguage || 'en';
            const title = currentLang === 'es' ? article.title : article.titleEn;
            const content = currentLang === 'es' ? article.content : article.contentEn;
            const category = currentLang === 'es' ? article.category : article.categoryEn;
            
            const highlightedTitle = this.highlightText(title, this.currentQuery);
            const highlightedContent = this.highlightText(content.substring(0, 150) + '...', this.currentQuery);
            
            return `
                <div class="search-result-item" data-index="${index}">
                    <a href="${article.url}" class="search-result-link">
                        <div class="search-result-header">
                            <h3 class="search-result-title">${highlightedTitle}</h3>
                            <span class="search-result-category">${category}</span>
                        </div>
                        <p class="search-result-excerpt">${highlightedContent}</p>
                        <div class="search-result-meta">
                            <span class="search-result-language">${article.language === 'es' ? 'Español' : 'English'}</span>
                            <span class="search-result-score">Relevance: ${Math.round(result.score * 100)}%</span>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
        
        this.searchResults.innerHTML = `
            <div class="search-results-header">
                <span class="search-results-count">${results.length} result${results.length !== 1 ? 's' : ''} found</span>
            </div>
            <div class="search-results-list">
                ${resultsHtml}
            </div>
        `;
        
        // Reset selection
        this.selectedIndex = -1;
    }
    
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    showPlaceholder() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = `
            <div class="search-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p data-en="Search for articles, guides, and resources..." data-es="Busca artículos, guías y recursos...">
                    Search for articles, guides, and resources...
                </p>
            </div>
        `;
        
        // Update language if needed
        if (window.kbApp) {
            window.kbApp.updateLanguage();
        }
    }
    
    showNoResults() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = `
            <div class="search-no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                    <line x1="8" y1="8" x2="16" y2="16"></line>
                </svg>
                <h3 data-en="No results found" data-es="No se encontraron resultados">No results found</h3>
                <p data-en="Try different keywords or browse our categories" data-es="Intenta con diferentes palabras clave o navega por nuestras categorías">
                    Try different keywords or browse our categories
                </p>
            </div>
        `;
        
        // Update language if needed
        if (window.kbApp) {
            window.kbApp.updateLanguage();
        }
    }
    
    showError() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = `
            <div class="search-error">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <h3 data-en="Search error" data-es="Error de búsqueda">Search error</h3>
                <p data-en="Something went wrong. Please try again." data-es="Algo salió mal. Por favor intenta de nuevo.">
                    Something went wrong. Please try again.
                </p>
            </div>
        `;
        
        // Update language if needed
        if (window.kbApp) {
            window.kbApp.updateLanguage();
        }
    }
    
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.currentQuery = '';
        this.selectedIndex = -1;
        this.showPlaceholder();
    }
    
    // Public methods for external use
    search(query) {
        this.currentQuery = query.trim();
        this.performSearch();
    }
    
    getSearchStats() {
        return {
            totalArticles: this.articles.length,
            indexedFields: ['title', 'content', 'category', 'tags'],
            languages: ['en', 'es']
        };
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.kbSearch = new KnowledgeBaseSearch();
    } catch (error) {
        console.error('Failed to initialize search:', error);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowledgeBaseSearch;
} 