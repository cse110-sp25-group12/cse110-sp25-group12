
/**
 * Create application controller
 * @returns {Object} Created card object
 */
export function createApplication() {
  //Create new card object that mirrors existing card object format
  //HARDCODED, but eventually migrate to using formdata
  const newCard = {
    company: 'Example',
    jobPosition: 'Example',
    dateApplied: '2025-03-19',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    contact: { email: 'mark.spears@apple.com' },
  };

  //Save card to localStorage
  const cards = JSON.parse(localStorage.getItem('applications'));
  cards.push(newCard);
  localStorage.setItem('applications', JSON.stringify(cards));

  return newCard;
}

