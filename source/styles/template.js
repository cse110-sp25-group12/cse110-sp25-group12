// template.js - Common Template JavaScript Logic
// IIFE to encapsulate the script and avoid polluting the global scope
(function() {
    let htmlElement, 
        themeToggleButton, 
        themeToggleIcon, 
        themeToggleLabel, 
        sidebarToggleButton,
        navLinks;

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

    // --- Sidebar Toggle Functions ---
    // ...existing code...
    // --- Sidebar Toggle Functions ---
    function applySidebarState(collapsed) {
        if (!htmlElement) htmlElement = document.documentElement;
        htmlElement.setAttribute('data-sidebar-collapsed', collapsed ? 'true' : 'false');
        // The component <app-sidebar> will observe this attribute and adjust its own width.
    }

    function toggleSidebar() {
        if (!htmlElement) htmlElement = document.documentElement;
        const isCollapsed = htmlElement.getAttribute('data-sidebar-collapsed') === 'true';
        applySidebarState(!isCollapsed);
        localStorage.setItem('sidebarCollapsed', !isCollapsed);
    }
    
    // --- Set Active Navigation Link ---
    // function setActiveNavLink() { ... } // This logic is now in app-sidebar.js
    
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

        if (window.innerWidth > 768) { 
            const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
            applySidebarState(savedSidebarState);
        } else {
            applySidebarState(true); // Collapse sidebar on smaller screens by default
        }

        // setActiveNavLink(); // Removed, handled by app-sidebar
    }

    // Wait for the DOM to be fully loaded before running the global initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTemplateApp);
    } else {
        // DOMContentLoaded has already fired
        initializeTemplateApp();
    }

})(); // End of IIFE
