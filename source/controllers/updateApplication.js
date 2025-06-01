/**
 * Updates an existing job application in localStorage
 * @param {string} applicationId - The ID of the application to update
 * @param {Object} updatedData - New data to merge
 * @returns {Object|null} Updated application object or null if not found
 */
export function updateApplication(applicationId, updatedData) {
  // Fetch all apps
  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  // Find index
  const cardIndex = cards.findIndex(card => card.id === applicationId);
  if (cardIndex === -1) return null; // Silent fail 
  // Immutable update
  const updatedCard = {
    ...cards[cardIndex], // Keep existing data
    ...updatedData,     // Apply updates
    id: applicationId   // Ensure ID remains unchanged
  };
  // Update storage 
  const updatedCards = [...cards];
  updatedCards[cardIndex] = updatedCard;
  localStorage.setItem('applications', JSON.stringify(updatedCards));
  // Return updated card 
  return updatedCard;
}

// DOM update helper
function updateCardInDOM(applicationId, updatedData) {
  const cardElement = document.querySelector(`[data-id="${applicationId}"]`);
  if (!cardElement) return;
  // Visual feedback
  cardElement.style.transition = 'all 0.3s ease';
  cardElement.style.backgroundColor = 'rgba(100, 255, 100, 0.2)';
  setTimeout(() => {
    cardElement.style.backgroundColor = '';
  }, 300);
  // Update DOM fields if needed (e.g., company/status/position)
  if (updatedData.company) {
    cardElement.querySelector('.company-name').textContent = updatedData.company;
  }
}
