class JobAppCard extends HTMLElement {
	constructor() {
		super();

		// 1. Attach shadow DOM
		const shadow = this.attachShadow({ mode: 'open' });

		// 2. Create the card structure (same as your HTML template)
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

		const position = document.createElement('p');
		position.classList.add('position');

		const requirements = document.createElement('ul');
		requirements.classList.add('requirements');

		// Build the structure
		favoriteBtn.appendChild(icon);
		header.appendChild(title);
		header.appendChild(company);
		card.append(favoriteBtn, logo, header, position, requirements);

		// 3. Style tag (insert all CSS you had in job-card.css)
		const style = document.createElement('style');
		style.textContent = `
			* {
				font-family: system-ui, -apple-system, BlinkMacSystemFont,
					'Segoe UI', Roboto, Oxygen, Ubuntu,
					Cantarell, 'Fira Sans', 'Droid Sans',
					'Helvetica Neue', sans-serif;
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
				aspect-ratio: 2 / 3;
			}
			img.logo {
				width: 64px;
				height: auto;
				margin-bottom: 0.75rem;
				object-fit: contain;
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
			@keyframes material-pop {
				0% { transform: scale(1); }
				50% { transform: scale(1.4); }
				100% { transform: scale(1); }
			}
			.favorite.bounced {
				animation: material-pop 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
			}
			header {
				text-align: center;
				margin: 0.5rem 0;
			}
			h2.title {
				margin: 0;
				font-size: 1.25rem;
				color: #333;
			}
			h3.company {
				margin: 0.25rem 0;
				font-size: 1rem;
				color: #666;
			}
			.position {
				margin: 0.5rem 0 0;
				font-size: 0.95rem;
				color: #555;
			}
			ul.requirements {
				width: 100%;
        text-align: left;
        padding-left: 1.25rem;
        margin: 0.5rem 0 0;
        align-self: flex-start;
			}
			ul.requirements > li {
				margin: 0.25rem 0;
        text-align: left; 
			}
		`;

		// 4. Append to Shadow DOM
		shadow.append(style, card);

		// 5. Store references for use in set data()
		this._elements = { logo, title, company, position, requirements, icon, favoriteBtn };
	}

	// Called when someone does: element.data = {...}
	set data(data) {
		if (!data) return;

		const { logo, title, company, position, requirements, icon, favoriteBtn } = this._elements;

		// Fill in content
		logo.src = data.logo;
		logo.alt = `${data.company} Logo`;
		title.textContent = data.title;
		company.textContent = data.company;
		position.textContent = data.position;

		// Clear and populate requirements list
		requirements.innerHTML = '';
		data.requirements.forEach(item => {
			const li = document.createElement('li');
			li.textContent = item;
			requirements.appendChild(li);
		});

		// Setup favorite icon behavior
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