/**
 *  Sorting Controls Component
 *  Date, Status, Bookmarked options
 */
/**
 * Sorting controls controller for job applications
 * cse110-sp25-group12/source/controller/sorting-controls.js
 */
/**
 * Available sorting options with their display labels
 * @constant {Object}
 */
const SORT_OPTIONS = {
  'date-desc': 'Newest First',
  'date-asc': 'Oldest First',
  'status-asc': 'Status (A-Z)',
  'status-desc': 'Status (Z-A)',
  'bookmarked': 'Bookmarked First',
  'not-bookmarked': 'Not Bookmarked'
};

/**
 * Initializes sorting controls and applies default sorting
 * @param {Function} renderCallback - Callback to execute after sorting
 */
export function initSortingControls(renderCallback) {
  createSortingUI();
  const defaultSort = getSavedSortPreference() || 'date-desc';
  applySorting(defaultSort, renderCallback);
}

/**
 * Creates the sorting dropdown UI element
 */
function createSortingUI() {
  const controlsContainer = document.querySelector('.controls-container');
  if (!controlsContainer) return;

  const sortContainer = document.createElement('div');
  sortContainer.className = 'sort-container';

  const sortLabel = document.createElement('label');
  sortLabel.textContent = 'Sort by:';
  sortLabel.htmlFor = 'sort-select';
  sortLabel.className = 'sort-label';

  const sortSelect = document.createElement('select');
  sortSelect.id = 'sort-select';
  sortSelect.className = 'sort-select';

  // Add options to dropdown
  Object.entries(SORT_OPTIONS).forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    sortSelect.appendChild(option);
  });

  // Set saved preference if exists
  const savedSort = getSavedSortPreference();
  if (savedSort) {
    sortSelect.value = savedSort;
  }

  // Add event listener
  sortSelect.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    saveSortPreference(sortValue);
    applySorting(sortValue);
  });

  sortContainer.appendChild(sortLabel);
  sortContainer.appendChild(sortSelect);
  controlsContainer.appendChild(sortContainer);
}

/**
 * Applies sorting to applications and re-renders
 * @param {string} sortOption - The sorting option key
 * @param {Function} [renderCallback] - Callback to execute after sorting
 */
export function applySorting(sortOption, renderCallback) {
  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  if (cards.length === 0) return;

  const sortedCards = sortApplications(cards, sortOption);
  localStorage.setItem('applications', JSON.stringify(sortedCards));

  if (renderCallback && typeof renderCallback === 'function') {
    renderCallback();
  }
}

/**
 * Sorts applications based on the selected option
 * @param {Array} applications - Array of application objects
 * @param {string} sortOption - The sorting option key
 * @returns {Array} Sorted array of applications
 */
function sortApplications(applications, sortOption) {
  return [...applications].sort((a, b) => {
    switch (sortOption) {
      case 'date-desc':
        return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
      case 'date-asc':
        return new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id);
      case 'status-asc':
        return (a.status || '').localeCompare(b.status || '');
      case 'status-desc':
        return (b.status || '').localeCompare(a.status || '');
      case 'bookmarked':
        // Assuming there's a 'bookmarked' boolean property
        return (b.bookmarked === true ? 1 : 0) - (a.bookmarked === true ? 1 : 0);
      case 'not-bookmarked':
        return (a.bookmarked === true ? 1 : 0) - (b.bookmarked === true ? 1 : 0);
      default:
        return 0;
    }
  });
}

/**
 * Saves the sorting preference to localStorage
 * @param {string} sortOption - The sorting option key
 */
function saveSortPreference(sortOption) {
  localStorage.setItem('sortPreference', sortOption);
}

/**
 * Retrieves the saved sorting preference from localStorage
 * @returns {string|null} The saved sorting option or null if not found
 */
function getSavedSortPreference() {
  return localStorage.getItem('sortPreference');
}
