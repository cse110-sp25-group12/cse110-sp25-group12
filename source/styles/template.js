// template.js - Common Template JavaScript Logic
// IIFE to encapsulate the script and avoid polluting the global scope
(function() {
  let htmlElement;

  // --- Theme Toggle Functions ---
  function applyTheme(theme) {
    if (!htmlElement) htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    if (!htmlElement) htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
  }

  // --- Global Event Listeners and Initial Setup ---
  function initializeTemplateApp() {
    htmlElement = document.documentElement;

    // Theme initialization
    document.body.addEventListener('request-theme-toggle', toggleTheme);
    const savedTheme = localStorage.getItem('appTheme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (systemPrefersDark) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }

    // Sidebar loading and content visibility logic
    const sidebarElement = document.querySelector('app-sidebar');
    const mainContentElement = document.querySelector('.main-content-page');

    if (mainContentElement) {
      if (sidebarElement) {
        const showContent = () => {
          mainContentElement.classList.add('content-visible');
        };

        customElements.whenDefined('app-sidebar').then(() => {
          sidebarElement.addEventListener('sidebar-loaded', showContent, { once: true });
          sidebarElement.addEventListener('sidebar-load-failed', showContent, { once: true }); // Also show content if sidebar fails, or handle error

          // Fallback: Check if sidebar might have loaded before listener attached
          // This is less likely with {once: true} and whenDefined, but can be a safeguard.
          if (sidebarElement.shadowRoot && sidebarElement.shadowRoot.querySelector('.sidebar-wrapper') && !mainContentElement.classList.contains('content-visible')) {
            showContent();
          }
        });
      } else {
        // If no sidebar on the page, show content immediately
        mainContentElement.classList.add('content-visible');
      }
    }
  }

  // Ensure initializeTemplateApp is called after the DOM is ready.
  // Your existing setup for calling initializeTemplateApp should be fine.
  // Example:
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTemplateApp);
  } else {
    initializeTemplateApp();
  }
})(); // End of IIFE
