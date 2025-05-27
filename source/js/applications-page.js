import '../components/job-card.js';

document.addEventListener('DOMContentLoaded', async () => {
  const jobs = await fetchApplications();
  localStorage.setItem('applications', JSON.stringify(jobs));
  renderCards(jobs);
  setupModal();
});

async function fetchApplications() {
  try {
    const response = await fetch('../data/applications.json'); // adjust path if needed
    if (!response.ok) throw new Error('Failed to load applications.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading applications:', error);
    return []; // fallback to empty list
  }
}

function renderCards(jobs) {
  const container = document.getElementById('applicationCardsContainer');
  container.innerHTML = '';

  for (const job of jobs) {
    const cardElem = document.createElement('job-app-card');
    cardElem.data = job;
    cardElem.addEventListener('click', () => openModal(job));
    container.appendChild(cardElem);
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
