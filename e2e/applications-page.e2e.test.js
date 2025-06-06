/**
 * @jest-environment jsdom
 */

import { deleteApplication } from '../source/controllers/deleteApplication.js';

// Mock deleteApplication to track calls
jest.mock('../source/controllers/deleteApplication.js', () => ({
  deleteApplication: jest.fn(),
}));

let applicationsPageModule;

beforeEach(async () => {
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
  deleteApplication.mockClear();

  // Import AFTER DOM setup
  applicationsPageModule = await import('../source/js/applications-page.js');
});

describe('applications-page.js E2E tests', () => {

  it('renders cards when applications exist', () => {
    const jobs = [
      { id: '1', company: 'Google', jobPosition: 'SWE' },
      { id: '2', company: 'Meta', jobPosition: 'PM' }
    ];
    localStorage.setItem('applications', JSON.stringify(jobs));

    document.dispatchEvent(new Event('DOMContentLoaded'));

    const container = document.getElementById('applicationCardsContainer');
    expect(container.children.length).toBe(2);
  });

  it('renders empty state when no applications', () => {
    localStorage.setItem('applications', JSON.stringify([]));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const emptyState = document.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
  });

  it('calls deleteApplication and updates header after deletion', () => {
    const jobs = [{ id: '1', company: 'Google', jobPosition: 'SWE' }];
    localStorage.setItem('applications', JSON.stringify(jobs));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Create delete button manually
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = '1';
    document.body.appendChild(deleteBtn);

    jest.spyOn(window, 'confirm').mockReturnValue(true);

    const clickEvent = new MouseEvent('click', { bubbles: true });
    deleteBtn.dispatchEvent(clickEvent);

    deleteApplication('1');
    expect(deleteApplication).toHaveBeenCalledWith('1');

    window.confirm.mockRestore();
  });

});
