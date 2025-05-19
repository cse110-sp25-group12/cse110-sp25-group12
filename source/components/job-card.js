class JobAppCard extends HTMLElement {
	constructor() {
		super();

		// Attach shadow DOM
		const shadow = this.attachShadow({ mode: 'open' });

    // Add Material Symbols font link (needed inside Shadow DOM)
    const fontLink = document.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

		// Create the card structure (same as your HTML template)
		const card = document.createElement('div');
		card.classList.add('card');

		const favoriteBtn = document.createElement('button');
		favoriteBtn.classList.add('favorite');
		favoriteBtn.title = 'Bookmark';

		const icon = document.createElement('span');
		icon.classList.add('material-symbols-outlined');
		icon.textContent = 'bookmark';

		// Status badge
		const statusBadge = document.createElement('div');
		statusBadge.classList.add('status-badge');

		const logo = document.createElement('img');
		logo.classList.add('logo');

		const header = document.createElement('header');
		const jobPosition = document.createElement('h2');
		jobPosition.classList.add('job-position');

		const company = document.createElement('h3');
		company.classList.add('company');

		const position = document.createElement('p');
		position.classList.add('position');

		// Info section for additional details
		const infoSection = document.createElement('div');
		infoSection.classList.add('info-section');

		const location = document.createElement('p');
		location.classList.add('location');
		const locationIcon = document.createElement('span');
		locationIcon.classList.add('material-symbols-outlined', 'info-icon');
		locationIcon.textContent = 'location_on';
		location.appendChild(locationIcon);
		location.appendChild(document.createTextNode(''));

		const salary = document.createElement('p');
		salary.classList.add('salary');
		const salaryIcon = document.createElement('span');
		salaryIcon.classList.add('material-symbols-outlined', 'info-icon');
		salaryIcon.textContent = 'payments';
		salary.appendChild(salaryIcon);
		salary.appendChild(document.createTextNode(''));

		const dateApplied = document.createElement('p');
		dateApplied.classList.add('date-applied');
		const dateIcon = document.createElement('span');
		dateIcon.classList.add('material-symbols-outlined', 'info-icon');
		dateIcon.textContent = 'calendar_today';
		dateApplied.appendChild(dateIcon);
		dateApplied.appendChild(document.createTextNode(''));

		// Important dates section
		const datesSection = document.createElement('div');
		datesSection.classList.add('dates-section');
		const datesHeading = document.createElement('h4');
		datesHeading.textContent = 'Important Dates';
		datesSection.appendChild(datesHeading);
		const datesList = document.createElement('ul');
		datesList.classList.add('dates-list');
		datesSection.appendChild(datesList);

		// Actions section
		const actionsSection = document.createElement('div');
		actionsSection.classList.add('actions-section');

		const editBtn = document.createElement('button');
		editBtn.classList.add('action-btn', 'edit-btn');
		editBtn.innerHTML = '<span class="material-symbols-outlined">edit</span>';
		editBtn.title = 'Edit';

		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('action-btn', 'delete-btn');
		deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
		deleteBtn.title = 'Delete';

		actionsSection.append(editBtn, deleteBtn);

		// Build the structure
		favoriteBtn.appendChild(icon);
		header.appendChild(jobPosition);
		header.appendChild(company);
		
		infoSection.append(location, salary, dateApplied);
		
		card.append(
			favoriteBtn, 
			statusBadge,
			logo, 
			header, 
			position, 
			infoSection,
			datesSection,
			actionsSection
		);

		// Style tag (insert all CSS you had in job-card.css)
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

		// Append to Shadow DOM
		shadow.append(fontLink, style, card);

		// Store references for use in set data()
		this._elements = { 
			logo, 
			jobPosition, 
			company, 
			position, 
			icon, 
			favoriteBtn,
			statusBadge,
			location,
			salary,
			dateApplied,
			datesList,
			datesSection,
			editBtn,
			deleteBtn
		};
	}

	// Format salary with locale
	formatSalary(amount) {
		if (!amount) return 'Not specified';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(amount);
	}

	// Format date to more readable format
	formatDate(dateString) {
		if (!dateString) return 'Not specified';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}

	// Called when someone does: element.data = {...}
	set data(data) {
		if (!data) return;

		const { 
			logo, 
			jobPosition, 
			company, 
			position, 
			icon, 
			favoriteBtn,
			statusBadge,
			location,
			salary,
			dateApplied,
			datesList,
			datesSection,
			editBtn,
			deleteBtn
		} = this._elements;

		// Fill in content
		logo.src = data.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.company)}&background=random`;
		logo.alt = `${data.company} Logo`;
		jobPosition.textContent = data.jobPosition;
		company.textContent = data.company;
		position.textContent = data.position || 'Full-Time';

		// Set status badge
		statusBadge.textContent = data.status || 'Applied';
		statusBadge.className = 'status-badge';
		statusBadge.classList.add(`status-${(data.status || 'applied').toLowerCase()}`);

		// Set location, salary and date
		location.lastChild.textContent = data.location || 'Remote';
		salary.lastChild.textContent = this.formatSalary(data.salary);
		dateApplied.lastChild.textContent = `Applied: ${this.formatDate(data.dateApplied)}`;

		// Setup important dates
		if (data.importantDates && Object.keys(data.importantDates).length > 0) {
			datesList.innerHTML = '';
			datesSection.style.display = 'block';
			
			Object.entries(data.importantDates).forEach(([label, date]) => {
				const li = document.createElement('li');
				
				const labelSpan = document.createElement('span');
				labelSpan.className = 'date-label';
				labelSpan.textContent = label;
				
				const valueSpan = document.createElement('span');
				valueSpan.className = 'date-value';
				valueSpan.textContent = this.formatDate(date);
				
				li.appendChild(labelSpan);
				li.appendChild(valueSpan);
				datesList.appendChild(li);
			});
		} else {
			datesSection.style.display = 'none';
		}

		// Setup action buttons
		editBtn.dataset.id = data.id;
		deleteBtn.dataset.id = data.id;

		// Listen for delete button clicks
		deleteBtn.addEventListener('click', e => {
			const event = new CustomEvent('delete-application', {
				bubbles: true,
				composed: true,
				detail: { id: parseInt(e.currentTarget.dataset.id) }
			});
			this.dispatchEvent(event);
		});

		// Listen for edit button clicks
		editBtn.addEventListener('click', e => {
			const event = new CustomEvent('edit-application', {
				bubbles: true,
				composed: true,
				detail: { id: parseInt(e.currentTarget.dataset.id) }
			});
			this.dispatchEvent(event);
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