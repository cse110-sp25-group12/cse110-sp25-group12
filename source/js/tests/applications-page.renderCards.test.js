/**
 * @jest-environment jsdom
 */

import { populateFormForEdit } from '../../js/add_application.js';

describe('populateFormForEdit() unit tests', () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="company">
      <input id="jobPosition">
      <input id="dateApplied">
      <input id="status">
      <input id="positionType">
      <input id="salary">
      <input id="location">
      <input id="contactName">
      <input id="contactEmail">
      <input id="contactPhone">
      <textarea id="notes"></textarea>
    `;
  });

  test('populateFormForEdit fills all fields correctly', () => {
    const job = {
      company: 'Google',
      jobPosition: 'SWE',
      dateApplied: '2025-06-01',
      status: 'Applied',
      positionType: 'Full-Time',
      salary: 120000,
      location: 'Remote',
      contact: {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      },
      notes: 'Follow up next week',
    };

    populateFormForEdit(job);

    expect(document.getElementById('company').value).toBe('Google');
    expect(document.getElementById('jobPosition').value).toBe('SWE');
    expect(document.getElementById('dateApplied').value).toBe('2025-06-01');
    expect(document.getElementById('status').value).toBe('Applied');
    expect(document.getElementById('positionType').value).toBe('Full-Time');
    expect(document.getElementById('salary').value).toBe('120000');
    expect(document.getElementById('location').value).toBe('Remote');
    expect(document.getElementById('contactName').value).toBe('John Doe');
    expect(document.getElementById('contactEmail').value).toBe('john@example.com');
    expect(document.getElementById('contactPhone').value).toBe('1234567890');
    expect(document.getElementById('notes').value).toBe('Follow up next week');
  });

  test('populateFormForEdit handles missing optional fields gracefully', () => {
    const job = {
      company: 'Google',
      jobPosition: 'SWE',
      contact: {},
      notes: null
    };

    populateFormForEdit(job);

    expect(document.getElementById('contactName').value).toBe('');
    expect(document.getElementById('contactEmail').value).toBe('');
    expect(document.getElementById('contactPhone').value).toBe('');
    expect(document.getElementById('notes').value).toBe('');
  });

});
