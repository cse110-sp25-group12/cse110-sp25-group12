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

// Mock data for testing and demonstration
const mockApplications = [
  {
    id: 'mock-1',
    company: 'Apple',
    jobPosition: 'Machine Learning Engineer',
    jobType: 'Full-Time',
    salary: 265000,
    location: 'San Francisco, CA',
    contact: {
      name: 'Mark Spears',
      email: 'mark.spears@apple.com',
      phoneNumber: '417-525-2998'
    },
    notes: 'Waiting to hear back from the recruiter screen I did last week',
    dateApplied: '2025-03-19',
    importantDates: {
      'Phone Interview': '2025-04-05',
      'Technical Interview': '2025-04-12'
    },
    status: 'Applied',
    bookmarked: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  },
  {
    id: 'mock-2',
    company: 'Google',
    jobPosition: 'Software Developer',
    jobType: 'Full-Time',
    salary: 120000,
    location: 'San Diego, CA',
    contact: {
      name: 'Alex Jobs',
      email: 'alex.jobs@google.com',
      phoneNumber: '999-999-9999'
    },
    notes: 'Have finished the coding challenge, waiting for results',
    dateApplied: '2025-04-19',
    importantDates: {
      'Challenge Submission': '2025-04-24'
    },
    status: 'Interviewing',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  },
  {
    id: 'mock-3',
    company: 'Netflix',
    jobPosition: 'Product Designer',
    jobType: 'Full-Time',
    salary: 145000,
    location: 'Chicago, IL',
    contact: {
      name: 'Joe Davis',
      email: 'joe.davis@netflix.com',
      phoneNumber: '888-888-8888'
    },
    notes: 'Have received the offer, reviewing benefits and stock options',
    dateApplied: '2025-03-29',
    importantDates: {
      'Offer Deadline': '2025-05-20'
    },
    status: 'Offer',
    bookmarked: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
  },
  {
    id: 'mock-4',
    company: 'Microsoft',
    jobPosition: 'Frontend Developer',
    jobType: 'Full-Time',
    salary: 135000,
    location: 'Seattle, WA',
    contact: {
      name: 'Sarah Chen',
      email: 'sarah.chen@microsoft.com',
      phoneNumber: '206-555-0123'
    },
    notes: 'Completed final round interviews, waiting for decision',
    dateApplied: '2025-02-15',
    importantDates: {
      'Final Interview': '2025-03-10',
      'Decision Expected': '2025-03-25'
    },
    status: 'Screening',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
  },
  {
    id: 'mock-5',
    company: 'Amazon',
    jobPosition: 'DevOps Engineer',
    jobType: 'Full-Time',
    salary: 155000,
    location: 'Austin, TX',
    contact: {
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@amazon.com',
      phoneNumber: '512-555-0456'
    },
    notes: 'Added to wishlist, planning to apply next month',
    dateApplied: '2025-05-01',
    importantDates: {},
    status: 'Wishlist',
    bookmarked: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    id: 'mock-6',
    company: 'Meta',
    jobPosition: 'Data Scientist',
    jobType: 'Full-Time',
    salary: 180000,
    location: 'Menlo Park, CA',
    contact: {
      name: 'Emily Wang',
      email: 'emily.wang@meta.com',
      phoneNumber: '650-555-0789'
    },
    notes: 'Applied but decided to withdraw due to company changes',
    dateApplied: '2025-01-20',
    importantDates: {
      'Withdrawal Date': '2025-02-05'
    },
    status: 'Withdrawn',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
  },
  {
    id: 'mock-7',
    company: 'Tesla',
    jobPosition: 'Software Engineer',
    jobType: 'Full-Time',
    salary: 140000,
    location: 'Palo Alto, CA',
    contact: {
      name: 'David Liu',
      email: 'david.liu@tesla.com',
      phoneNumber: '650-555-0321'
    },
    notes: 'Application was rejected after technical interview',
    dateApplied: '2025-01-10',
    importantDates: {
      'Technical Interview': '2025-02-01',
      'Rejection Date': '2025-02-10'
    },
    status: 'Rejected',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg'
  },
  {
    id: 'mock-8',
    company: 'Spotify',
    jobPosition: 'Backend Engineer',
    jobType: 'Full-Time',
    salary: 125000,
    location: 'Remote',
    contact: {
      name: 'Anna Johnson',
      email: 'anna.johnson@spotify.com',
      phoneNumber: '555-123-4567'
    },
    notes: 'Applied 3 months ago, no response from recruiter',
    dateApplied: '2024-12-15',
    importantDates: {},
    status: 'Ghosted',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
  }
];

/**
 * @description Loads mock application data into localStorage for testing purposes.
 * This function will add mock applications to existing data instead of replacing it.
 */
function loadMockData() {
  console.log('Adding mock data to existing applications...');

  // Get existing applications
  const existingApplications = JSON.parse(localStorage.getItem('applications')) || [];

  // Filter out mock applications that already exist to avoid duplicates
  const existingIds = existingApplications.map(app => app.id);
  const newMockApplications = mockApplications.filter(app => !existingIds.includes(app.id));

  // Combine existing and new mock applications
  const combinedApplications = [...existingApplications, ...newMockApplications];

  // Save combined data
  localStorage.setItem('applications', JSON.stringify(combinedApplications));
  console.log(`Added ${newMockApplications.length} new mock applications (${existingApplications.length} existing + ${newMockApplications.length} new = ${combinedApplications.length} total)`);

  // Re-render the cards immediately with the combined data
  renderCards(combinedApplications);

  // Show success message
  if (newMockApplications.length > 0) {
    alert(`Successfully added ${newMockApplications.length} new mock applications! Total applications: ${combinedApplications.length}`);
  } else {
    alert(`All mock applications already exist. No new applications added. Total applications: ${combinedApplications.length}`);
  }
}

/**
 * @description Clears all application data from localStorage.
 */
function clearAllData() {
  if (confirm('Are you sure you want to clear all application data? This cannot be undone.')) {
    localStorage.removeItem('applications');
    localStorage.removeItem('filterPreference');
    localStorage.removeItem('sortPreference');
    console.log('All application data cleared');

    // Re-render with empty data
    renderCards([]);

    alert('All application data has been cleared!');
  }
}

// Expose functions globally for console access and external usage
window.loadMockData = loadMockData;
window.clearAllData = clearAllData;
window.mockApplications = mockApplications;
