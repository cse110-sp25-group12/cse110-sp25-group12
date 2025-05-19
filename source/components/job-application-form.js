/**
 * Handles job application form functionality
 */
export class JobApplicationForm {
  /**
   * Creates form handler
   * @param {string} formId - DOM ID of the form
   * @param {Function} onSubmit - Callback when submitted
   */
  constructor(formId, onSubmit) {
    this.form = document.getElementById(formId);
    if (!this.form) {
      console.error(`Form with ID ${formId} not found`);
      return;
    }
    this.onSubmit = onSubmit;
    this.setupValidation();
    this._initialize();
  }

  /**
   * Sets up form validation
   */
  setupValidation() {
    // Required fields
    const requiredFields = ['company', 'jobPosition'];
    
    // Add required attribute to required fields
    requiredFields.forEach(field => {
      const element = this.form.elements[field];
      if (element) {
        element.setAttribute('required', '');
      }
    });
    
    // Add validation styling
    const style = document.createElement('style');
    style.textContent = `
      .form-group input:invalid,
      .form-group select:invalid {
        border-color: #dc3545;
      }
      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
      }
      input:invalid + .error-message {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Sets up event listeners
   */
  _initialize() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this._handleSubmit(e));
      
      // Add input listeners for real-time validation
      Array.from(this.form.elements).forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
          element.addEventListener('blur', () => {
            this._validateField(element);
          });
        }
      });
    }
  }

  /**
   * Validates a single form field
   * @param {HTMLElement} field - Form field to validate
   * @returns {boolean} Whether field is valid
   */
  _validateField(field) {
    if (!field.checkValidity()) {
      field.classList.add('is-invalid');
      return false;
    } else {
      field.classList.remove('is-invalid');
      return true;
    }
  }

  /**
   * Validates the entire form
   * @returns {boolean} Whether form is valid
   */
  _validateForm() {
    let isValid = true;
    
    // Check all fields
    Array.from(this.form.elements).forEach(element => {
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
        if (!this._validateField(element)) {
          isValid = false;
        }
      }
    });
    
    return isValid;
  }

  /**
   * Handles submit event
   * @param {Event} e - Submit event
   */
  _handleSubmit(e) {
    e.preventDefault();
    
    if (!this._validateForm()) {
      return;
    }
    
    const formData = this._collectFormData();
    this.onSubmit(formData);
    this.form.reset();
  }

  /**
   * Collects form data into object structured like applications.json
   * @returns {Object} Form field values
   */
  _collectFormData() {
    // Get values from form
    const company = this.form.elements.company?.value || '';
    const jobPosition = this.form.elements.jobPosition?.value || '';
    const status = this.form.elements.status?.value || 'Applied';
    const position = this.form.elements.position?.value || 'Full-Time';
    const salary = this.form.elements.salary?.value 
      ? parseFloat(this.form.elements.salary.value) 
      : null;
    const location = this.form.elements.location?.value || '';
    
    // Contact info as nested object
    const contact = {
      name: this.form.elements.contactName?.value || '',
      email: this.form.elements.contactEmail?.value || '',
      phoneNumber: this.form.elements.contactPhone?.value || ''
    };
    
    const notes = this.form.elements.notes?.value || '';
    
    // Create a structured object that matches applications.json format
    return {
      company,
      jobPosition,
      position,
      salary,
      location,
      contact,
      notes,
      status,
      dateApplied: new Date().toISOString().split('T')[0],  // Today's date
      importantDates: {}  // Empty by default, filled by controller if needed
    };
  }
}
