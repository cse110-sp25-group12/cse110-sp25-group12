import { createApplication } from '../controllers/createApplication.js';
import { updateApplication } from '../controllers/updateApplication.js';


/**
 * @description Initializes the add/edit application form once the DOM is ready.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
  // Button to clear edit data when adding a new application
  const addBtn = document.getElementById('addApplicationBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      localStorage.removeItem('editJobData');
    });
  }

  // Reference to the add/edit form
  const form = document.getElementById('addApplicationForm');

  // Attempt to read any stored edit data
  const rawEdit = localStorage.getItem('editJobData');
  if (!rawEdit) {
    localStorage.removeItem('editJobData');
  }


  const editData = localStorage.getItem('editJobData');

  // If we're in edit mode, populate the form and update UI text
  if (editData) {
    const job = JSON.parse(editData);
    populateFormForEdit(job);
    document.title = 'JobTrack - Edit Application';
    document.querySelector('.main-header h1').textContent = 'Edit Current Job Application';
    document.getElementById('submitBtn').textContent = 'Save Changes';
  }

  /**
   * @description Handle form submission for creating or updating an application.
   * @param {SubmitEvent} event
   */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    //Collect values from form fields
    const formData = {
      company: document.getElementById('company').value,
      jobPosition: document.getElementById('jobPosition').value,
      dateApplied: document.getElementById('dateApplied').value,
      status: document.getElementById('status').value,
      positionType: document.getElementById('positionType').value,
      salary: document.getElementById('salary').value || null,
      location: document.getElementById('location').value,
      bookmarked: false,
      contact: {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phoneNumber: document.getElementById('contactPhone').value
      },
      notes: document.getElementById('notes').value
    };

    if (editData) {
      // In edit mode, preserve the existing ID and update storage
      const job = JSON.parse(editData);
      formData.id = job.id;
      updateApplication(job.id, formData);
      localStorage.removeItem('editJobData');
    } else {
      // Otherwise, create a new application entry
      createApplication(formData);
    }


    // After processing, navigate back to the applications list
    setTimeout(() => {
      window.location.pathname = 'source/pages/applications.html';
    }, 100);
  });
});

/**
 * @description Populate form fields with data for editing an existing application.
 * @param {Object} job - The job data to load into the form.
 */
function populateFormForEdit(job) {
  // Fill each field from the job object (use empty string defaults if missing)
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
