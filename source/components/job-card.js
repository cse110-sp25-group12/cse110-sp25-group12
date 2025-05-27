class JobAppCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Load Material Symbols icon font inside Shadow DOM
    const fontLink = document.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

    // Create card
    const card = document.createElement('a');
    card.classList.add('card');

    const favoriteBtn = document.createElement('button');
    favoriteBtn.classList.add('favorite');
    favoriteBtn.title = 'Bookmark';

    const icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    icon.textContent = 'bookmark';

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
    favoriteBtn.appendChild(icon);
    header.appendChild(title);
    header.appendChild(company);
    card.append(favoriteBtn, logo, header, date, email);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
			* {
				font-family: system-ui, sans-serif;
			}
			.card {
				display: flex;
				flex-direction: column;
				align-items: center;
				background: #fff;
				border: 1px solid #ccc;
				border-radius: 0.5rem;
				box-shadow: 0 2px 4px rgba(0,0,0,0.1);
				padding: 1rem;
				margin: 1rem;
				width: 15em;
				text-align: center;
				text-decoration: none;
			}
			img.logo {
			  	height: 64px;
  				object-fit: contain;
  				background-color: white;
				border-radius: 8px;
				padding: 0.25rem;
				margin-bottom: 0.75rem;
			}
			.favorite {
				font-family: 'Material Symbols Outlined';
				font-size: 1.75rem;
				cursor: pointer;
				background: none;
				border: none;
				padding: 0;
				align-self: flex-end;
				color: #007bff;
				transition: color 0.2s ease;
			}
			.favorite.active {
				color: #e91e63;
			}
			.favorite.bounced {
				animation: material-pop 0.4s ease;
			}
			@keyframes material-pop {
				0% { transform: scale(1); }
				50% { transform: scale(1.4); }
				100% { transform: scale(1); }
			}
			h2.title {
				margin: 0;
				font-size: 1.1rem;
				color: #333;
			}
			h3.company {
				margin: 0.25rem 0;
				font-size: 0.95rem;
				color: #666;
			}
			.date, .email {
				font-size: 0.85rem;
				color: #444;
				margin: 0.25rem 0;
			}
		`;

    // Add to shadow root
    shadow.append(fontLink, style, card);

    // Save elements for data binding
    this._elements = { logo, title, company, date, email, icon, favoriteBtn };
  }

  set data(data) {
    if (!data) return;

    const { logo, title, company, date, email, icon, favoriteBtn } = this._elements;

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

    favoriteBtn.addEventListener('mouseenter', () => {
      if (!favoriteBtn.classList.contains('active')) icon.textContent = 'bookmark_add';
    });
    favoriteBtn.addEventListener('mouseleave', () => {
      if (!favoriteBtn.classList.contains('active')) icon.textContent = 'bookmark';
    });
    favoriteBtn.addEventListener('click', () => {
      const isActive = favoriteBtn.classList.toggle('active');
      icon.textContent = isActive ? 'bookmark_added' : 'bookmark';
      favoriteBtn.classList.add('bounced');
      setTimeout(() => favoriteBtn.classList.remove('bounced'), 400);
    });
  }
}

customElements.define('job-app-card', JobAppCard);