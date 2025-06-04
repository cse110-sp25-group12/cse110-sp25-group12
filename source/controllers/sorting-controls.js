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
  'status-priority': 'Status (Most Important First)',
  'status-reverse': 'Status (Least Important First)',
  'company-asc': 'Company (A-Z)',
  'company-desc': 'Company (Z-A)'
};

/**
 * Status priority order - most important first
 * @constant {Object}
 */
const STATUS_PRIORITY = {
  'Offer': 1,
  'Interviewing': 2,
  'Screening': 3,
  'Applied': 4,
  'Wishlist': 5,
  'Withdrawn': 6,
  'Rejected': 7,
  'Ghosted': 8
};

/**
 * Initializes sorting controls when the page loads
 */
export function initSortingControls() {
  document.addEventListener('DOMContentLoaded', () => {
    createSortingUI();
    const defaultSort = getSavedSortPreference() || 'date-desc';
    applySorting(defaultSort);
  });
}

/**
 * Creates the sorting dropdown UI element
 */
function createSortingUI() {
  const controlsContainer = document.querySelector('.applications-controls');
  if (!controlsContainer) {
    console.warn('Applications controls container not found');
    return;
  }

  // Clear existing content
  controlsContainer.innerHTML = '';

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
 * Applies sorting to applications and re-renders the page
 * @param {string} sortOption - The sorting option key
 */
export function applySorting(sortOption) {
  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  if (applications.length === 0) {
    console.log('No applications to sort');
    return;
  }

  const sortedApplications = sortApplications(applications, sortOption);
  localStorage.setItem('applications', JSON.stringify(sortedApplications));

  // Re-render the cards with sorted data
  if (typeof window.renderCards === 'function') {
    window.renderCards(sortedApplications);
  } else {
    // Try to find and call renderCards from the global scope
    const renderCards = window.renderCards || document.renderCards;
    if (renderCards) {
      renderCards(sortedApplications);
    } else {
      console.warn('renderCards function not found, page may need to be refreshed');
      location.reload();
    }
  }
}

/**
 * Gets the priority value for a status
 * @param {string} status - The status string
 * @returns {number} Priority value (lower = higher priority)
 */
function getStatusPriority(status) {
  const normalizedStatus = (status || '').trim();
  return STATUS_PRIORITY[normalizedStatus] || 999; // Unknown statuses go to the end
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
        // Sort by date applied, newest first
        const dateA = new Date(a.dateApplied || '1970-01-01');
        const dateB = new Date(b.dateApplied || '1970-01-01');
        return dateB - dateA;
        
      case 'date-asc':
        // Sort by date applied, oldest first
        const dateA2 = new Date(a.dateApplied || '1970-01-01');
        const dateB2 = new Date(b.dateApplied || '1970-01-01');
        return dateA2 - dateB2;
        
      case 'status-priority':
        // Sort by status priority (most important first)
        const priorityA = getStatusPriority(a.status);
        const priorityB = getStatusPriority(b.status);
        return priorityA - priorityB;
        
      case 'status-reverse':
        // Sort by status priority (least important first)
        const priorityA2 = getStatusPriority(a.status);
        const priorityB2 = getStatusPriority(b.status);
        return priorityB2 - priorityA2;
        
      case 'company-asc':
        // Sort by company A-Z
        const companyA = (a.company || '').toLowerCase();
        const companyB = (b.company || '').toLowerCase();
        return companyA.localeCompare(companyB);
        
      case 'company-desc':
        // Sort by company Z-A
        const companyA2 = (a.company || '').toLowerCase();
        const companyB2 = (b.company || '').toLowerCase();
        return companyB2.localeCompare(companyA2);
        
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

// Make functions available globally for debugging
window.applySorting = applySorting;
window.initSortingControls = initSortingControls;

// Auto-initialize when this module is loaded
initSortingControls();
