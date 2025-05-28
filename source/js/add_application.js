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
      status: document.getElementById('status').value,
      positionType: document.getElementById('positionType').value,
      salary: document.getElementById('salary').value || null,
      location: document.getElementById('location').value,
      bookmarked: false, // Default to not bookmarked
      contact: {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value
      },
      notes: document.getElementById('notes').value
    };
    createApplication(formData);

    //Redirect to applications page
    setTimeout(() => {
      window.location.pathname = 'source/pages/applications.html';
    }, 100);
  });
});
