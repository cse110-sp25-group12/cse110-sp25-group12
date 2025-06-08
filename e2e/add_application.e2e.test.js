/**
 * @jest-environment jsdom
 */

// Import createApplication function which we mock for testing
import { createApplication } from '../source/controllers/createApplication.js';

// Mock createApplication to isolate form behavior during test
jest.mock('../source/controllers/createApplication.js', () => ({
  createApplication: jest.fn(),
}));

// Import the module under test (form submission logic)
import '../source/js/add_application.js';

// Main test suite for Add Application page
describe('Add Application E2E', () => {
  let form;

  // Set up DOM before each test
  beforeEach(() => {
    // Create a mock form structure in the DOM
    document.body.innerHTML = `
      <form id="addApplicationForm">
        <input id="company" value="Google" />
        <input id="jobPosition" value="SWE" />
        <input id="dateApplied" value="2025-06-03" />
        <input id="status" value="Pending" />
        <input id="positionType" value="Full-Time" />
        <input id="salary" value="120000" />
        <input id="location" value="Remote" />
        <input id="contactName" value="John Doe" />
        <input id="contactEmail" value="john@google.com" />
        <input id="contactPhone" value="1234567890" />
        <textarea id="notes">Interview scheduled</textarea>
        <button type="submit">Submit</button>
      </form>
    `;

    // Grab the form element for testing
    form = document.getElementById('addApplicationForm');

    // Clear mock call history before each test
    createApplication.mockClear();

    // Simulate page load
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  // Test form submission calls createApplication with correct payload
  it('submits form and calls createApplication with correct data', () => {
    // Simulate form submit event
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Verify that createApplication was called with expected object
    expect(createApplication).toHaveBeenCalledWith({
      company: 'Google',
      jobPosition: 'SWE',
      dateApplied: '2025-06-03',
      status: 'Pending',
      positionType: 'Full-Time',
      salary: '120000',
      location: 'Remote',
      bookmarked: false,
      contact: {
        name: 'John Doe',
        email: 'john@google.com',
        phoneNumber: '1234567890',
      },
      notes: 'Interview scheduled',
    });
  });

  // Test redirection after successful submission
  it('redirects to applications page after submission', () => {
    // Mock window.location to track navigation
    delete window.location;
    window.location = { pathname: '' };

    // Use fake timers to control setTimeout behavior
    jest.useFakeTimers();

    // Simulate form submission
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Advance time to trigger setTimeout callback
    jest.advanceTimersByTime(100);

    // Expect redirection to occur
    expect(window.location.pathname).toBe('source/pages/applications.html');

    // Restore real timers after test
    jest.useRealTimers();
  });
});
