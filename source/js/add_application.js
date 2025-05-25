import { createApplication } from '../controllers/createApplication.js';

document.addEventListener('DOMContentLoaded', function() {
  //add event listener to form
  const form = document.getElementById('addApplicationForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
      company: document.getElementById('company').value,
      jobPosition: document.getElementById('jobPosition').value,
      dateApplied: document.getElementById('dateApplied').value,
      contact: {
        email: document.getElementById('contactEmail').value
      }
    };
    createApplication(formData);

    //Redirect to applications page
    setTimeout(() => {
      window.location.pathname = 'source/pages/applications.html';
    }, 100);
  });
});
