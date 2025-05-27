// sorting-controls.js
class SortingControls extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Create elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('controls-wrapper');

        const label = document.createElement('label');
        label.setAttribute('for', 'sortOrderSelectInternal'); // Use a unique ID for shadow DOM
        label.textContent = 'Sort by:';

        const select = document.createElement('select');
        select.id = 'sortOrderSelectInternal'; // Unique ID
        select.innerHTML = `
            <option value="dateAppliedDesc">Date Applied (Newest)</option>
            <option value="dateAppliedAsc">Date Applied (Oldest)</option>
            <option value="companyNameAsc">Company (A-Z)</option>
            <option value="companyNameDesc">Company (Z-A)</option>
            <option value="status">Status</option>
        `;

        wrapper.appendChild(label);
        wrapper.appendChild(select);

        // Styles for the component
        const style = document.createElement('style');
        style.textContent = `
            /* Styles for the host element of the component */
            :host {
                display: block; /* Ensure the custom element takes up space */
                /* The class .applications-controls applied externally will handle background, padding etc. */
            }

            /* Styles for the elements INSIDE the shadow DOM */
            .controls-wrapper {
                display: flex;
                gap: 8px; 
                align-items: center;
                padding: 4px 0; /* Add a little internal vertical padding */
            }

            label {
                font-size: 0.875rem; /* 14px */
                font-weight: 500;
                color: var(--md-sys-color-on-surface-variant, #444444); /* Fallback color */
                margin-right: 4px; /* Slight space before select */
            }

            select {
                padding: 10px 14px;
                padding-right: 36px; /* Space for a potential custom arrow */
                border-radius: 20px; /* Pill shape */
                border: 1px solid var(--md-sys-color-outline, #8D9199); /* Fallback border */
                background-color: var(--md-sys-color-surface-container-highest, #E1E2E9); /* Fallback background */
                color: var(--md-sys-color-on-surface-variant, #43474E); /* Fallback text color */
                font-family: 'Roboto', sans-serif;
                font-size: 0.875rem;
                outline: none;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                cursor: pointer;
                /* Basic custom arrow appearance */
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24' fill='%23${(getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-on-surface-variant') || '43474E').substring(1)}'%3E%3Cpath d='M480-345 240-585l56-56 184 184 184-184 56 56-240 2