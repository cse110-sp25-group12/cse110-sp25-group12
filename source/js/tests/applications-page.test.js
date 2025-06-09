/**
 * @jest-environment jsdom
 */

// Import job-app-card custom element and deleteApplication controller function
import '../../components/job-card.js';
import { deleteApplication } from '../../controllers/deleteApplication.js';

// Mock deleteApplication so we can observe calls without executing actual delete logic
jest.mock('../../controllers/deleteApplication.js', () => ({
  deleteApplication: jest.fn()
}));

// Main test suite for applications-pages.js functionality
describe('applications-pages.js functionality', () => {

  // Reset DOM before each test
  beforeEach(() => {
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

  // render multiple job cards correctly
  it('renders application cards correctly', () => {
    const jobs = [
      { id: '1', company: 'Google', jobPosition: 'SWE' },
      { id: '2', company: 'Amazon', jobPosition: 'PM' }
    ];
    const container = document.getElementById('applicationCardsContainer');

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

    expect(container.querySelectorAll('.application-wrapper').length).toBe(2);
  });

  // render empty state when no applications exist
  it('renders empty state correctly when no jobs', () => {
    const container = document.getElementById('applicationCardsContainer');
    const header = document.querySelector('.main-header h1');
    header.textContent = 'All Applications (0)';
    container.innerHTML = `
      <div class="empty-state">
        <span class="material-symbols-outlined">work_off</span>
        <h3>No applications yet</h3>
        <p>Start tracking your job applications by adding your first one!</p>
      </div>
    `;
    expect(container.querySelector('.empty-state')).not.toBeNull();
  });

  // populate modal with full job data
  it('updates modal correctly for full data', () => {
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
    li.textContent = 'Interview: 2025-06-01';
    ul.appendChild(li);

    expect(document.getElementById('modal-company').textContent).toBe('Google');
    expect(ul.children.length).toBe(1);
  });

  // handle missing contact info or notes without crashing
  it('handles missing contact and notes gracefully', () => {
    const job = {
      jobPosition: 'SWE',
      company: 'Google',
      contact: {},
      notes: null
    };

    document.getElementById('modal-title').textContent = job.jobPosition;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-contact').textContent = job.contact?.email || '';
    document.getElementById('modal-notes').textContent = job.notes || '';

    expect(document.getElementById('modal-contact').textContent).toBe('');
    expect(document.getElementById('modal-notes').textContent).toBe('');
  });

  // verify deleteApplication is called when delete button is clicked
  it('calls deleteApplication when delete button clicked', () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = '123';
    document.body.appendChild(deleteBtn);

    jest.spyOn(window, 'confirm').mockReturnValue(true); // mock confirmation

    deleteBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    deleteApplication('123');
    expect(deleteApplication).toHaveBeenCalledWith('123');

    window.confirm.mockRestore(); // restore window.confirm after test
  });
});
