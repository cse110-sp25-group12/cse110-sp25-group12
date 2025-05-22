/**
 * Create application controller
 * @returns {Object} Created card object
 */
export function createApplication(cardData) {
  //Append cardData to existing card array
  const cards = JSON.parse(localStorage.getItem('applications'));
  cards.push(cardData);
  localStorage.setItem('applications', JSON.stringify(cards));

  return cardData;
}

