/**
 * @jest-environment jsdom
 */

import '../../components/job-card.js';

// ✅ Mock deleteApplication so no real deletes happen
jest.mock('../../controllers/deleteApplication.js', () => ({
  deleteApplication: jest.fn(),
}));

let applicationsPage;

beforeEach(async () => {
  // ✅ Build DOM before import
  document.body.innerHTML = `
    <button id="editApplicationBtn"></button>
    <div id="applicationCardsContainer"></div>
    <div class="main-header"><h1>All Applications</h1></div>
    <div id="appDetailsModal" class="modal">
      <button class="close-btn"></button>
      <div id="modal-title"></div>
      <div id="modal-company"></div>
      <div id="modal-type"></div>
      <div id="modal-salary"></div>
      <div id="modal-location"></div>
      <div id="modal-date"></div>
      <div id="modal-status"></div>
      <div id="modal-contact"></div>
      <div id="modal-phone"></div>
      <div id="modal-notes"></div>
      <ul id="modal-important-dates"></ul>
    </div>
  `;

  localStorage.clear();
  jest.clearAllMocks();

  // ✅ Dynamically import AFTER DOM setup
  applicationsPage = await import('../../js/applications-page.js');
});

describe('applications-page.js extra unit tests for coverage', () => {

    test('updateCardInDOM updates card if ID exists', () => {
        // ✅ Create wrapper + card
        const wrapper = document.createElement('div');
        wrapper.classList.add('application-wrapper');
        document.getElementById('applicationCardsContainer').appendChild(wrapper);
      
        const card = document.createElement('job-app-card');
        card.dataset.id = '123';
      
        // ✅ Manually define .data property to simulate custom element behavior
        Object.defineProperty(card, 'data', {
          value: undefined,
          writable: true
        });
      
        wrapper.appendChild(card);
      
        // ✅ Put matching data in localStorage
        localStorage.setItem('applications', JSON.stringify([
          { id: '123', company: 'Test' }
        ]));
      
        // ✅ Call function
        applicationsPage.updateCardInDOM('123');
      
        // ✅ Now card.data is assigned by updateCardInDOM()
        expect(card.data).toEqual({ id: '123', company: 'Test' });
      });
      

  test('updateCardInDOM does nothing if card not found', () => {
    applicationsPage.updateCardInDOM('nonexistent');
  });

  test('loadMockData works and adds mock data', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    window.loadMockData();   // ✅ window instead of applicationsPage

    const apps = JSON.parse(localStorage.getItem('applications'));
    expect(apps.length).toBeGreaterThan(0);

    alertSpy.mockRestore();
  });

  test('clearAllData clears localStorage after confirm', () => {
    localStorage.setItem('applications', JSON.stringify([{ id: '1' }]));

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    window.clearAllData();   // ✅ window instead of applicationsPage

    expect(localStorage.getItem('applications')).toBeNull();

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });

  test('openModal() populates modal with job data', () => {
    // ✅ Get openModal directly from window
    const openModal = window.openModal;
  
    const job = {
      jobPosition: 'SWE',
      company: 'Google',
      jobType: 'Full-Time',
      salary: 150000,
      location: 'Remote',
      dateApplied: '2025-05-01',
      status: 'Pending',
      contact: { email: 'john@google.com', phoneNumber: '123456' },
      notes: 'Follow up soon',
      importantDates: { 'Interview': '2025-06-01' }
    };
  
    openModal(job);
  
    expect(document.getElementById('modal-company').textContent).toBe('Google');
    expect(document.getElementById('modal-salary').textContent).toBe('$150,000');
    expect(document.querySelector('#modal-important-dates li').textContent).toBe('Interview: 2025-06-01');
  });
  
  test('openModal() handles missing salary and contact gracefully', () => {
    const openModal = window.openModal;
  
    const job = {
      jobPosition: 'PM',
      company: 'Amazon',
      salary: null,
      contact: {}
    };
  
    openModal(job);
  
    expect(document.getElementById('modal-salary').textContent).toBe('$-');
    expect(document.getElementById('modal-contact').textContent).toBe('');
  });
  
  test('setupModal() closes modal on Escape key', () => {
    const setupModal = window.setupModal;
  
    setupModal();
    const modal = document.getElementById('appDetailsModal');
    modal.classList.add('show');
  
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  
    expect(modal.classList.contains('show')).toBe(false);
  });
  
  test('setupModal() closes modal when backdrop clicked', () => {
    const setupModal = window.setupModal;
  
    setupModal();
    const modal = document.getElementById('appDetailsModal');
    modal.classList.add('show');
  
    modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  
    expect(modal.classList.contains('show')).toBe(false);
  });
  
  test('setupModal() closes modal on close button click', () => {
    const setupModal = window.setupModal;
  
    setupModal();
    const modal = document.getElementById('appDetailsModal');
    modal.classList.add('show');
  
    modal.querySelector('.close-btn').click();
  
    expect(modal.classList.contains('show')).toBe(false);
  });
});

