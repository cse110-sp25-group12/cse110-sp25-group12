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
        id: this.id, // 1
        company: this.company, // Google
        jobPosition: this.jobPosition, // Machine Learning Engineer
        position: this.position, // full-time, part-time, internship
        salary: this.salary, // 265000
        location: this.location, // San Francisco, CA
        contact: this.contact, // Mark Spears
        notes: this.notes, // Waiting to hear back from the recruiter screen I did last week
        dateApplied: this.dateApplied, // 2025-03-19
        importantDates: this.importantDates, // {Phone Interview: 2025-04-05, Technical Interview: 2025-04-12}
        status: this.status // Applied
      };
    }
}

// Import web components and controllers
import './components/job-card.js'; 
import { JobApplicationForm } from './components/job-application-form.js';
import { 
  loadApplications, 
  createApplication, 
  //updateApplication, 
  deleteApplication,
  getAllApplications
} from './controllers/applicationController.js';

// DOM Elements
const mainElement = document.querySelector('main');
const jobForm = document.getElementById('jobApplicationForm');

/**
 * Initialize the application
 */
function initApp() {
  // Load applications data
  loadApplicationsData();
  
  // Set up the form
  setupForm();
  
  // Set up event listeners
  setupEventListeners();
}

/**
 * Load and display applications
 */
async function loadApplicationsData() {
  try {
    // Load applications from controller
    await loadApplications();
    
    // Get all applications and render them
    const applications = getAllApplications();
    renderApplicationCards(applications);
  } catch (error) {
    console.error('Error loading applications:', error);
  }
}

/**
 * Render application cards to the main element
 * @param {Array} applications - Array of application objects
 */
function renderApplicationCards(applications) {
  if (!mainElement) return;
  
  // Clear existing cards
  const existingCards = mainElement.querySelectorAll('job-app-card');
  existingCards.forEach(card => card.remove());
  
  // Create and append new cards
  applications.forEach(app => {
    const card = document.createElement('job-app-card');
    card.data = app;
    mainElement.appendChild(card);
  });
}

/**
 * Set up the application form
 */
function setupForm() {
  if (!jobForm) return;
  
  new JobApplicationForm('jobApplicationForm', (formData) => {
    // Add important dates for interviewing status
    if (formData.status === "Interviewing") {
      formData.importantDates = {
        "Phone Screen": getFutureDate(7),
        "Technical Interview": getFutureDate(14)
      };
    }
    
    // Create the application through the controller
    const newApplication = createApplication(formData);
    
    // Render the new card
    const card = document.createElement('job-app-card');
    card.data = newApplication;
    mainElement?.appendChild(card);
  });
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
  // Listen for delete events from cards
  document.addEventListener('delete-application', (event) => {
    const id = event.detail.id;
    if (deleteApplication(id)) {
      // Find and remove the card
      const card = document.querySelector(`job-app-card[data-id="${id}"]`) || 
                   event.target.closest('job-app-card');
      if (card) {
        card.remove();
      }
    }
  });
  
  // Listen for edit events from cards
  document.addEventListener('edit-application', (event) => {
    const id = event.detail.id;
    // Handle edit logic here
    console.log(`Edit application ${id}`);
    // This would typically open a form or modal
  });
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

/**
 * Debug utility to fetch applications.json and log the data
 */
async function debugFetchApplications() {
  console.log('Fetching applications.json for debugging...');
  try {
    const response = await fetch('./data/applications.json');
    if (!response.ok) {
      throw new Error(`Error fetching applications.json: ${response.status}`);
    }
    const data = await response.json();
    console.log('Applications.json data:', data);
    return data;
  } catch (error) {
    console.error('Debug fetch failed:', error);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Debug: Fetch mock data
  debugFetchApplications()
    .then(mockData => {
      console.log('Mock applications loaded for debugging:', mockData?.length || 0);
      
      // Continue with normal app initialization
      initApp();
    });
});
