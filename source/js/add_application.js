import { createApplication } from '../controllers/createApplication.js';
import { updateApplication } from '../controllers/updateApplication.js';



document.addEventListener('DOMContentLoaded', function() {
  //add event listener to form
  const form = document.getElementById('addApplicationForm');
  const editData = localStorage.getItem('editJobData');

  if (editData) {
    const job = JSON.parse(editData);
    populateFormForEdit(job);
    document.title = 'JobTrack - Edit Application';
    document.querySelector('.main-header h1').textContent = 'Edit Current Job Application';
    document.getElementById('submitBtn').textContent = 'Save Changes';
  }


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

    if (editData) {
      const job = JSON.parse(editData);
      formData.id = job.id;
      updateApplication(job.id, formData);
      localStorage.removeItem('editJobData');
    } else {
      createApplication(formData);
    }
    //createApplication(formData);

    //Redirect to applications page
    setTimeout(() => {
      window.location.pathname = 'source/pages/applications.html';
    }, 100);
  });
});

function populateFormForEdit(job) {
  document.getElementById('company').value = job.company;
  document.getElementById('jobPosition').value = job.jobPosition;
  document.getElementById('dateApplied').value = job.dateApplied || '';
  document.getElementById('status').value = job.status;
  document.getElementById('positionType').value = job.positionType || job.jobType || '';
  document.getElementById('salary').value = job.salary || '';
  document.getElementById('location').value = job.location || '';
  document.getElementById('contactName').value = job.contact?.name || '';
  document.getElementById('contactEmail').value = job.contact?.email || '';
  document.getElementById('contactPhone').value = job.contact?.phoneNumber || '';
  document.getElementById('notes').value = job.notes || '';
}
