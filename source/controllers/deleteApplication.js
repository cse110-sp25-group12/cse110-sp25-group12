/**
 * Deletes a job application from localStorage and removes its card from the DOM.
 * @param {string} applicationId - The unique ID of the job application.
 */

export function deleteApplication(applicationId){

  // e.detail.id is a string; convert to number:
  const idToRemove = Number(applicationId);

  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  const updatedCards = cards.filter(card => card.id !== idToRemove);
  localStorage.setItem('applications', JSON.stringify(updatedCards));

  // Remove the entire wrapper that contains both the card and delete button
  const wrapper = document.querySelector(`.application-wrapper[data-id="${applicationId}"]`);
  if (wrapper) {

    // Add fade-out animation before removing
    wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'scale(0.9)';
    setTimeout(() => {
      wrapper.remove();
    }, 300);
  } else {
    // Fallback: try to find and remove just the card element
    const cardElem = document.querySelector(`job-app-card[data-id="${applicationId}"]`);
    if (cardElem) cardElem.remove();
  }
}