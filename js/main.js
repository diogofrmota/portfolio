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

  // Share functionality for Benfica page
  const shareLink = document.getElementById('share-link');

  if (shareLink) {
    // Helper function to show notification
    function showNotification() {
      const notification = document.getElementById('share-notification');
      if (notification) {
        notification.style.display = 'block';
        setTimeout(() => {
          notification.style.display = 'none';
        }, 2000);
      } else {
        alert('Games copied to clipboard!');
      }
    }

    // Fallback copy function
    function copyWithFallback(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showNotification();
        } else {
          alert('Could not copy automatically. Please select and copy manually.');
        }
      } catch (err) {
        console.error('Copy failed:', err);
        alert('Copy failed. Please select and copy manually.');
      }
      
      document.body.removeChild(textarea);
    }

    shareLink.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Get the content div
      const contentDiv = document.querySelector('.content');
      if (!contentDiv) {
        alert('Error: Could not find page content');
        return;
      }
      
      // Get only the game paragraphs (excluding header, links, and last updated)
      const allParagraphs = contentDiv.querySelectorAll('p');
      let gamesText = 'Next Benfica games at Estádio da Luz:\n\n';
      
      // Loop through paragraphs and extract only game information
      allParagraphs.forEach(p => {
        const text = p.textContent.trim();
        // Check if it's a game line (contains "vs" and a date pattern)
        if (text.includes(' - Sport Lisboa e Benfica vs ')) {
          gamesText += text + '\n';
        }
      });
      
      // Add the page URL at the bottom
      const pageUrl = window.location.href;
      const shareText = gamesText + '\n' + pageUrl;
      
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareText).then(
          function() {
            showNotification();
          },
          function() {
            copyWithFallback(shareText);
          }
        );
      } else {
        copyWithFallback(shareText);
      }
    });
  }
});