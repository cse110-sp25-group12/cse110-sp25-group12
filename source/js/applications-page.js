import '../components/job-card.js';
import { deleteApplication } from '../controllers/deleteApplication.js';

document.addEventListener('DOMContentLoaded', function () {
  // Initialize empty array if localStorage is null
  if (localStorage.getItem('applications') === null) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
  renderCards();
});

/**
 * Mock data for testing/demo purposes
 * Call loadMockData() in console to populate localStorage
 */
const MOCK_APPLICATIONS = [
  {
    id: crypto.randomUUID(),
    company: 'Apple',
    jobPosition: 'Machine Learning Engineer',
    dateApplied: '2025-01-15',
    status: 'Applied',
    bookmarked: true,
    positionType: 'Full-Time',
    location: 'Cupertino, CA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    contact: { email: 'mark.spears@apple.com' }
  },
  {
    id: crypto.randomUUID(),
    company: 'Google',
    jobPosition: 'Software Developer',
    dateApplied: '2025-01-20',
    status: 'Interviewing',
    bookmarked: false,
    positionType: 'Full-Time',
    location: 'Mountain View, CA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    contact: { email: 'alex.jobs@google.com' }
  },
  {
    id: crypto.randomUUID(),
    company: 'Netflix',
    jobPosition: 'Security Developer',
    dateApplied: '2025-01-25',
    status: 'Offer',
    bookmarked: true,
    positionType: 'Full-Time',
    location: 'Los Gatos, CA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    contact: { email: 'peter.movie@netflix.com' }
  },
  {
    id: crypto.randomUUID(),
    company: 'Microsoft',
    jobPosition: 'Product Manager',
    dateApplied: '2025-01-10',
    status: 'Rejected',
    bookmarked: false,
    positionType: 'Full-Time',
    location: 'Redmond, WA',
    contact: { email: 'pm.team@microsoft.com' }
  },
  {
    id: crypto.randomUUID(),
    company: 'Meta',
    jobPosition: 'Frontend Engineer',
    dateApplied: '2025-01-30',
    status: 'Wishlist',
    bookmarked: true,
    positionType: 'Full-Time',
    location: 'Menlo Park, CA',
    contact: { email: 'careers@meta.com' }
  }
];

/**
 * Load mock data into localStorage for testing/demo purposes
 * Usage: Open browser console and call loadMockData()
 */
function loadMockData() {
  localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  console.log('✅ Mock data loaded successfully!');
  console.log(`📊 Added ${MOCK_APPLICATIONS.length} applications to localStorage`);
  
  // Re-render if on applications page
  if (typeof renderCards === 'function') {
    renderCards();
    console.log('🔄 Applications page refreshed');
  }
}

// Make functions available globally for console use
window.loadMockData = loadMockData;
window.clearApplications = clearApplications;

function renderCards() {
  const container = document.getElementById('applicationCardsContainer');
  const cards = JSON.parse(localStorage.getItem('applications')) || [];

  // Clear existing cards to prevent duplicates
  container.innerHTML = '';

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
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.id = card.id;

    // Append card and button to wrapper
    wrapper.appendChild(cardElem);
    wrapper.appendChild(deleteBtn);

    // Add to DOM
    container.appendChild(wrapper);
  }
}

// Delegate delete clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const appId = e.target.dataset.id;
    deleteApplication(appId);
  }
});

export {
  renderCards
};
