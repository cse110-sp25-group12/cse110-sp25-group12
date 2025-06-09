/**
 * Generates a UUID, using crypto module in Node.js or browser crypto API
 * @returns {string} A UUID string.
 * @description Generates a UUID, using crypto module in Node.js or browser crypto API
 * I have to use this function because the crypto module is not available in the browser, now it should pass the tests
 */
function generateUUID() {
  // In Node.js environment (like Jest), use the imported randomUUID
  if (typeof randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // In browser environment, use the global crypto API
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Creates a new job application card and stores it in localStorage.
 * @param {Object} formData - The input data from the form.
 * @returns {Object} The newly created card object.
 */
export function createApplication(formData) {
  const newCard = {
    id: generateUUID(),
    ...formData,
    logo: formData.logo
  };

  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  cards.push(newCard);
  localStorage.setItem('applications', JSON.stringify(cards));

  // Dispatch a custom event to notify other parts of the app about the new application
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('applicationCreated', { 
      detail: { application: newCard } 
    }));
  }

  return newCard;
}

