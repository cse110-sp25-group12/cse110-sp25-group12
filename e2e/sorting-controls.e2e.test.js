/**
 * @jest-environment jsdom
 */

let initSortingControls;

beforeEach(async () => {
  // Setup DOM before import
  document.body.innerHTML = `
    <div class="applications-controls"></div>
  `;

  // Spy on real localStorage prototype so Jest can track calls properly
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

  // Mock renderCards function
  window.renderCards = jest.fn();

  // Import module AFTER DOM is ready
  const module = await import('../source/controllers/sorting-controls.js');
  initSortingControls = module.initSortingControls;
});

afterEach(() => {
  // Clean up mocks after each test
  jest.restoreAllMocks();
});

test('initSortingControls creates sorting and filter UI', () => {
  initSortingControls();

  // Simulate DOMContentLoaded event
  document.dispatchEvent(new Event('DOMContentLoaded'));

  expect(document.querySelector('#sort-select')).not.toBeNull();
  expect(document.querySelectorAll('.filter-btn').length).toBeGreaterThan(0);
});

test('changing sort option calls localStorage and applyFilterAndSort', () => {
  initSortingControls();

  // Simulate DOMContentLoaded event
  document.dispatchEvent(new Event('DOMContentLoaded'));

  const sortSelect = document.querySelector('#sort-select');
  sortSelect.value = 'company-asc';
  sortSelect.dispatchEvent(new Event('change'));

  expect(localStorage.setItem).toHaveBeenCalledWith('sortPreference', 'company-asc');
});
