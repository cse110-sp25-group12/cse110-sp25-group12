/**
 * Application Controller
 * Handles CRUD operations for job applications
 */

// In-memory cache of applications
let applications = [];

/**
 * Load applications from (applications.json) JSON file
 * @returns {Promise<Array>} Promise resolving to applications array
 */
export async function loadApplications() {
  try {
    const response = await fetch('../data/applications.json');
    if (!response.ok) throw new Error('Failed to fetch applications');
    
    applications = await response.json();
    return applications;
  } catch (error) {
    console.error('Error loading applications.json, fallback to localStorage(Which is empty):', error);
    // Fall back to localStorage if file can't be loaded
    return loadFromLocalStorage();
  }
}

/**
 * Get applications from localStorage, if not found, return empty array
 * @returns {Array} Array of application objects
 */
export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('jobApplications');
    applications = data ? JSON.parse(data) : [];
    return applications;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
}

/**
 * Save applications to localStorage(Not saved to applications.json)
 * @returns {boolean} Success status
 */
export function saveToLocalStorage() {
  try {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Get all applications
 * @returns {Array} Array of application objects
 */
export function getAllApplications() {
  return [...applications]; // Return a copy to prevent mutation
}

/**
 * Get application by ID
 * @param {number} id - Application ID
 * @returns {Object|null} Application object or null if not found
 */
export function getApplicationById(id) {
  return applications.find(app => app.id === id) || null;
}

/**
 * Create new application
 * @param {Object} applicationData - Application data
 * @returns {Object} Created application with ID
 */
export function createApplication(applicationData) {
  const newApplication = {
    id: Date.now(), // Timestamp as ID
    dateApplied: new Date().toISOString().split('T')[0],
    ...applicationData
  };
  
  applications.push(newApplication);
  saveToLocalStorage();
  return newApplication;
}

/**
 * Update existing application
 * @param {number} id - Application ID
 * @param {Object} updatedData - Updated application data
 * @returns {Object|null} Updated application or null if not found
 */
export function updateApplication(id, updatedData) {
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) return null;
  
  // Merge existing data with updates
  applications[index] = {
    ...applications[index],
    ...updatedData,
    id // Ensure ID doesn't change
  };
  
  saveToLocalStorage();
  return applications[index];
}

/**
 * Delete application by ID
 * @param {number} id - Application ID
 * @returns {boolean} Success status
 */
export function deleteApplication(id) {
  const initialLength = applications.length;
  applications = applications.filter(app => app.id !== id);
  
  const success = initialLength > applications.length;
  if (success) saveToLocalStorage();
  
  return success;
}

/**
 * Filter applications by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered applications
 */
export function filterByStatus(status) {
  return applications.filter(app => app.status === status);
}

/**
 * Sort applications by field
 * @param {string} field - Field to sort by
 * @param {boolean} ascending - Sort direction
 * @returns {Array} Sorted applications
 */
export function sortApplications(field, ascending = true) {
  const sortedApps = [...applications].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    if (typeof valueA === 'string') {
      return ascending 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return ascending 
      ? valueA - valueB 
      : valueB - valueA;
  });
  
  return sortedApps;
}

/**
 * Search applications by text
 * @param {string} query - Search query
 * @returns {Array} Matching applications
 */
export function searchApplications(query) {
  if (!query) return [...applications];
  
  const lowerQuery = query.toLowerCase();
  
  return applications.filter(app => {
    // Search in common fields
    return (
      app.company.toLowerCase().includes(lowerQuery) ||
      app.jobPosition.toLowerCase().includes(lowerQuery) ||
      app.location.toLowerCase().includes(lowerQuery) ||
      app.notes.toLowerCase().includes(lowerQuery)
    );
  });
}

// Initialize by loading from localStorage
loadFromLocalStorage();
