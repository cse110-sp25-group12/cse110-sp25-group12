/**
 * @jest-environment jsdom
 */

import { createApplication } from '../source/controllers/createApplication.js';

jest.mock('../source/controllers/createApplication.js', () => ({
  createApplication: jest.fn(),
}));

// Import file you're testing
import '../source/js/add_application.js';

describe('Add Application E2E', () => {
  let form;

  beforeEach(() => {
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
    form = document.getElementById('addApplicationForm');
    createApplication.mockClear();

    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('submits form and calls createApplication with correct data', () => {
    form.dispatchEvent(new Event('submit', { bubbles: true }));

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

  it('redirects to applications page after submission', () => {
    delete window.location;
    window.location = { pathname: '' };

    jest.useFakeTimers();
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(100);

    expect(window.location.pathname).toBe('source/pages/applications.html');
    jest.useRealTimers();
  });
});
