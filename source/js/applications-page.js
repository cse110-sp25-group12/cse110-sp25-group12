import '../components/job-card.js';
import { deleteApplication } from '../controllers/deleteApplication.js';
import { updateApplication } from '../controllers/updateApplication.js';
import { initSortingControls } from '../controllers/sorting-controls.js';

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
  // If no jobs parameter is provided, get from localStorage
  if (!jobs) {
    jobs = JSON.parse(localStorage.getItem('applications')) || [];
  }
  
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

    const updateBtn = document.createElement('button');
    updateBtn.classList.add('update-btn');
    updateBtn.innerHTML = `
      <span class="material-symbols-outlined">edit</span>
      <span class="update-text">Edit</span>
    `;
    updateBtn.dataset.id = job.id;
    updateBtn.title = 'Edit this application';
    updateBtn.style.display = 'flex'; // Ensure it's visible

    updateBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent modal from opening

      // Prevent multiple forms from stacking
      const existingForm = wrapper.querySelector('.inline-update-form');
      if (existingForm) {
        existingForm.remove();
        return;
      }

      if (!document.getElementById('inline-update-style')) {
        const style = document.createElement('style');
        style.id = 'inline-update-style';
        style.textContent = `
          .inline-update-form {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            max-width: 260px;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 8px;
          }
          .inline-update-form label {
            color: #f0f0f0; 
            font-weight: 500;
          }
          .inline-update-form input {
            padding: 4px 6px;
            width: 100%;
            box-sizing: border-box;
          }
          .inline-update-form .button-row {
            display: flex;
            gap: 8px;
            justify-content: flex-start;
          }
          .inline-update-form button {
            padding: 4px 10px;
            font-size: 0.9rem;
            width: auto;
            cursor: pointer;
          }
          .inline-update-form textarea {
            padding: 4px 6px;
            font-size: 0.9rem;
            resize: vertical;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            color: #000;
            width: 100%;
            box-sizing: border-box;
          }
        `;
        document.head.appendChild(style);
      }

      const form = document.createElement('form');
      form.classList.add('inline-update-form');
      form.innerHTML = `
      <label>Company:<input type="text" name="company" value="${job.company}" required /></label>
      <label>Job Position: <input type="text" name="jobPosition" value="${job.jobPosition}" required /></label>
      <label>Job Type: <input type="text" name="jobType" value="${job.jobType || ''}" /></label>
      <label>Location: <input type="text" name="location" value="${job.location || ''}" /></label>
      <label>Salary: <input type="number" name="salary" value="${job.salary || ''}" /></label>
      <label>Date Applied: <input type="date" name="dateApplied" value="${job.dateApplied || ''}" /></label>
      <label>Status: <input type="text" name="status" value="${job.status || ''}" /></label>
      <label>Contact Email: <input type="email" name="email" value="${job.contact?.email || ''}" /></label>
      <label>Phone Number: <input type="tel" name="phone" value="${job.contact?.phoneNumber || ''}" /></label>
      <label>Notes: <textarea name="notes" rows="2">${job.notes || ''}</textarea></label>
      <div class="button-row">
        <button type="submit">Save</button>
        <button type="button" class="cancel-update">Cancel</button>
      </div>
    `;

      // Add event listeners
      form.querySelector('.cancel-update').addEventListener('click', () => {
        form.remove();
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedData = {
          company: form.company.value.trim(),
          jobPosition: form.jobPosition.value.trim(),
          jobType: form.jobType.value.trim(),
          location: form.location.value.trim(),
          salary: Number(form.salary.value),
          dateApplied: form.dateApplied.value,
          status: form.status.value.trim(),
          contact: {
            email: form.email.value.trim(),
            phoneNumber: form.phone.value.trim()
          },
          notes: form.notes.value.trim(),
        };

        const updatedApp = updateApplication(job.id, updatedData);
        if (updatedApp) {
          updateCardInDOM(job.id);
          form.remove();
          location.reload();
        }
      });

      wrapper.appendChild(form);
    });

    wrapper.appendChild(cardElem);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(updateBtn);

    // Debug logging to verify buttons are created
    console.log('Created buttons for job:', job.id, {
      deleteBtn: deleteBtn.classList.contains('delete-btn'),
      updateBtn: updateBtn.classList.contains('update-btn'),
      wrapperChildren: wrapper.children.length,
      updateBtnDisplay: window.getComputedStyle(updateBtn).display,
      updateBtnPosition: window.getComputedStyle(updateBtn).position,
      updateBtnTop: window.getComputedStyle(updateBtn).top,
      updateBtnRight: window.getComputedStyle(updateBtn).right
    });

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

export function updateCardInDOM(applicationId) {
  const cardElement = document.querySelector(`job-app-card[data-id="${applicationId}"]`);
  if (!cardElement) return;

  // Get the latest updated data from localStorage
  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  const updatedCard = cards.find(card => card.id === applicationId);
  if (!updatedCard) return;

  // Update the card by re-setting its data (re-renders the shadow DOM)
  cardElement.data = updatedCard;

  // Optional: Visual feedback
  const wrapper = cardElement.closest('.application-wrapper');
  if (wrapper) {
    wrapper.style.transition = 'background-color 0.3s ease';
    wrapper.style.backgroundColor = 'rgba(100, 255, 100, 0.2)';
    setTimeout(() => {
      wrapper.style.backgroundColor = '';
    }, 300);
  }
}

// Make renderCards available globally for sorting functionality
window.renderCards = renderCards;



