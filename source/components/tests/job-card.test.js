/**
 * @jest-environment jsdom
 */

import '../job-card.js';

describe('JobAppCard component', () => {
  let element, shadow;

  beforeEach(() => {
    document.body.innerHTML = '<job-app-card></job-app-card>';
    element = document.querySelector('job-app-card');
    element.data = {
      logo: 'https://example.com/logo.png',
      company: 'Test Company',
      jobPosition: 'Frontend Engineer',
      dateApplied: '2025-05-01',
      contact: {
        email: 'hr@test.com'
      }
    };
    shadow = element.shadowRoot;
  });

  it('renders correct company and job title', () => {
    const company = shadow.querySelector('.company');
    const title = shadow.querySelector('.title');

    expect(company.textContent).toBe('Test Company');
    expect(title.textContent).toBe('Frontend Engineer');
  });

  it('shows correct date and email', () => {
    const date = shadow.querySelector('.date');
    const email = shadow.querySelector('.email');

    expect(date.textContent).toContain('2025-05-01');
    expect(email.textContent).toContain('hr@test.com');
  });

  it('toggles favorite icon on click', () => {
    const favoriteBtn = shadow.querySelector('.favorite-btn');
    const icon = shadow.querySelector('.material-symbols-outlined');

    expect(favoriteBtn.classList.contains('active')).toBe(false);
    expect(icon.textContent).toBe('bookmark');

    favoriteBtn.click();

    expect(favoriteBtn.classList.contains('active')).toBe(true);
    expect(icon.textContent).toBe('bookmark_added');

    favoriteBtn.click();

    expect(favoriteBtn.classList.contains('active')).toBe(false);
    expect(icon.textContent).toBe('bookmark');
  });

  it('renders fallback values when data is missing', () => {
    element.data = {
      // No logo, no company, no jobPosition, no dateApplied, no contact
    };

    const logo = shadow.querySelector('.logo');
    const title = shadow.querySelector('.title');
    const company = shadow.querySelector('.company');
    const date = shadow.querySelector('.date');
    const email = shadow.querySelector('.email');

    expect(logo.src).toContain('data:image/svg+xml;base64');  // fallback logo
    expect(title.textContent).toBe('Untitled Position');
    expect(company.textContent).toBe('Unknown Company');
    expect(date.textContent).toContain('-');
    expect(email.textContent).toContain('No email');
  });

  it('dispatches delete-card event on delete button click', () => {
    // Set dataset & attach listener BEFORE assigning data
    element.dataset.id = 'test-123';
    const listener = jest.fn();
    element.addEventListener('delete-card', listener);

    element.data = {
      logo: '',
      company: '',
      jobPosition: '',
      dateApplied: '',
      contact: {}
    };

    const deleteBtn = shadow.querySelector('.delete-btn');
    deleteBtn.click();

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: 'test-123' }
    }));
  });

  it('dispatches favorite-toggled event on favorite button click', () => {
    element.dataset.id = 'test-456';
    const listener = jest.fn();
    element.addEventListener('favorite-toggled', listener);

    element.data = {
      logo: '',
      company: '',
      jobPosition: '',
      dateApplied: '',
      contact: {}
    };

    const favoriteBtn = shadow.querySelector('.favorite-btn');
    favoriteBtn.click();

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: 'test-456', favorited: true }
    }));
  });
});
