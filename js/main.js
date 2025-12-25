// js/main.js
document.addEventListener('DOMContentLoaded', function () {
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

  // Scroll position persistence
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
    } catch (err) {
      console.error('Failed to save scroll position:', err);
    }
  }

  function restoreScrollPosition() {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (!saved) return;

      const positions = JSON.parse(saved);
      if (!positions.window) return;

      ignoreScroll = true;
      window.scrollTo({
        top: positions.window.scrollY,
        left: positions.window.scrollX,
        behavior: 'auto'
      });

      setTimeout(() => {
        ignoreScroll = false;
      }, 100);
    } catch (err) {
      console.error('Failed to restore scroll position:', err);
    }
  }

  // Save scroll on scroll
  window.addEventListener('scroll', saveScrollPosition, { passive: true });

  // Restore scroll on load
  if (document.readyState === 'complete') {
    restoreScrollPosition();
  } else {
    window.addEventListener('load', restoreScrollPosition);
  }

  // Save scroll before internal navigation
  document.querySelectorAll('a[href^="/"], a[href$=".html"]').forEach(link => {
    link.addEventListener('click', () => {
      saveScrollPosition();
    });
  });

  // Restore scroll on back/forward
  window.addEventListener('popstate', restoreScrollPosition);
});

  // js/main.js
document.addEventListener('DOMContentLoaded', function () {
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

  // Share functionality for Benfica page
  const shareLink = document.getElementById('share-link');
  
  if (shareLink) {
    shareLink.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Get page information
      const pageTitle = document.title;
      const pageUrl = window.location.href;
      
      // Get all game paragraphs
      const allParagraphs = document.querySelectorAll('.content p');
      let gamesInfo = '';
      
      // Get games text (skip the first two paragraphs)
      for (let i = 2; i < allParagraphs.length; i++) {
        const text = allParagraphs[i].textContent.trim();
        if (text.includes('last updated:')) {
          break;
        }
        gamesInfo += text + '\n';
      }
      
      // Get last updated text
      const lastUpdated = document.querySelector('p:contains("last updated:")')?.textContent || '';
      
      // Create share text
      const shareText = `${pageTitle}\n\nNext Benfica Games at Estádio da Luz:\n\n${gamesInfo}\n${lastUpdated}\n\n${pageUrl}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        // Show simple alert
        alert('Page info copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Page info copied to clipboard!');
        } catch {
          alert('Failed to copy. Please copy manually:\n\n' + shareText);
        }
        document.body.removeChild(textArea);
      });
    });
  }
});