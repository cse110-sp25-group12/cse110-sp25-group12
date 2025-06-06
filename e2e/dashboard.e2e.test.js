/**
 * @jest-environment jsdom
 */

global.Chart = jest.fn();

import '../source/js/dashboard.js';

describe('dashboard.js E2E - Total Applications Count', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="content-card">
        <div class="content-card-stat"></div>
        <div class="content-card-details">
          <p></p>
        </div>
      </div>
      <div class="content-card">
        <div class="content-card-stat"></div>
        <div class="content-card-details">
          <p></p>
        </div>
      </div>
      <div class="content-card">
        <div class="content-card-stat"></div>
        <div class="content-card-details">
          <p></p>
        </div>
      </div>
      <div class="content-card">
        <div class="content-card-stat"></div>
        <div class="content-card-details">
          <p></p>
        </div>
      </div>

      <canvas id="applicationsChart"></canvas>
      <canvas id="statusChart"></canvas>
    `;

    localStorage.clear();
  });

  it('renders correct total application count', () => {
    const mockApplications = [
      { id: '1', company: 'Google' },
      { id: '2', company: 'Meta' },
      { id: '3', company: 'Amazon' }
    ];

    localStorage.setItem('applications', JSON.stringify(mockApplications));

    document.dispatchEvent(new Event('DOMContentLoaded'));

    const totalApplicationsEl = document.querySelector(
      '.content-card:nth-child(1) .content-card-stat'
    );

    expect(totalApplicationsEl.textContent).toBe('3');
  });
});
