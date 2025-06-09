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

    //Collect values from form fields with null safety
    const getElementValue = (id) => {
      const element = document.getElementById(id);
      return element ? element.value : '';
    };

    // Validate salary is not negative
    const salaryValue = getElementValue('salary');
    const parsedSalary = salaryValue ? parseInt(salaryValue, 10) : null;
    
    if (parsedSalary !== null && parsedSalary < 0) {
      showErrorMessage('Salary cannot be negative. Please enter a valid amount.');
      return;
    }

    const formData = {
      company: getElementValue('company'),
      jobPosition: getElementValue('jobPosition'),
      dateApplied: getElementValue('dateApplied'),
      status: getElementValue('status'),
      positionType: getElementValue('positionType'),
      salary: parsedSalary,
      location: getElementValue('location'),
      bookmarked: false,
      contact: {
        name: getElementValue('contactName'),
        email: getElementValue('contactEmail'),
        phoneNumber: getElementValue('contactPhone')
      },
      notes: getElementValue('notes')
    };

    try {
      if (editData) {
        // In edit mode, preserve the existing ID and update storage
        const job = JSON.parse(editData);
        formData.id = job.id;
        updateApplication(job.id, formData);
        localStorage.removeItem('editJobData');
        
        // Show success message for update
        showSuccessMessage('Application updated successfully!');
      } else {
        // Otherwise, create a new application entry
        const newApplication = createApplication(formData);
        
        // Show success message for creation
        const companyName = newApplication?.company || formData.company || 'Unknown Company';
        showSuccessMessage(`Application for ${companyName} created successfully!`);
      }

      // After processing, navigate back to the applications list
      setTimeout(() => {
        // Use clean URL for Netlify compatibility
        if (typeof window !== 'undefined') {
          window.location.href = '/applications';
        }
      }, 100); // Match test expectation timing
      
    } catch (error) {
      console.error('Error saving application:', error);
      showErrorMessage('Failed to save application. Please try again.');
    }
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

/**
 * @description Show a success message to the user
 * @param {string} message - The success message to display
 */
function showSuccessMessage(message) {
  // Create a success notification element
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '400px',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out'
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

/**
 * @description Show an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
  // Create an error notification element
  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '400px',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out'
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000); // Error messages stay longer
}

export { populateFormForEdit };
