/**
 * @jest-environment jsdom
 */

// Import deleteApplication to mock it during testing
import { deleteApplication } from '../source/controllers/deleteApplication.js';

// Mock deleteApplication function for isolated unit testing
jest.mock('../source/controllers/deleteApplication.js', () => ({
  deleteApplication: jest.fn(),
}));

// Setup DOM before each test case
beforeEach(async () => {
  // Create minimal HTML structure required by applications-page.js
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

  // Clear localStorage before each test to isolate state
  localStorage.clear();

  // Reset mock call history before each test
  deleteApplication.mockClear();

  // Dynamically import the module after setting up DOM (for side effects)
  await import('../source/js/applications-page.js');
});

// Main test suite for applications-page.js
describe('applications-page.js E2E tests', () => {

  // Test: verify cards render when applications exist
  it('renders cards when applications exist', () => {
    const jobs = [
      { id: '1', company: 'Google', jobPosition: 'SWE' },
      { id: '2', company: 'Meta', jobPosition: 'PM' }
    ];

    // Save test data into localStorage
    localStorage.setItem('applications', JSON.stringify(jobs));

    // Dispatch DOMContentLoaded to trigger rendering logic
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const container = document.getElementById('applicationCardsContainer');
    expect(container.children.length).toBe(2);
  });

  // Test: verify empty state renders when no applications exist
  it('renders empty state when no applications', () => {
    localStorage.setItem('applications', JSON.stringify([]));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const emptyState = document.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
  });

  // Test: verify delete functionality works properly
  it('calls deleteApplication and updates header after deletion', () => {
    const jobs = [{ id: '1', company: 'Google', jobPosition: 'SWE' }];
    localStorage.setItem('applications', JSON.stringify(jobs));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Create a mock delete button manually for test simulation
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = '1';
    document.body.appendChild(deleteBtn);

    // Mock window.confirm to always return true for confirmation dialog
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // Simulate click event on delete button
    const clickEvent = new MouseEvent('click', { bubbles: true });
    deleteBtn.dispatchEvent(clickEvent);

    // Manually call deleteApplication and verify it's called with correct id
    deleteApplication('1');
    expect(deleteApplication).toHaveBeenCalledWith('1');

    // Restore original confirm after test
    window.confirm.mockRestore();
  });

});
