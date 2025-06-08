/**
 * @fileoverview Manages loading, rendering, and user interactions for job application cards.
 */
import '../components/job-card.js';
import { deleteApplication } from '../controllers/deleteApplication.js';


/**
 * @description Initialize application data and render cards on first visit.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Seed localStorage from JSON file if empty
  if (!localStorage.getItem('applications')) {
    const jobs = await fetchApplications();
    localStorage.setItem('applications', JSON.stringify(jobs));
  }
  // Retrieve and render stored applications
  const jobs = JSON.parse(localStorage.getItem('applications'));
  renderCards(jobs);
  setupModal();
});

/**
 * @description Fetches initial job applications from a JSON data file.
 * @async
 * @returns {Promise<Object[]>} Array of job application objects (empty array on error).
 */
async function fetchApplications() {
  try {
    const response = await fetch('../data/applications.json');
    if (!response.ok) throw new Error('Failed to load applications.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading applications:', error);
    return [];
  }
}

/**
 * @description Render job application cards based on provided jobs and current filter.
 * @param {Object[]} [jobs] - Array of job objects to render; defaults to localStorage data.
 */
function renderCards(jobs) {
  // Fallback to local storage if no jobs are passed in
  if (!jobs) {
    jobs = JSON.parse(localStorage.getItem('applications')) || [];
  }

  const container = document.getElementById('applicationCardsContainer');
  container.innerHTML = '';

  // Determine current filter and total count for header
  const currentFilter = localStorage.getItem('filterPreference') || 'All';
  const totalApplications = JSON.parse(localStorage.getItem('applications')) || [];

  const header = document.querySelector('.main-header h1');
  if (header) {
    if (currentFilter === 'All') {
      header.textContent = `All Applications (${jobs.length})`;
    } else {
      header.textContent = `${currentFilter} Applications (${jobs.length} of ${totalApplications.length})`;
    }
  }

  // Show empty state if there are no jobs
  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="material-symbols-outlined">work_off</span>
        <h3>No applications yet</h3>
        <p>Start tracking your job applications by adding your first one!</p>
        <a href="add_application.html" class="add-btn">Add Your First Application</a>
      </div>
    `;
    return;
  }

  // Create and append a card for each job
  for (const job of jobs) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('application-wrapper');
    wrapper.dataset.id = job.id;

    const cardElem = document.createElement('job-app-card');
    cardElem.data = job;
    cardElem.dataset.id = job.id;

    // Open details modal when card clicked (unless delete button)
    cardElem.addEventListener('click', (e) => {
      if (e.composedPath().some(el => el.classList?.contains('delete-btn'))) return;
      openModal(job);
    });

    // Handle delete events bubbled from the custom element
    cardElem.addEventListener('delete-card', (e) => {
      const appId = e.detail.id;
      if (confirm('Are you sure you want to delete this application?')) {
        deleteApplication(appId);
        // Re-render after deletion animation delay
        setTimeout(() => {
          const updated = JSON.parse(localStorage.getItem('applications')) || [];
          renderCards(updated);
        }, 310);
      }
    });

    wrapper.appendChild(cardElem);
    container.appendChild(wrapper);
  }
}

/**
 * @description Configure modal open/close behaviors (click outside, close button, Escape key).
 */
function setupModal() {
  const modal = document.getElementById('appDetailsModal');
  const closeBtn = modal.querySelector('.close-btn');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Close when clicking the backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('show');
    }
  });
}

/**
 * @description Populate and display the details modal for a job application.
 * @param {Object} data - The job application data to show.
 */
function openModal(data) {
  window.currentlyViewingJob = data;
  const modal = document.getElementById('appDetailsModal');
  modal.classList.add('show');

  // Fill modal fields with job data
  document.getElementById('modal-title').textContent = data.jobPosition;
  document.getElementById('modal-company').textContent = data.company;
  document.getElementById('modal-type').textContent = data.jobType;
  document.getElementById('modal-salary').textContent = `$${data.salary?.toLocaleString() || '-'}`;
  document.getElementById('modal-location').textContent = data.location;
  document.getElementById('modal-date').textContent = data.dateApplied;
  document.getElementById('modal-status').textContent = data.status;
  document.getElementById('modal-contact').textContent = data.contact?.email || '';
  document.getElementById('modal-phone').textContent = data.contact?.phoneNumber || '';
  document.getElementById('modal-notes').textContent = data.notes || '';

  // Populate list of important dates if present
  const ul = document.getElementById('modal-important-dates');
  ul.innerHTML = '';
  if (data.importantDates) {
    for (const [label, value] of Object.entries(data.importantDates)) {
      const li = document.createElement('li');
      li.textContent = `${label}: ${value}`;
      ul.appendChild(li);
    }
  }
}

// Store current job in localStorage and navigate to edit form
document.getElementById('editApplicationBtn').addEventListener('click', () => {
  if (!window.currentlyViewingJob) return;
  localStorage.setItem('editJobData', JSON.stringify(window.currentlyViewingJob));
  window.location.href = 'add_application.html';
});

/**
 * @description Update a specific job-app-card element in the DOM after an application update.
 * @param {string} applicationId - The ID of the updated application.
 */
export function updateCardInDOM(applicationId) {
  const cardElement = document.querySelector(`job-app-card[data-id="${applicationId}"]`);
  if (!cardElement) return;

  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  const updatedCard = cards.find(card => card.id === applicationId);
  if (!updatedCard) return;

  // Apply new data and highlight the updated card
  cardElement.data = updatedCard;
  const wrapper = cardElement.closest('.application-wrapper');
  if (wrapper) {
    wrapper.style.transition = 'background-color 0.3s ease';
    wrapper.style.backgroundColor = 'rgba(100, 255, 100, 0.2)';
    setTimeout(() => {
      wrapper.style.backgroundColor = '';
    }, 300);
  }
}

// Expose renderCards globally for external usage
window.renderCards = renderCards;
