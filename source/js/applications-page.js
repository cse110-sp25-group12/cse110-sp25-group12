import '../components/job-card.js';

const jobs = [
  {
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  },
  {
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  },
  {
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
    status: 'Offered',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify(jobs));
  }
  renderCards();
  setupModal();
});

function renderCards() {
  const container = document.getElementById('applicationCardsContainer');
  const cards = JSON.parse(localStorage.getItem('applications'));

  for (const job of cards) {
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