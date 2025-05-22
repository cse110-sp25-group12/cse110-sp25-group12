import { createApplication } from '../controllers/createApplication.js';

document.addEventListener('DOMContentLoaded', function() {
  //add event listener to form
  const form = document.getElementById('addApplicationForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const cardData = {};
    for (const [key, value] of formData.entries()) {
      //console.log(key, value);
      cardData[key] = value;
    }
    createApplication(cardData);

    //Redirect to applications page
    // setTimeout(() => {
    //   window.location.pathname = 'source/pages/applications.html';
    // }, 100);
  });
});
