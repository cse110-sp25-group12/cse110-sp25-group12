/**
 * @jest-environment jsdom
 */

import { deleteApplication } from '../deleteApplication.js';

describe('deleteApplication', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div class="application-wrapper" data-id="1">
        <job-app-card data-id="1"></job-app-card>
      </div>
    `;
    localStorage.setItem('applications', JSON.stringify([
      { id: '1', company: 'Test Co' },
      { id: '2', company: 'Another Co' }
    ]));
  });

  it('removes the correct item from localStorage', () => {
    deleteApplication('1');
    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('2');
  });

  it('removes the wrapper element from DOM after animation', () => {
    jest.useFakeTimers();
    deleteApplication('1');

    const wrapper = document.querySelector('.application-wrapper[data-id="1"]');
    expect(wrapper).not.toBeNull();

    jest.advanceTimersByTime(300);

    const removed = document.querySelector('.application-wrapper[data-id="1"]');
    expect(removed).toBeNull();

    jest.useRealTimers();
  });

  it('removes just the card element if wrapper is not found', () => {
    document.body.innerHTML = `<job-app-card data-id="1"></job-app-card>`;
    localStorage.setItem('applications', JSON.stringify([{ id: '1', company: 'Test Co' }]));

    deleteApplication('1');

    const card = document.querySelector('job-app-card[data-id="1"]');
    expect(card).toBeNull();
  });
});
