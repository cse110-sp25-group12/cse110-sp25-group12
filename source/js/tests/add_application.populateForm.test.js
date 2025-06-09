/**
 * @jest-environment jsdom
 */

import * as addAppModule from '../../js/add_application.js'; // Import full module to access non-exported functions

describe('populateFormForEdit() unit tests', () => {

  // Setup fresh DOM before each test
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="company" />
      <input id="jobPosition" />
      <input id="dateApplied" />
      <input id="status" />
      <input id="positionType" />
      <input id="salary" />
      <input id="location" />
      <input id="contactName" />
      <input id="contactEmail" />
      <input id="contactPhone" />
      <input id="notes" />
    `;
  });

  // Test full data population
  test('populateFormForEdit fills all fields correctly', () => {
    const job = {
      company: 'Google',
      jobPosition: 'SWE',
      dateApplied: '2025-05-01',
      status: 'Pending',
      positionType: 'Full-Time',
      salary: 100000,
      location: 'Remote',
      contact: {
        name: 'John Doe',
        email: 'john@google.com',
        phoneNumber: '123456'
      },
      notes: 'Prepare for interview'
    };

    addAppModule.populateFormForEdit(job);  // Directly call function

    // Verify each field populated correctly
    expect(document.getElementById('company').value).toBe('Google');
    expect(document.getElementById('jobPosition').value).toBe('SWE');
    expect(document.getElementById('dateApplied').value).toBe('2025-05-01');
    expect(document.getElementById('status').value).toBe('Pending');
    expect(document.getElementById('positionType').value).toBe('Full-Time');
    expect(document.getElementById('salary').value).toBe('100000');
    expect(document.getElementById('location').value).toBe('Remote');
    expect(document.getElementById('contactName').value).toBe('John Doe');
    expect(document.getElementById('contactEmail').value).toBe('john@google.com');
    expect(document.getElementById('contactPhone').value).toBe('123456');
    expect(document.getElementById('notes').value).toBe('Prepare for interview');
  });

  // Test for missing optional fields (null safety)
  test('populateFormForEdit handles missing optional fields gracefully', () => {
    const job = {
      company: 'Amazon',
      jobPosition: 'PM',
      contact: {},   // missing contact
      notes: null    // missing notes
    };

    addAppModule.populateFormForEdit(job);  // call function with partial data

    // Verify optional fields fallback to empty string
    expect(document.getElementById('contactName').value).toBe('');
    expect(document.getElementById('contactEmail').value).toBe('');
    expect(document.getElementById('contactPhone').value).toBe('');
    expect(document.getElementById('notes').value).toBe('');
  });

});
