/**
 * @jest-environment jsdom
 */

import { updateApplication, updateCardInDOM } from '../updateApplication.js';

// Test suite for updateApplication function
describe('updateApplication', () => {
  // Setup mock localStorage data before each test
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('applications', JSON.stringify([
      { id: '1', company: 'Google', jobPosition: 'SWE' },
      { id: '2', company: 'Meta', jobPosition: 'Intern' }
    ]));
  });

  // Test: should correctly update existing application
  it('updates an existing application correctly', () => {
    const updatedData = { company: 'Alphabet', jobPosition: 'Senior SWE' };
    const result = updateApplication('1', updatedData);

    // Validate returned updated object
    expect(result).toEqual({
      id: '1',
      company: 'Alphabet',
      jobPosition: 'Senior SWE'
    });

    // Validate that localStorage was updated
    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored).toHaveLength(2);
    expect(stored[0]).toEqual({
      id: '1',
      company: 'Alphabet',
      jobPosition: 'Senior SWE'
    });
  });

  // Test: should return null if application ID does not exist
  it('returns null if application ID not found', () => {
    const result = updateApplication('999', { company: 'Test' });
    expect(result).toBeNull();
  });
});

// Setup DOM and localStorage before updateCardInDOM tests
beforeEach(() => {
  // Create DOM structure with one card
  document.body.innerHTML = `
      <div class="application-wrapper" data-id="1">
        <job-app-card data-id="1"></job-app-card>
      </div>
    `;

  // Populate localStorage with test data
  localStorage.clear();
  localStorage.setItem('applications', JSON.stringify([
    { id: '1', company: 'Google', jobPosition: 'SWE' }
  ]));

  // Mock the data setter on job-app-card element
  const card = document.querySelector('job-app-card');
  Object.defineProperty(card, 'data', {
    set: jest.fn(function (value) {
      this._data = value;  // store mock data inside element for validation
    }),
    get: function() {
      return this._data;
    }
  });
});

// Test: updateCardInDOM should update card's data when card exists
it('updates card DOM if card exists', () => {
  updateCardInDOM('1');
  const card = document.querySelector('job-app-card');
  expect(card.data).toEqual({
    id: '1',
    company: 'Google',
    jobPosition: 'SWE'
  });
});

// Test: updateCardInDOM should not throw error if card doesn't exist
it('does nothing if card does not exist', () => {
  document.body.innerHTML = '';
  expect(() => updateCardInDOM('1')).not.toThrow();
});

// Test: updateCardInDOM should not throw error if updated card not found in localStorage
it('does nothing if updated card not found in localStorage', () => {
  localStorage.setItem('applications', JSON.stringify([]));
  expect(() => updateCardInDOM('1')).not.toThrow();
});
