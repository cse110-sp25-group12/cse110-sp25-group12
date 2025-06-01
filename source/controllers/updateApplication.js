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
export function updateCardInDOM(applicationId) {
  const cardElement = document.querySelector(`job-app-card[data-id="${applicationId}"]`);
  if (!cardElement) return;

  // Get the latest updated data from localStorage
  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  const updatedCard = cards.find(card => card.id === applicationId);
  if (!updatedCard) return;

  // Update the card by re-setting its data (re-renders the shadow DOM)
  cardElement.data = updatedCard;

  // Optional: Visual feedback
  const wrapper = cardElement.closest('.application-wrapper');
  if (wrapper) {
    wrapper.style.transition = 'background-color 0.3s ease';
    wrapper.style.backgroundColor = 'rgba(100, 255, 100, 0.2)';
    setTimeout(() => {
      wrapper.style.backgroundColor = '';
    }, 300);
  }
}
