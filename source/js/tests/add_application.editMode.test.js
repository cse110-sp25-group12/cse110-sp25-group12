/**
 * @jest-environment jsdom
 */

import { updateApplication } from '../../controllers/updateApplication.js';

// Mock updateApplication to intercept calls
jest.mock('../../controllers/updateApplication.js', () => ({
  updateApplication: jest.fn(),
}));

// Setup fake timers for redirect logic
beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});

describe('add_application.js edit mode submission', () => {

  let form;

  beforeEach(() => {
    // Set up fresh DOM structure before each test
    document.body.innerHTML = `
      <form id="addApplicationForm">
        <input id="company" value="Meta" />
        <input id="jobPosition" value="PM" />
        <input id="dateApplied" value="2025-06-01" />
        <input id="location" value="Menlo Park" />
        <input id="positionType" value="Contract" />
        <input id="salary" value="150000" />
        <input id="contactName" value="Jane Smith" />
        <input id="contactEmail" value="jane@meta.com" />
        <input id="contactPhone" value="5555555555" />
        <textarea id="notes">Offer pending</textarea>
        <input id="status" value="Offer" />
        <button type="submit">Submit</button>
      </form>
    `;

    // Mock existing edit data in localStorage
    localStorage.setItem('editJobData', JSON.stringify({
      id: 'abc123',
      company: 'Meta',
    }));

    form = document.getElementById('addApplicationForm');
    updateApplication.mockClear();
  });

  test('calls updateApplication in edit mode and clears editJobData', () => {
    // Simulate form submit event
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        company: document.getElementById('company').value,
        jobPosition: document.getElementById('jobPosition').value,
        dateApplied: document.getElementById('dateApplied').value,
        status: document.getElementById('status').value,
        positionType: document.getElementById('positionType').value,
        salary: document.getElementById('salary').value || null,
        location: document.getElementById('location').value,
        bookmarked: false,
        contact: {
          name: document.getElementById('contactName').value,
          email: document.getElementById('contactEmail').value,
          phoneNumber: document.getElementById('contactPhone').value
        },
        notes: document.getElementById('notes').value
      };

      // Add ID and call updateApplication()
      formData.id = 'abc123';
      updateApplication('abc123', formData);
      localStorage.removeItem('editJobData');
    });

    // Trigger submit
    form.dispatchEvent(new Event('submit'));

    // Verify updateApplication called correctly
    expect(updateApplication).toHaveBeenCalledWith('abc123', expect.objectContaining({
      company: 'Meta',
      jobPosition: 'PM',
      dateApplied: '2025-06-01',
      status: 'Offer'
    }));

    // Verify localStorage cleared
    expect(localStorage.getItem('editJobData')).toBeNull();
  });
});
