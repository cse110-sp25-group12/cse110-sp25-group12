/**
 * Minimal sorting functions for job applications
 * Supports: date, status priority, bookmarked
 */

// Status priority mapping (higher number = higher priority)
const STATUS_PRIORITY = {
  'Offer': 7,
  'Interviewing': 6,
  'Screening': 5,
  'Applied': 4,
  'Wishlist': 3,
  'Rejected': 2,
  'Ghosted': 1,
  'Withdrawn': 0
};

/**
 * Sort applications by the specified criteria
 * @param {Array} applications - Array of application objects
 * @param {string} sortBy - Sort criteria: 'date', 'status', 'bookmarked'
 * @param {string} direction - Sort direction: 'asc' or 'desc'
 * @returns {Array} Sorted applications array
 */
export function sortApplications(applications, sortBy = 'date', direction = 'desc') {
  if (!Array.isArray(applications)) return [];

  const sorted = [...applications].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
    case 'date': {
      const dateA = new Date(a.dateApplied || 0);
      const dateB = new Date(b.dateApplied || 0);
      comparison = dateA - dateB;
      break;
    }
    case 'status': {
      const priorityA = STATUS_PRIORITY[a.status] || 0;
      const priorityB = STATUS_PRIORITY[b.status] || 0;
      comparison = priorityA - priorityB;
      break;
    }
    case 'bookmarked': {
      const bookmarkedA = a.bookmarked ? 1 : 0;
      const bookmarkedB = b.bookmarked ? 1 : 0;
      comparison = bookmarkedA - bookmarkedB;
      break;
    }
    default:
      return 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Helper function to get status priority for external use
 * @param {string} status - Application status
 * @returns {number} Priority value
 */
export function getStatusPriority(status) {
  return STATUS_PRIORITY[status] || 0;
}
