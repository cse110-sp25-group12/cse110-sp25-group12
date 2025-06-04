// filepath: source/components/app-sidebar.js
class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Adjust the fetch path to be relative to the HTML page in the 'pages' directory
    const response = await fetch('../components/sidebar/sidebar.html'); 
    if (!response.ok) {
      console.error(`Failed to load sidebar.html: ${response.statusText} (path: ../components/sidebar/sidebar.html)`);
      this.shadowRoot.innerHTML = '<p>Error loading sidebar content.</p>';
      // Dispatch an event even on error, so the page doesn't hang indefinitely
      // Or handle this state differently in the main page script
      this.dispatchEvent(new CustomEvent('sidebar-load-failed', { bubbles: true, composed: true }));
      return;
    }
    const html = await response.text();

    const styles = `
            <link rel="stylesheet" href="../styles/colors.css"> 
            <link rel="stylesheet" href="../components/sidebar/sidebar.css"> 
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        `;

    this.shadowRoot.innerHTML = `${styles}<aside class="sidebar-wrapper">${html}</aside>`;

    // Dispatch an event to signal that the sidebar is loaded
    this.dispatchEvent(new CustomEvent('sidebar-loaded', {
        bubbles: true,
        composed: true
    }));

    this._themeToggleButton = this.shadowRoot.querySelector('.theme-toggle-button');
    this._themeToggleIcon = this._themeToggleButton?.querySelector('.material-symbols-outlined');
    this._navLinks = this.shadowRoot.querySelectorAll('.nav-link');

    this._addEventListeners();
    this._updateThemeUI(document.documentElement.getAttribute('data-theme') || 'light');
    this._setActiveNavLink();

    this._themeObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this._updateThemeUI(mutation.target.getAttribute('data-theme'));
        }
      });
    });
    this._themeObserver.observe(document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _addEventListeners() {
    if (this._themeToggleButton) {
      this._themeToggleButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('request-theme-toggle', { bubbles: true, composed: true }));
      });
    }
  }

  _updateThemeUI(theme) {
    if (this._themeToggleIcon) {
      this._themeToggleIcon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
    }
  }

  _setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    this._navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    // Special handling for add_application.html button if it's part of the main nav structure
    const addAppButton = this.shadowRoot.querySelector('.add-application-button');
    if (addAppButton && addAppButton.getAttribute('href') === currentPage) {
      addAppButton.classList.add('active'); // Assuming 'active' style is defined for it
    } else if (addAppButton) {
      addAppButton.classList.remove('active');
    }
  }
}
customElements.define('app-sidebar', AppSidebar);