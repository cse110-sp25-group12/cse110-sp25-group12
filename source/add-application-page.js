/**
 * add-application-page.js
 * Handles form interactions and styling for the add application page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Make labels work properly with select elements
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    // Set initial state based on whether a value is selected
    if (select.value) {
      select.classList.add('has-value');
    }
    
    // Update on change
    select.addEventListener('change', () => {
      if (select.value) {
        select.classList.add('has-value');
      } else {
        select.classList.remove('has-value');
      }
    });
  });

  // Handle Important Dates functionality
  const addImportantDateBtn = document.getElementById('addImportantDateBtn');
  const importantDatesContainer = document.getElementById('importantDatesContainer');
  
  if (addImportantDateBtn && importantDatesContainer) {
    addImportantDateBtn.addEventListener('click', () => {
      const dateEntry = document.createElement('div');
      dateEntry.className = 'important-date-entry';
      
      dateEntry.innerHTML = `
        <div class="form-field">
          <input type="text" name="importantDateLabel[]" placeholder=" ">
          <label>Date Label (e.g., Phone Interview)</label>
        </div>
        <div class="form-field">
          <input type="date" name="importantDateValue[]" placeholder=" ">
          <label>Date</label>
        </div>
        <button type="button" class="remove-date-btn" aria-label="Remove date">
          <span class="material-symbols-outlined">remove_circle_outline</span>
        </button>
      `;
      
      importantDatesContainer.appendChild(dateEntry);
      
      // Add event listener to the remove button
      const removeBtn = dateEntry.querySelector('.remove-date-btn');
      removeBtn.style.display = 'inline-block';
      removeBtn.addEventListener('click', () => {
        dateEntry.remove();
      });
    });
    
    // Add event listener to existing remove buttons
    const existingRemoveBtns = importantDatesContainer.querySelectorAll('.remove-date-btn');
    existingRemoveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.important-date-entry').remove();
      });
    });
  }

  // Form submission handling
  const addApplicationForm = document.getElementById('addApplicationForm');
  if (addApplicationForm) {
    addApplicationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Extract form data
      const formData = new FormData(addApplicationForm);
      const applicationData = {
        company: formData.get('companyName'),
        jobPosition: formData.get('jobPosition'),
        position: formData.get('positionType') || 'Full-Time',
        status: formData.get('status') || 'Applied',
        salary: formData.get('salary') ? Number(formData.get('salary')) : null,
        location: formData.get('location') || '',
        dateApplied: formData.get('dateApplied'),
        notes: formData.get('notes') || '',
        contact: {
          name: formData.get('contactName') || '',
          email: formData.get('contactEmail') || '',
          phoneNumber: formData.get('contactPhone') || ''
        },
        importantDates: {}
      };
      
      // Add important dates
      const dateLabels = formData.getAll('importantDateLabel[]');
      const dateValues = formData.getAll('importantDateValue[]');
      
      for (let i = 0; i < dateLabels.length; i++) {
        if (dateLabels[i] && dateValues[i]) {
          applicationData.importantDates[dateLabels[i]] = dateValues[i];
        }
      }
      
      // Save application data to localStorage or send to backend
      try {
        // First check if we can use controller function
        if (typeof createApplication === 'function') {
          createApplication(applicationData);
        } else {
          // Fallback to direct localStorage manipulation
          let applications = JSON.parse(localStorage.getItem('applications') || '[]');
          applicationData.id = Date.now(); // Use timestamp as ID
          applications.push(applicationData);
          localStorage.setItem('applications', JSON.stringify(applications));
        }
        
        // Redirect to applications page
        window.location.href = 'applications.html';
      } catch (error) {
        console.error('Failed to save application:', error);
        alert('There was an error saving your application. Please try again.');
      }
    });
  }
});
