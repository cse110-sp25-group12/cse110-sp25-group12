/**
 * @jest-environment jsdom
 */

import '../job-card.js';
describe('JobAppCard component', () => {
  beforeEach(() => {
    document.body.innerHTML = `<job-app-card></job-app-card>`;

    const element = document.querySelector('job-app-card');
    element.data = {
      logo: 'https://example.com/logo.png',
      company: 'Test Company',
      jobPosition: 'Frontend Engineer',
      dateApplied: '2025-05-01',
      contact: {
        email: 'hr@test.com'
      }
    };
  });

  it('renders correct company and job title', () => {
    const card = document.querySelector('job-app-card');
    const shadow = card.shadowRoot;

    const company = shadow.querySelector('.company');
    const title = shadow.querySelector('.title');

    expect(company.textContent).toBe('Test Company');
    expect(title.textContent).toBe('Frontend Engineer');
  });

  it('shows correct date and email', () => {
    const card = document.querySelector('job-app-card');
    const shadow = card.shadowRoot;

    const date = shadow.querySelector('.date');
    const email = shadow.querySelector('.email');

    expect(date.textContent).toContain('2025-05-01');
    expect(email.textContent).toContain('hr@test.com');
  });

  it('toggles favorite icon on click', () => {
    const card = document.querySelector('job-app-card');
    const shadow = card.shadowRoot;

    const favoriteBtn = shadow.querySelector('.favorite');
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
});
