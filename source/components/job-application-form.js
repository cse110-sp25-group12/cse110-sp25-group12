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
    this.onSubmit = onSubmit;
    this._initialize();
  }

  /**
   * Sets up event listeners
   */
  _initialize() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this._handleSubmit(e));
    }
  }

  /**
   * Handles submit event
   * @param {Event} e - Submit event
   */
  _handleSubmit(e) {
    e.preventDefault();
    const formData = this._collectFormData();
    this.onSubmit(formData);
    this.form.reset();
  }

  /**
   * Collects form data into object
   * @returns {Object} Form field values
   */
  _collectFormData() {
    return {
      company: this.form.elements.company.value,
      jobPosition: this.form.elements.jobPosition.value,
      status: this.form.elements.status.value,
      salary: this.form.elements.salary?.value,
      location: this.form.elements.location?.value,
      contactName: this.form.elements.contactName?.value,
      contactEmail: this.form.elements.contactEmail?.value,
      contactPhone: this.form.elements.contactPhone?.value,
      notes: this.form.elements.notes?.value
    };
  }
}
