// filepath: source/components/app-sidebar.js
class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Load the sidebar HTML into shadow DOM
    const response = await fetch('../components/sidebar/sidebar.html');
    if (!response.ok) {
      console.error(`Failed to load sidebar.html: ${response.statusText}`);
      this.shadowRoot.innerHTML = '<p>Error loading sidebar content.</p>';
      this.dispatchEvent(new CustomEvent('sidebar-load-failed', { bubbles: true, composed: true }));
      return;
    }
    const html = await response.text();

    const styles = `
      <link rel="stylesheet" href="../styles/colors.css"> 
      <link rel="stylesheet" href="../components/sidebar/sidebar.css"> 
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <aside class="sidebar-wrapper">${html}</aside>
    `;
    this.dispatchEvent(new CustomEvent('sidebar-loaded', { bubbles: true, composed: true }));

    // Grab elements
    this._themeToggleButton = this.shadowRoot.querySelector('.theme-toggle-button');
    this._themeToggleIcon   = this._themeToggleButton?.querySelector('.material-symbols-outlined');
    this._navLinks          = this.shadowRoot.querySelectorAll('.nav-link');

    this._addEventListeners();
    this._updateThemeUI(document.documentElement.getAttribute('data-theme') || 'light');
    this._setActiveNavLink();

    // Watch for theme changes on <html>
    this._themeObserver = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          this._updateThemeUI(m.target.getAttribute('data-theme'));
        }
      });
    });
    this._themeObserver.observe(document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    if (this._themeObserver) this._themeObserver.disconnect();
  }

  _addEventListeners() {
    // 1) Theme toggle
    if (this._themeToggleButton) {
      this._themeToggleButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('request-theme-toggle', { bubbles: true, composed: true }));
      });
    }

    // 2) Intercept "Add Application" link
    const addAppLink = this.shadowRoot.querySelector('a.add-application-button');
    if (addAppLink) {
      addAppLink.addEventListener('click', e => {
        const editData = localStorage.getItem('editJobData');
        if (editData) {
          e.preventDefault();
          alert('You must save your changes before adding a new application.');
        }
      });
    }

    // 3) Intercept Dashboard & Applications links
    const protectedLinks = this.shadowRoot.querySelectorAll(
      'a.nav-link[href="dashboard.html"], a.nav-link[href="applications.html"]'
    );
    protectedLinks.forEach(link => {
      link.addEventListener('click', e => {
        const editData = localStorage.getItem('editJobData');
        if (editData) {
          e.preventDefault();
          alert('You must save your changes before leaving this page.');
        }
      });
    });
  }

  _updateThemeUI(theme) {
    if (this._themeToggleIcon) {
      this._themeToggleIcon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
    }
  }

  _setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    this._navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });

    const addAppButton = this.shadowRoot.querySelector('a.add-application-button');
    if (addAppButton) {
      addAppButton.classList.toggle('active', addAppButton.getAttribute('href') === currentPage);
    }
  }
}

customElements.define('app-sidebar', AppSidebar);
