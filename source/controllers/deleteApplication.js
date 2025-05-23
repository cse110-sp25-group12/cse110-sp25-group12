/**
 * Deletes a job application from localStorage and removes its card from the DOM.
 * @param {string} applicationId - The unique ID of the job application.
 */

export function deleteApplication(applicationId){
    const cards = JSON.parse(localStorage.getItem('applications')) || [];
    const updatedCards = cards.filter(card => card.id !== applicationId);
    localStorage.setItem('applications', JSON.stringify(updatedCards));

    const cardElem = document.querySelector(`job-app-card[data-id="${applicationId}"]`);
    if (cardElem) cardElem.remove();
}
