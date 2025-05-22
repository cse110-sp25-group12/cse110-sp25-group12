
/**
 * Create application controller
 * @returns {Object} Created card object
 */
export function createApplication(formData) {
  //Create new card object that mirrors existing card object format
  //HARDCODED, but eventually migrate to using formdata
  const newCard = {
    id: crypto.randomUUID(),
    ...formData,
    logo: formData.logo 
  };

  //Save card to localStorage
  const cards = JSON.parse(localStorage.getItem('applications'));
  cards.push(newCard);
  localStorage.setItem('applications', JSON.stringify(cards));

  return newCard;
}

