import '../components/job-card.js';
import { deleteApplication } from '../controllers/deleteApplication.js';

// Load applications from JSON file and render
// Only run once if localStorage is empty (first visit)
document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('applications')) {
    const jobs = await fetchApplications();
    localStorage.setItem('applications', JSON.stringify(jobs));
  }
  const jobs = JSON.parse(localStorage.getItem('applications'));
  renderCards(jobs);
  setupModal();
});

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

function renderCards(jobs) {
  const container = document.getElementById('applicationCardsContainer');
  container.innerHTML = '';

  const header = document.querySelector('.main-header h1');
  if (header) {
    header.textContent = `All Applications (${jobs.length})`;
  }

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

  for (const job of jobs) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('application-wrapper');
    wrapper.dataset.id = job.id;

    const cardElem = document.createElement('job-app-card');
    cardElem.data = job;
    cardElem.dataset.id = job.id;
    cardElem.addEventListener('click', () => openModal(job));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = `
      <span class="material-symbols-outlined">delete</span>
      <span class="delete-text">Delete</span>
    `;
    deleteBtn.dataset.id = job.id;
    deleteBtn.title = 'Delete this application';

    wrapper.appendChild(cardElem);
    wrapper.appendChild(deleteBtn);
    

    container.appendChild(wrapper);
  }
}

function setupModal() {
  const modal = document.getElementById('appDetailsModal');
  const closeBtn = modal.querySelector('.close-btn');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('show');
    }
  });
}

function openModal(data) {
  const modal = document.getElementById('appDetailsModal');
  modal.classList.add('show');

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

document.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    const appId = deleteBtn.dataset.id;
    if (confirm('Are you sure you want to delete this application?')) {
      deleteApplication(appId);
      setTimeout(() => {
        const remainingCards = JSON.parse(localStorage.getItem('applications')) || [];
        const header = document.querySelector('.main-header h1');
        if (header) header.textContent = `All Applications (${remainingCards.length})`;
        if (remainingCards.length === 0) {
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
      }, 300);
    }
  }
});
