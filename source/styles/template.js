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
  }

  // Wait for the DOM to be fully loaded before running the global initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTemplateApp);
  } else {
    // DOMContentLoaded has already fired
    initializeTemplateApp();
  }

})(); // End of IIFE
