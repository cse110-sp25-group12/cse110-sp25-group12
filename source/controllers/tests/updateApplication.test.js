/**
 * @jest-environment jsdom
 */

import { updateApplication, updateCardInDOM } from '../updateApplication.js';

describe('updateApplication', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('applications', JSON.stringify([
      { id: '1', company: 'Google', jobPosition: 'SWE' },
      { id: '2', company: 'Meta', jobPosition: 'Intern' }
    ]));
  });

  it('updates an existing application correctly', () => {
    const updatedData = { company: 'Alphabet', jobPosition: 'Senior SWE' };
    const result = updateApplication('1', updatedData);

    expect(result).toEqual({
      id: '1',
      company: 'Alphabet',
      jobPosition: 'Senior SWE'
    });

    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored).toHaveLength(2);
    expect(stored[0]).toEqual({
      id: '1',
      company: 'Alphabet',
      jobPosition: 'Senior SWE'
    });
  });

  it('returns null if application ID not found', () => {
    const result = updateApplication('999', { company: 'Test' });
    expect(result).toBeNull();
  });
});


beforeEach(() => {
    document.body.innerHTML = `
      <div class="application-wrapper" data-id="1">
        <job-app-card data-id="1"></job-app-card>
      </div>
    `;
  
    localStorage.clear();
    localStorage.setItem('applications', JSON.stringify([
      { id: '1', company: 'Google', jobPosition: 'SWE' }
    ]));
  
    const card = document.querySelector('job-app-card');
    // MOCK the setter properly:
    Object.defineProperty(card, 'data', {
      set: jest.fn(function (value) {
        // store the value into the element so we can test against it later
        this._data = value;
      }),
      get: function() {
        return this._data;
      }
    });
  });


  it('updates card DOM if card exists', () => {
    updateCardInDOM('1');
    const card = document.querySelector('job-app-card');
    expect(card.data).toEqual({
      id: '1',
      company: 'Google',
      jobPosition: 'SWE'
    });
  });

  it('does nothing if card does not exist', () => {
    document.body.innerHTML = '';
    expect(() => updateCardInDOM('1')).not.toThrow();
  });

  it('does nothing if updated card not found in localStorage', () => {
    localStorage.setItem('applications', JSON.stringify([]));
    expect(() => updateCardInDOM('1')).not.toThrow();
  });