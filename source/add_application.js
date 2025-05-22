import { createApplication } from './controllers/createApplication.js';

document.addEventListener('DOMContentLoaded', function() {
  //add event listener to form
  const form = document.getElementById('addApplicationForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    createApplication();
    //Redirect to applications page
    window.location.pathname = 'source/applications.html';
  });
});
