/**
 * Sorting controls controller for job applications
 * Provides functionality to sort applications by date and status
 */

/**
 * Available sorting options with their display labels
 * @constant {Object}
 */
const SORT_OPTIONS = {
  'date-desc': 'Date Applied (Newest First)',
  'date-asc': 'Date Applied (Oldest First)',
  'favorites-first': 'Favorites First',
  'company-asc': 'Company (A-Z)',
  'company-desc': 'Company (Z-A)'
};

/**
 * Available filter options for status
 * @constant {Array}
 */
const FILTER_STATUS_OPTIONS = [
  'All',
  'Offer',
  'Interviewing',
  'Screening',
  'Applied',
  'Wishlist',
  'Withdrawn',
  'Rejected',
  'Ghosted'
];

// Current filter state
let currentFilter = 'All';

/**
 * Initializes sorting controls when the page loads
 */
export function initSortingControls() {
  document.addEventListener('DOMContentLoaded', () => {
    createSortingAndFilterUI();
    const defaultSort = getSavedSortPreference() || 'date-desc';
    const defaultFilter = getSavedFilterPreference() || 'All';
    currentFilter = defaultFilter;
    applyFilterAndSort(defaultFilter, defaultSort);
  });
}

/**
 * Creates the sorting dropdown and filter buttons UI
 */
function createSortingAndFilterUI() {
  const controlsContainer = document.querySelector('.applications-controls');
  if (!controlsContainer) {
    console.warn('Applications controls container not found');
    return;
  }

  // Clear existing content
  controlsContainer.innerHTML = '';

  // Create main controls wrapper
  const controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'controls-wrapper';

  // Create sort container
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
  if (savedSort && SORT_OPTIONS[savedSort]) {
    sortSelect.value = savedSort;
  }

  // Add event listener for sorting
  sortSelect.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    saveSortPreference(sortValue);
    applyFilterAndSort(currentFilter, sortValue);
  });

  sortContainer.appendChild(sortLabel);
  sortContainer.appendChild(sortSelect);

  // Create filter container
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container';

  const filterLabel = document.createElement('div');
  filterLabel.textContent = 'Filter by Status:';
  filterLabel.className = 'filter-label';

  const filterButtonsContainer = document.createElement('div');
  filterButtonsContainer.className = 'filter-buttons';

  // Create filter buttons
  FILTER_STATUS_OPTIONS.forEach(status => {
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-btn';
    filterBtn.textContent = status;
    filterBtn.dataset.status = status;

    // Set active state for saved filter
    const savedFilter = getSavedFilterPreference();
    if ((savedFilter && savedFilter === status) || (!savedFilter && status === 'All')) {
      filterBtn.classList.add('active');
    }

    // Add click event listener
    filterBtn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // Add active class to clicked button
      filterBtn.classList.add('active');

      // Update current filter and apply
      currentFilter = status;
      saveFilterPreference(status);

      // Get current sort value
      const currentSort = sortSelect.value;
      applyFilterAndSort(status, currentSort);
    });

    filterButtonsContainer.appendChild(filterBtn);
  });

  filterContainer.appendChild(filterLabel);
  filterContainer.appendChild(filterButtonsContainer);

  // Add both containers to wrapper
  controlsWrapper.appendChild(sortContainer);
  controlsWrapper.appendChild(filterContainer);
  controlsContainer.appendChild(controlsWrapper);
}

/**
 * Applies both filtering and sorting to applications and re-renders the page
 * @param {string} filterStatus - The status to filter by ('All' for no filter)
 * @param {string} sortOption - The sorting option key
 */
export function applyFilterAndSort(filterStatus, sortOption) {
  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  if (applications.length === 0) {
    console.log('No applications to filter and sort');
    return;
  }

  // First filter applications
  let filteredApplications = filterApplications(applications, filterStatus);

  // Then sort the filtered results
  const sortedAndFilteredApplications = sortApplications(filteredApplications, sortOption);

  // Re-render the cards with filtered and sorted data
  if (typeof window.renderCards === 'function') {
    window.renderCards(sortedAndFilteredApplications);
  } else {
    console.warn('renderCards function not found, page may need to be refreshed');
    location.reload();
  }
}

/**
 * Filters applications by status
 * @param {Array} applications - Array of application objects
 * @param {string} filterStatus - Status to filter by ('All' for no filter)
 * @returns {Array} Filtered array of applications
 */
function filterApplications(applications, filterStatus) {
  if (filterStatus === 'All') {
    return applications;
  }

  return applications.filter(app => {
    const appStatus = (app.status || '').trim();
    return appStatus === filterStatus;
  });
}

/**
 * Applies sorting to applications and re-renders the page
 * @param {string} sortOption - The sorting option key
 */
export function applySorting(sortOption) {
  applyFilterAndSort(currentFilter, sortOption);
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
    case 'date-desc': {
      // Sort by date applied, newest first
      const dateA = new Date(a.dateApplied || '1970-01-01');
      const dateB = new Date(b.dateApplied || '1970-01-01');
      return dateB - dateA;
    }

    case 'date-asc': {
      // Sort by date applied, oldest first
      const dateA2 = new Date(a.dateApplied || '1970-01-01');
      const dateB2 = new Date(b.dateApplied || '1970-01-01');
      return dateA2 - dateB2;
    }

    case 'favorites-first': {
      // Sort favorites first, then by date (newest first) as secondary criteria
      const isBookmarkedA = a.bookmarked || false;
      const isBookmarkedB = b.bookmarked || false;

      // If bookmark status is different, prioritize bookmarked
      if (isBookmarkedA !== isBookmarkedB) {
        return isBookmarkedB - isBookmarkedA;
      }

      // If both have same bookmark status, sort by date (newest first)
      const dateA = new Date(a.dateApplied || '1970-01-01');
      const dateB = new Date(b.dateApplied || '1970-01-01');
      return dateB - dateA;
    }

    case 'company-asc': {
      // Sort by company A-Z
      const companyA = (a.company || '').toLowerCase();
      const companyB = (b.company || '').toLowerCase();
      return companyA.localeCompare(companyB);
    }

    case 'company-desc': {
      // Sort by company Z-A
      const companyA2 = (a.company || '').toLowerCase();
      const companyB2 = (b.company || '').toLowerCase();
      return companyB2.localeCompare(companyA2);
    }

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

/**
 * Saves the filter preference to localStorage
 * @param {string} filterStatus - The filter status
 */
function saveFilterPreference(filterStatus) {
  localStorage.setItem('filterPreference', filterStatus);
}

/**
 * Retrieves the saved filter preference from localStorage
 * @returns {string|null} The saved filter status or null if not found
 */
function getSavedFilterPreference() {
  return localStorage.getItem('filterPreference');
}

// Make functions available globally for debugging
window.applySorting = applySorting;
window.initSortingControls = initSortingControls;

// Auto-initialize when this module is loaded
initSortingControls();
