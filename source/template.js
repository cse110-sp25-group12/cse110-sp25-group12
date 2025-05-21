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
        
        if (themeToggleIcon && themeToggleLabel) { 
            if (theme === 'dark') {
                themeToggleIcon.textContent = 'dark_mode';
                themeToggleLabel.textContent = 'Dark Mode';
            } else {
                themeToggleIcon.textContent = 'light_mode';
                themeToggleLabel.textContent = 'Light Mode';
            }
        }
        // If charts exist on the current page (handled by page-specific JS),
        // they might need a separate trigger or listen for theme changes.
        // For now, this global script doesn't directly interact with charts.
    }

    function toggleTheme() {
        if (!htmlElement) htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('appTheme', newTheme); 
    }

    // --- Sidebar Toggle Functions ---
    function applySidebarState(collapsed) {
        if (!htmlElement) htmlElement = document.documentElement;
        htmlElement.setAttribute('data-sidebar-collapsed', collapsed ? 'true' : 'false');
        
        const newWidth = collapsed 
                       ? getComputedStyle(htmlElement).getPropertyValue('--sidebar-collapsed-width') 
                       : getComputedStyle(htmlElement).getPropertyValue('--sidebar-expanded-width');
        htmlElement.style.setProperty('--sidebar-width', newWidth.trim()); 
    }

    function toggleSidebar() {
        if (!htmlElement) htmlElement = document.documentElement;
        const isCollapsed = htmlElement.getAttribute('data-sidebar-collapsed') === 'true';
        applySidebarState(!isCollapsed);
        localStorage.setItem('sidebarCollapsed', !isCollapsed);
    }
    
    // --- Set Active Navigation Link ---
    function setActiveNavLink() {
        if (!navLinks) navLinks = document.querySelectorAll('.sidebar .nav-link');
        const currentPage = window.location.pathname.split('/').pop(); 

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- Global Event Listeners and Initial Setup ---
    function initializeTemplateApp() {
        htmlElement = document.documentElement;
        themeToggleButton = document.getElementById('themeToggle');
        themeToggleIcon = document.getElementById('themeToggleIcon');
        themeToggleLabel = document.getElementById('themeToggleLabel');
        sidebarToggleButton = document.getElementById('sidebarToggle');
        navLinks = document.querySelectorAll('.sidebar .nav-link');

        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', toggleTheme);
        }
        if (sidebarToggleButton) {
            sidebarToggleButton.addEventListener('click', toggleSidebar);
        }
        
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
            applySidebarState(true); 
        }

        setActiveNavLink(); 
    }

    // Wait for the DOM to be fully loaded before running the global initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTemplateApp);
    } else {
        // DOMContentLoaded has already fired
        initializeTemplateApp();
    }

})(); // End of IIFE
