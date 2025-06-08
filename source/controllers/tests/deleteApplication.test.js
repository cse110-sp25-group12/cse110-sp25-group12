/**
 * @jest-environment jsdom
 */

// Import the function to test
import { deleteApplication } from '../deleteApplication.js';

// Main test suite for deleteApplication
describe('deleteApplication', () => {

  // Reset DOM and localStorage before each test for isolation
  beforeEach(() => {
    localStorage.clear();

    // Set up initial DOM structure with one wrapper and card element
    document.body.innerHTML = `
      <div class="application-wrapper" data-id="1">
        <job-app-card data-id="1"></job-app-card>
      </div>
    `;

    // Populate localStorage with two sample applications
    localStorage.setItem('applications', JSON.stringify([
      { id: '1', company: 'Test Co' },
      { id: '2', company: 'Another Co' }
    ]));
  });

  // Test: correct item should be removed from localStorage
  it('removes the correct item from localStorage', () => {
    deleteApplication('1');
    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored).toHaveLength(1);  // Only one item should remain
    expect(stored[0].id).toBe('2');  // The remaining item should be id '2'
  });

  // Test: wrapper element should be removed from DOM after animation delay
  it('removes the wrapper element from DOM after animation', () => {
    jest.useFakeTimers();  // Mock timers to control animation delay
    deleteApplication('1');

    // Immediately after calling delete, wrapper still exists (before timeout)
    const wrapper = document.querySelector('.application-wrapper[data-id="1"]');
    expect(wrapper).not.toBeNull();

    // Advance time to simulate animation duration
    jest.advanceTimersByTime(300);

    // After timeout, wrapper should be removed
    const removed = document.querySelector('.application-wrapper[data-id="1"]');
    expect(removed).toBeNull();

    jest.useRealTimers();
  });

  // Test: fallback behavior when wrapper doesn't exist (only job-app-card exists)
  it('removes just the card element if wrapper is not found', () => {
    // Reset DOM to only have job-app-card without wrapper
    document.body.innerHTML = '<job-app-card data-id="1"></job-app-card>';
    localStorage.setItem('applications', JSON.stringify([{ id: '1', company: 'Test Co' }]));

    deleteApplication('1');

    // The job-app-card itself should be removed
    const card = document.querySelector('job-app-card[data-id="1"]');
    expect(card).toBeNull();
  });
});
