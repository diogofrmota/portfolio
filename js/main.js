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
