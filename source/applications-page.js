import './components/job-card.js';

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('applications') === null) {
    localStorage.setItem('applications', JSON.stringify(jobs));
  }
  renderCards();
});

const jobs = [
  {
    company: 'Apple',
    jobPosition: 'Machine Learning Engineer',
    dateApplied: '2025-03-19',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    contact: { email: 'mark.spears@apple.com' }
  },
  {
    company: 'Google',
    jobPosition: 'Software Developer',
    dateApplied: '2025-04-19',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    contact: { email: 'alex.jobs@google.com' }
  },
  {
    company: 'Netflix',
    jobPosition: 'Security Developer',
    dateApplied: '2025-04-24',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    contact: { email: 'peter.movie@netflix.com' }
  },
];

function renderCards() {
  const container = document.getElementById('applicationCardsContainer');

  const cards = JSON.parse(localStorage.getItem('applications'));
  for (const card of cards) {
    const cardElem = document.createElement('job-app-card');
    cardElem.data = card;
    container.appendChild(cardElem);
  };
}

export {
  renderCards
};
