// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme handling
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme() {
        if (prefersDarkScheme.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    prefersDarkScheme.addEventListener('change', updateTheme);
    updateTheme();
    
    // Smooth scroll restoration
    let ignoreScroll = false;
    const storageKey = 'tsr-scroll-restoration';
    
    function saveScrollPosition() {
        if (ignoreScroll) return;
        
        const scrollPositions = {
            window: {
                scrollY: window.scrollY,
                scrollX: window.scrollX
            }
        };
        
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(scrollPositions));
        } catch (error) {
            console.error('Failed to save scroll position:', error);
        }
    }
    
    function restoreScrollPosition() {
        try {
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                const positions = JSON.parse(saved);
                if (positions.window) {
                    ignoreScroll = true;
                    window.scrollTo({
                        top: positions.window.scrollY,
                        left: positions.window.scrollX,
                        behavior: 'auto'
                    });
                    setTimeout(() => { ignoreScroll = false; }, 100);
                }
            }
        } catch (error) {
            console.error('Failed to restore scroll position:', error);
        }
    }
    
    // Handle scroll events
    window.addEventListener('scroll', saveScrollPosition, { passive: true });
    
    // Handle page load
    if (document.readyState === 'complete') {
        restoreScrollPosition();
    } else {
        window.addEventListener('load', restoreScrollPosition);
    }
    
    // Handle navigation
    document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.target === '_blank' || this.rel.includes('noopener')) return;
            
            saveScrollPosition();
            // Allow default navigation
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', restoreScrollPosition);
});