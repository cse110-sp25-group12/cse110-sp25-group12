/**
 * JobCard Class - Represents a job application with data structure
 */
class JobCard {
    /**
     * Creates a job application card
     * @param {Object} formData - Form input values
     */
    constructor(formData) {
      this.id = Date.now();
      this.dateApplied = new Date().toISOString().split('T')[0];
      
      // Required fields
      this.company = formData.company;
      this.jobPosition = formData.jobPosition;
      this.status = formData.status || "Applied";
      
      // Optional fields
      this.salary = formData.salary || null;
      this.location = formData.location || "";
      
      // Contact info
      this.contact = {
        name: formData.contactName || "",
        email: formData.contactEmail || "",
        phoneNumber: formData.contactPhone || ""
      };
      
      this.notes = formData.notes || "";
      this.importantDates = {};
    }
  
    /**
     * Converts to JSON for storage
     * @returns {Object} - Standardized card data
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

// Import web component
import './components/job-card.js'; // Ensure the component is registered
import { JobApplicationForm } from './components/job-application-form.js';

const jobData = [
  {
    company: "Acme Corp",
    title: "Senior UX Designer",
    position: "Full-Time",
    logo: "https://example.com/logo1.png",
    requirements: [
      "5+ years experience",
      "Portfolio",
      "Good communication"
    ]
  },
  {
    company: "Globex Inc.",
    title: "Frontend Developer",
    position: "Remote",
    logo: "https://example.com/logo2.png",
    requirements: [
      "React",
      "JavaScript",
      "CSS"
    ]
  }
];

// Add cards to <main>
const main = document.querySelector('main');
if (main) {
  jobData.forEach(job => {
    const card = document.createElement('job-app-card');
    card.data = job;
    main.appendChild(card);
  });
}
// Initialize form if exists
const jobForm = document.getElementById('jobApplicationForm');
if (jobForm) {
  new JobApplicationForm('jobApplicationForm', (formData) => {
    const newCard = new JobCard(formData);
    
    if (newCard.status === "Interviewing") {
      newCard.importantDates = {
        "Phone Screen": getFutureDate(7),
        "Technical Interview": getFutureDate(14)
      };
    }
    saveApplication(newCard);
  });
}

/** 
 * Saves application to localStorage
 * @param {JobCard} card - Card instance to save
 */
function saveApplication(card) {
  const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
  applications.push(card.toJSON());
  localStorage.setItem('jobApplications', JSON.stringify(applications));
}

/** 
 * Generates future date string
 * @param {number} daysAhead - Days in future
 * @returns {string} Date in YYYY-MM-DD format
 */
function getFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}
