class JobAppCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Load Material Symbols icon font inside Shadow DOM
    const fontLink = document.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

    // Create card
    const card = document.createElement('a'); // Consider changing to 'article' or 'div' if not a link
    card.classList.add('card');

    const cardActions = document.createElement('div');
    cardActions.classList.add('card-actions');

    const favoriteBtn = document.createElement('button');
    favoriteBtn.classList.add('favorite-btn'); // Renamed for clarity
    favoriteBtn.title = 'Bookmark';

    const favoriteIcon = document.createElement('span');
    favoriteIcon.classList.add('material-symbols-outlined');
    favoriteIcon.textContent = 'bookmark';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.title = 'Delete';

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-symbols-outlined');
    deleteIcon.textContent = 'delete';


    const logo = document.createElement('img');
    logo.classList.add('logo');

    const header = document.createElement('header');
    const title = document.createElement('h2');
    title.classList.add('title');

    const company = document.createElement('h3');
    company.classList.add('company');

    const date = document.createElement('p');
    date.classList.add('date');

    const email = document.createElement('p');
    email.classList.add('email');

    // Build structure
    favoriteBtn.appendChild(favoriteIcon);
    deleteBtn.appendChild(deleteIcon);
    cardActions.appendChild(favoriteBtn);
    cardActions.appendChild(deleteBtn);

    header.appendChild(title);
    header.appendChild(company);
    card.append(cardActions, logo, header, date, email);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
            * {
                font-family: system-ui, sans-serif;
                box-sizing: border-box; /* Added for better layout control */
            }
            .card {
                display: flex;
                flex-direction: column;
                /* align-items: center; /* Removed to allow actions to be at the top right */
                background: #fff; /* Consider using CSS variables from colors.css */
                border: 1px solid #ccc; /* Consider using CSS variables */
                border-radius: 0.5rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                padding: 1rem;
                margin: 1rem;
                width: 15em; /* Or use a more responsive width */
                /* text-align: center; /* Removed for more flexible content alignment */
                text-decoration: none; /* If card is an <a> tag */
                position: relative; /* For positioning actions */
            }
            .card-actions {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                display: flex;
                gap: 0.25rem; /* Space between buttons */
            }
            img.logo {
              	height: 64px;
                width: 64px; /* Added for consistency */
                  object-fit: contain;
                  background-color: white;
                border-radius: 8px;
                padding: 0.25rem;
                margin-bottom: 0.75rem;
                align-self: center; /* Center logo if card text-align is removed */
            }
            .favorite-btn, .delete-btn { /* Combined styles for action buttons */
                font-family: 'Material Symbols Outlined'; /* Ensure this is applied */
                font-size: 1.5rem; /* Adjusted for better visual balance */
                cursor: pointer;
                background: none;
                border: none;
                padding: 0.25rem; /* Added some padding for easier clicking */
                color: #007bff; /* Consider using CSS variables */
                transition: color 0.2s ease, transform 0.2s ease; /* Added transform transition */
                line-height: 1; /* Helps with icon alignment */
            }
            .favorite-btn:hover, .delete-btn:hover {
                transform: scale(1.1); /* Slight zoom on hover */
            }
            .favorite-btn.active {
                color: #e91e63; /* Consider using CSS variables */
            }
            .delete-btn {
                color: #dc3545; /* Red color for delete, consider CSS variable */
            }
            .delete-btn:hover {
                color: #c82333; /* Darker red on hover */
            }
            .favorite-btn.bounced { /* Renamed from .favorite.bounced */
                animation: material-pop 0.4s ease;
            }
            @keyframes material-pop {
                0% { transform: scale(1); }
                50% { transform: scale(1.4); }
                100% { transform: scale(1); }
            }
            h2.title {
                margin: 0.5rem 0 0; /* Adjusted margin */
                font-size: 1.1rem;
                color: #333; /* Consider using CSS variables */
                text-align: center; /* Re-apply if needed for title only */
            }
            h3.company {
                margin: 0.25rem 0;
                font-size: 0.95rem;
                color: #666; /* Consider using CSS variables */
                text-align: center; /* Re-apply if needed for company only */
            }
            .date, .email {
                font-size: 0.85rem;
                color: #444; /* Consider using CSS variables */
                margin: 0.25rem 0;
                text-align: center; /* Re-apply if needed */
            }
        `;

    // Add to shadow root
    shadow.append(fontLink, style, card);

    // Save elements for data binding
    this._elements = {
      logo,
      title,
      company,
      date,
      email,
      favoriteIcon, // Renamed from icon
      favoriteBtn,
      deleteIcon, // Added
      deleteBtn     // Added
    };
  }

  set data(data) {
    if (!data) return;

    const { logo, title, company, date, email, favoriteIcon, favoriteBtn, deleteBtn } = this._elements;

    // Use a data URL placeholder instead of external service
    const fallbackLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNDQ0MiLz4KPHN2Zz4K';

    logo.src = data.logo || fallbackLogo;
    logo.alt = `${data.company || ''} Logo`;

    // Add error handling for logo loading
    logo.onerror = () => {
      logo.src = fallbackLogo;
    };

    title.textContent = data.jobPosition || 'Untitled Position';
    company.textContent = data.company || 'Unknown Company';
    date.textContent = `📅 Applied: ${data.dateApplied || '-'}`;
    email.textContent = `📧 ${data.contact?.email || 'No email'}`;

    // Favorite button logic
    favoriteBtn.addEventListener('mouseenter', () => {
      if (!favoriteBtn.classList.contains('active')) favoriteIcon.textContent = 'bookmark_add';
    });
    favoriteBtn.addEventListener('mouseleave', () => {
      if (!favoriteBtn.classList.contains('active')) favoriteIcon.textContent = 'bookmark';
    });
    favoriteBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent navigation if card is an <a> tag
      const isActive = favoriteBtn.classList.toggle('active');
      favoriteIcon.textContent = isActive ? 'bookmark_added' : 'bookmark';
      favoriteBtn.classList.add('bounced');
      setTimeout(() => favoriteBtn.classList.remove('bounced'), 400);
      // Dispatch an event for favoriting
      this.dispatchEvent(new CustomEvent('favorite-toggled', {
        detail: { id: this.dataset.id, favorited: isActive },
        bubbles: true,
        composed: true
      }));
    });

    // Delete button logic
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent navigation if card is an <a> tag
      // Dispatch an event for deletion, including the card's ID (assuming you set a data-id attribute)
      this.dispatchEvent(new CustomEvent('delete-card', {
        detail: { id: this.dataset.id }, // You'll need to set data-id on the custom element
        bubbles: true,
        composed: true
      }));
    });
  }

  // It's good practice to reflect attributes if they control state, e.g., data-id
  // static get observedAttributes() { return ['data-id']; }
  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (name === 'data-id' && this.data) {
  //     // Potentially re-bind or update internal state if needed
  //   }
  // }

}

customElements.define('job-app-card', JobAppCard);