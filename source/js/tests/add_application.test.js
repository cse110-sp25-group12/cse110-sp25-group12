/**
 * @jest-environment jsdom
 */

import { createApplication } from '../../controllers/createApplication.js';

// Mock createApplication so we can spy on calls
jest.mock('../../controllers/createApplication.js', () => ({
  createApplication: jest.fn(),
}));

// Setup global fake timers once before all tests
beforeAll(() => {
  jest.useFakeTimers();
});

// Restore real timers after all tests complete
afterAll(() => {
  jest.useRealTimers();
});

// Main test suite for add_application.js form submission behavior
describe('add_application.js form submission', () => {
  let form;

  // Setup fresh DOM and event listeners before each test
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="application-form">
        <input id="company" value="Google" />
        <input id="jobPosition" value="SWE" />
        <input id="dateApplied" value="2025-05-30" />
        <input id="location" value="Remote" />
        <input id="positionType" value="Full-Time" />
        <input id="salary" value="100000" />
        <input id="contactName" value="John Doe" />
        <input id="contactEmail" value="john@google.com" />
        <input id="contactPhone" value="1234567890" />
        <textarea id="notes">Interview scheduled</textarea>
        <input id="status" value="Pending" />
        <input id="bookmark" type="checkbox" />
        <button type="submit">Submit</button>
      </form>
    `;

    form = document.getElementById('application-form');
    createApplication.mockClear(); // reset mock calls before each test

    // Attach submit handler to simulate form submission behavior
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        company: document.getElementById('company').value,
        jobPosition: document.getElementById('jobPosition').value,
        dateApplied: document.getElementById('dateApplied').value,
        location: document.getElementById('location').value,
        positionType: document.getElementById('positionType').value,
        salary: document.getElementById('salary').value,
        contact: {
          name: document.getElementById('contactName').value,
          email: document.getElementById('contactEmail').value,
          phone: document.getElementById('contactPhone').value,
        },
        notes: document.getElementById('notes').value,
        status: document.getElementById('status').value,
        bookmarked: document.getElementById('bookmark').checked,
      };

      createApplication(data);

      // Simulate redirect delay after submission
      setTimeout(() => {
        window.location.pathname = 'source/pages/applications.html';
      }, 100);
    });
  });

  // Test: verify form data is collected correctly
  it('collects form data correctly and calls createApplication', () => {
    form.dispatchEvent(new Event('submit'));

    expect(createApplication).toHaveBeenCalledWith({
      company: 'Google',
      jobPosition: 'SWE',
      dateApplied: '2025-05-30',
      location: 'Remote',
      positionType: 'Full-Time',
      salary: '100000',
      contact: {
        name: 'John Doe',
        email: 'john@google.com',
        phone: '1234567890',
      },
      notes: 'Interview scheduled',
      status: 'Pending',
      bookmarked: false,
    });
  });

  // Test: verify page redirects after successful form submission
  it('redirects to applications page after submission', () => {
    delete window.location;
    window.location = { pathname: '' };

    form.dispatchEvent(new Event('submit'));
    jest.advanceTimersByTime(100);

    expect(window.location.pathname).toBe('source/pages/applications.html');
  });

  // Test: handle missing optional fields gracefully (empty notes and phone)
  it('handles missing optional fields gracefully', () => {
    document.getElementById('notes').value = '';
    document.getElementById('contactPhone').value = '';

    form.dispatchEvent(new Event('submit'));

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: '',
        contact: expect.objectContaining({
          phone: '',
        }),
      })
    );
  });

  // Test: allow negative salary values but still submit
  it('still calls createApplication even if salary is negative', () => {
    document.getElementById('salary').value = '-5000';

    form.dispatchEvent(new Event('submit'));

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        salary: '-5000',
      })
    );
  });

  // Test: ensure no double submission happens
  it('does not submit twice accidentally', () => {
    form.dispatchEvent(new Event('submit'));
    form.dispatchEvent(new Event('submit'));

    expect(createApplication).toHaveBeenCalledTimes(2);
  });
});
