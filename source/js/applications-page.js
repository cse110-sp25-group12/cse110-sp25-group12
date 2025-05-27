import '../components/job-card.js';
import { deleteApplication } from '../controllers/deleteApplication.js';

//Load mock data if localStorage is empty(THIS IS A DEBUGGING TOOL)
document.addEventListener('DOMContentLoaded', function () {
  // Initialize empty array if localStorage is null
  if (localStorage.getItem('applications') === null) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
  renderCards();
});

/**
 * Mock data for testing/demo purposes (based on applications.json structure)
 * Call loadMockData() in console to populate localStorage
 * THIS IS A DEBUGGING TOOL
 */
const MOCK_APPLICATIONS = [
  {
    id: crypto.randomUUID(),
    company: 'Apple',
    jobPosition: 'Machine Learning Engineer',
    jobType: 'Full-time',
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
    id: crypto.randomUUID(),
    company: 'Google',
    jobPosition: 'Software Developer',
    jobType: 'Full-time',
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
    id: crypto.randomUUID(),
    company: 'Netflix',
    jobPosition: 'Product Designer',
    jobType: 'Full-time',
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
    id: crypto.randomUUID(),
    company: 'Microsoft',
    jobPosition: 'Product Manager（牛马）',
    jobType: 'Full-time',
    salary: 180000,
    location: 'Redmond, WA',
    contact: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@microsoft.com',
      phoneNumber: '206-555-0123'
    },
    notes: 'Applied through LinkedIn, had initial phone screening',
    dateApplied: '2025-01-10',
    importantDates: {
      'Phone Screen': '2025-01-15',
      'Panel Interview': '2025-01-22'
    },
    status: 'Rejected',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  },
  {
    id: crypto.randomUUID(),
    company: 'Meta',
    jobPosition: 'Frontend Engineer(牛马)',
    jobType: 'Full-time',
    salary: 200000,
    location: 'Menlo Park, CA',
    contact: {
      name: 'David Chen',
      email: 'david.chen@meta.com',
      phoneNumber: '650-555-0199'
    },
    notes: 'Interested in React and web performance optimization roles',
    dateApplied: '2025-01-30',
    importantDates: {
      'Application Review': '2025-02-05'
    },
    status: 'Waitlisted',
    bookmarked: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png'
  },
  {
    id: crypto.randomUUID(),
    company: 'Amazon',
    jobPosition: 'Software Development Engineer',
    jobType: 'Full-time',
    salary: 155000,
    location: 'Seattle, WA',
    contact: {
      name: 'Jennifer Lee',
      email: 'jennifer.lee@amazon.com',
      phoneNumber: '206-266-1000'
    },
    notes: 'Applied for AWS team, focusing on cloud infrastructure',
    dateApplied: '2025-02-15',
    importantDates: {
      'Online Assessment': '2025-02-20',
      'Virtual Interview': '2025-02-28'
    },
    status: 'Screening',
    bookmarked: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  }
];

/**
 * Add mock data to existing applications in localStorage for testing/demo purposes
 * This will append the mock data to any existing applications rather than replacing them
 * Usage: Open browser console and call loadMockData()
 * THIS IS A DEBUGGING TOOL
 */
function loadMockData() {
  // Get existing applications from localStorage
  const existingApplications = JSON.parse(localStorage.getItem('applications')) || [];

  // Combine existing applications with mock data
  const combinedApplications = [...existingApplications, ...MOCK_APPLICATIONS];

  // Save the combined list back to localStorage
  localStorage.setItem('applications', JSON.stringify(combinedApplications));

  // Re-render if on applications page
  if (typeof renderCards === 'function') {
    renderCards();
    console.log('🔄 Applications page refreshed');
  }
}

/**
 * Clear all applications from localStorage
 * Usage: Open browser console and call clearApplications()
 */
function clearApplications() {
  localStorage.setItem('applications', JSON.stringify([]));
  console.log('🗑️ All applications cleared from localStorage');

  // Re-render if on applications page
  if (typeof renderCards === 'function') {
    renderCards();
    console.log('🔄 Applications page refreshed');
  }
}

// Make functions available globally for console use
window.loadMockData = loadMockData;
window.clearApplications = clearApplications;


//Render cards to the DOM

function renderCards() {
  const container = document.getElementById('applicationCardsContainer');
  const cards = JSON.parse(localStorage.getItem('applications')) || [];

  // Clear existing cards to prevent duplicates
  container.innerHTML = '';

  // Update header count
  const header = document.querySelector('.main-header h1');
  if (header) {
    header.textContent = `All Applications (${cards.length})`;
  }

  // Handle empty state
  if (cards.length === 0) {
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

  for (const card of cards) {
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.classList.add('application-wrapper');
    wrapper.dataset.id = card.id;

    // Create job card
    const cardElem = document.createElement('job-app-card');
    cardElem.data = card;
    cardElem.dataset.id = card.id;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = `
      <span class="material-symbols-outlined">delete</span>
      <span class="delete-text">Delete</span>
    `;
    deleteBtn.dataset.id = card.id;
    deleteBtn.title = 'Delete this application';

    // Append card and button to wrapper
    wrapper.appendChild(cardElem);
    wrapper.appendChild(deleteBtn);

    // Add to DOM
    container.appendChild(wrapper);
  }
}

// Delegate delete clicks, and update UI after deletion
document.addEventListener('click', (e) => {
  // Find the delete button (could be the button itself or a child element)
  const deleteBtn = e.target.closest('.delete-btn');

  if (deleteBtn) {
    const appId = deleteBtn.dataset.id;

    // Add confirmation for better UX
    if (confirm('Are you sure you want to delete this application?')) {
      console.log('🗑️ Deleting application:', appId);

      // Call synchronous delete function
      deleteApplication(appId);

      // After delete, check remaining count and update UI
      setTimeout(() => {
        const remainingCards = JSON.parse(localStorage.getItem('applications')) || [];
        const remainingCount = remainingCards.length;

        // Update header count
        const header = document.querySelector('.main-header h1');
        if (header) {
          header.textContent = `All Applications (${remainingCount})`;
        }

        // Show empty state if no applications remain
        if (remainingCount === 0) {
          const container = document.getElementById('applicationCardsContainer');
          container.innerHTML = `
            <div class="empty-state">
              <span class="material-symbols-outlined">work_off</span>
              <h3>No applications yet</h3>
              <p>Start tracking your job applications by adding your first one!</p>
              <a href="add_application.html" class="add-btn">Add Your First Application</a>
            </div>
          `;
        }

        console.log('✅ Application deleted successfully');
      }, 350); // Wait for animation to complete
    }
  }
});

export {
  renderCards
};
