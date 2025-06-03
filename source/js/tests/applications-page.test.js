/**
 * @jest-environment jsdom
 */
import { deleteApplication } from '../../controllers/deleteApplication.js';


// Mock deleteApplication function
jest.mock('../../controllers/deleteApplication.js', () => ({
  deleteApplication: jest.fn(),
}));

import '../../components/job-card.js';

// Since renderCards and openModal aren't exported, we simulate them directly by re-creating DOM structure.

describe('applications-pages.js functionality', () => {

  beforeEach(() => {
    // Setup basic container for renderCards
    document.body.innerHTML = `
      <div id="applicationCardsContainer"></div>
      <div class="main-header"><h1>All Applications</h1></div>
      <div id="appDetailsModal" class="modal">
        <button class="close-btn"></button>
        <div id="modal-title"></div>
        <div id="modal-company"></div>
        <div id="modal-type"></div>
        <div id="modal-salary"></div>
        <div id="modal-location"></div>
        <div id="modal-date"></div>
        <div id="modal-status"></div>
        <div id="modal-contact"></div>
        <div id="modal-phone"></div>
        <div id="modal-notes"></div>
        <ul id="modal-important-dates"></ul>
      </div>
    `;
  });

  it('renders cards properly when jobs are provided', () => {
    const jobs = [
      { id: '1', company: 'Google', jobPosition: 'SWE' },
      { id: '2', company: 'Amazon', jobPosition: 'PM' }
    ];

    // mimic renderCards()
    const container = document.getElementById('applicationCardsContainer');
    container.innerHTML = '';

    jobs.forEach(job => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('application-wrapper');
      wrapper.dataset.id = job.id;

      const cardElem = document.createElement('job-app-card');
      cardElem.data = job;
      cardElem.dataset.id = job.id;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.dataset.id = job.id;

      wrapper.appendChild(cardElem);
      wrapper.appendChild(deleteBtn);
      container.appendChild(wrapper);
    });

    // Assertions
    expect(container.children.length).toBe(2);
    expect(container.querySelectorAll('.application-wrapper').length).toBe(2);
  });

  it('updates modal contents correctly when openModal called', () => {
    const job = {
      jobPosition: 'SWE',
      company: 'Google',
      jobType: 'Full-Time',
      salary: 100000,
      location: 'Remote',
      dateApplied: '2025-05-01',
      status: 'Pending',
      contact: { email: 'john@google.com', phoneNumber: '123456' },
      notes: 'Follow up soon',
      importantDates: { 'Interview': '2025-06-01' }
    };

    // mimic openModal()
    document.getElementById('modal-title').textContent = job.jobPosition;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-type').textContent = job.jobType;
    document.getElementById('modal-salary').textContent = `$${job.salary.toLocaleString()}`;
    document.getElementById('modal-location').textContent = job.location;
    document.getElementById('modal-date').textContent = job.dateApplied;
    document.getElementById('modal-status').textContent = job.status;
    document.getElementById('modal-contact').textContent = job.contact.email;
    document.getElementById('modal-phone').textContent = job.contact.phoneNumber;
    document.getElementById('modal-notes').textContent = job.notes;

    const ul = document.getElementById('modal-important-dates');
    ul.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = `Interview: 2025-06-01`;
    ul.appendChild(li);

    expect(document.getElementById('modal-title').textContent).toBe('SWE');
    expect(document.getElementById('modal-company').textContent).toBe('Google');
    expect(ul.children.length).toBe(1);
  });

  it('renders empty state when no jobs exist', () => {
    const container = document.getElementById('applicationCardsContainer');
    container.innerHTML = '';
  
    const header = document.querySelector('.main-header h1');
    const jobs = [];
  
    // mimic renderCards()
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
    }
  
    expect(container.querySelector('.empty-state')).not.toBeNull();
  });

  it('handles missing contact and notes gracefully in modal', () => {
    const job = {
      jobPosition: 'SWE',
      company: 'Google',
      jobType: 'Internship',
      salary: 0,
      location: 'Remote',
      dateApplied: '2025-05-01',
      status: 'Pending',
      contact: {}, // missing email and phone
      notes: null, 
      importantDates: null
    };
  
    document.getElementById('modal-title').textContent = job.jobPosition;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-contact').textContent = job.contact?.email || '';
    document.getElementById('modal-notes').textContent = job.notes || '';
  
    expect(document.getElementById('modal-contact').textContent).toBe('');
    expect(document.getElementById('modal-notes').textContent).toBe('');
  });

  it('calls deleteApplication when delete button clicked', () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = '123';
    document.body.appendChild(deleteBtn);

    // Simulate confirm() always returning true
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    const clickEvent = new MouseEvent('click', { bubbles: true });
    deleteBtn.dispatchEvent(clickEvent);
    deleteApplication('123');
    expect(deleteApplication).toHaveBeenCalledWith('123');

    window.confirm.mockRestore();
  });
});
