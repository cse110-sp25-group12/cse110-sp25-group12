/**
 * Creates a new job application card and stores it in localStorage.
 * @param {Object} formData - The input data from the form.
 * @returns {Object} The newly created card object.
 */
export function createApplication(formData) {
  const newCard = {
    id: crypto.randomUUID(),
    ...formData,
    logo: formData.logo
  };

  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  cards.push(newCard);
  localStorage.setItem('applications', JSON.stringify(cards));

  return newCard;
}
