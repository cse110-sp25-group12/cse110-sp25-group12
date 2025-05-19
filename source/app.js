/**
 * JobCard Class - Represents a job application with mock data structure
 */
class JobCard {
    /**
     * Creates a job application card
     * @param {Object} formData - Form input values
     */
    constructor(formData) {
      this.id = Date.now();
      this.dateApplied = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Required fields from form
      this.company = formData.company;
      this.jobPosition = formData.jobPosition;
      this.status = formData.status || "Applied";
      
      // Optional fields with mock defaults
      this.salary = formData.salary || null;
      this.location = formData.location || "";
      
      // Nested objects (mock structure)
      this.contact = {
        name: formData.contactName || "",
        email: formData.contactEmail || "",
        phoneNumber: formData.contactPhone || ""
      };
      
      this.notes = formData.notes || "";
      this.importantDates = {}; // Populated separately
    }
  
    /**
     * Converts to JSON matching mock data structure
     * @returns {Object} - Standardized application card
     */
    toJSON() {
      return {
        id: this.id,
        company: this.company,
        jobPosition: this.jobPosition,
        salary: this.salary,
        location: this.location,
        contact: this.contact,
        notes: this.notes,
        dateApplied: this.dateApplied,
        importantDates: this.importantDates,
        status: this.status
      };
    }
  }
  
  /**
   * Handles form submission
   */
  document.getElementById('jobApplicationForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    // 1. Get form data
    const formData = {
      company: document.getElementById('company').value,
      jobPosition: document.getElementById('jobPosition').value,
      status: document.getElementById('status').value,
      // Optional fields
      salary: document.getElementById('salary')?.value,
      location: document.getElementById('location')?.value,
      contactName: document.getElementById('contactName')?.value,
      contactEmail: document.getElementById('contactEmail')?.value,
      contactPhone: document.getElementById('contactPhone')?.value,
      notes: document.getElementById('notes')?.value
    };
  
    // 2. Create card instance
    const newCard = new JobCard(formData);
  
    // 3. Add mock interview dates if in interviewing stage
    if (newCard.status === "Interviewing") {
      newCard.importantDates = {
        "Phone Screen": getFutureDate(7), // 1 week from now
        "Technical Interview": getFutureDate(14) // 2 weeks from now
      };
    }
  
    // 4. Save to localStorage
    saveApplication(newCard);
  
    // 5. Reset form
    e.target.reset();
  });
  
  /** 
   * Saves to localStorage with mock data structure 
   */
  function saveApplication(card) {
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    applications.push(card.toJSON());
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }
  
  /** 
   * Generates future dates for mock interviews 
   */
  function getFutureDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  }
