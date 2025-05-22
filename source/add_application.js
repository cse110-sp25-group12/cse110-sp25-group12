import { createCard } from './controllers/createApplication.js';

document.addEventListener('DOMContentLoaded', function() {
  //add event listener to form
  const form = document.getElementById('addApplicationForm');
  form.addEventListener('submit', createCard);
  //console.log('added event listener to application form');
});
