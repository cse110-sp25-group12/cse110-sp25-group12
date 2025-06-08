/**
 * @jest-environment jsdom
 */

// Mock Chart.js globally to prevent errors during test since charts require canvas context
global.Chart = jest.fn();

// Import the dashboard module (this will automatically hook into DOMContentLoaded)
import '../source/js/dashboard.js';

// Test suite for dashboard.js E2E logic (specifically total applications display)
describe('dashboard.js E2E - Total Applications Count', () => {

  // Setup DOM before each test
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

    // Clear localStorage to ensure clean state before every test
    localStorage.clear();
  });

  // Test: Verify total applications count is displayed correctly on dashboard
  it('renders correct total application count', () => {
    const mockApplications = [
      { id: '1', company: 'Google' },
      { id: '2', company: 'Meta' },
      { id: '3', company: 'Amazon' }
    ];

    // Inject test data into localStorage
    localStorage.setItem('applications', JSON.stringify(mockApplications));

    // Trigger DOMContentLoaded to simulate full page load and initialize dashboard logic
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Grab the total applications display element (first content-card-stat block)
    const totalApplicationsEl = document.querySelector(
      '.content-card:nth-child(1) .content-card-stat'
    );

    // Assert that the displayed count matches the number of mock applications
    expect(totalApplicationsEl.textContent).toBe('3');
  });
});
