import '../components/job-card.js'; // Ensure the component is registered

const jobData = [
  {
    company: 'Acme Corp',
    title: 'Senior UX Designer',
    position: 'Full-Time',
    logo: 'https://example.com/logo1.png',
    requirements: [
      '5+ years experience',
      'Portfolio',
      'Good communication'
    ]
  },
  {
    company: 'Globex Inc.',
    title: 'Frontend Developer',
    position: 'Remote',
    logo: 'https://example.com/logo2.png',
    requirements: [
      'React',
      'JavaScript',
      'CSS'
    ]
  }
];

// Add cards to <main>
const main = document.querySelector('main');

function renderCards(data) {
  main.innerHTML = '';
  data.forEach(job => {
    const card = document.createElement('job-app-card');
    card.data = job;
    main.appendChild(card);
  });
}

// ==========================
// Filter Button Logic (Seyed)
// ==========================

const filterBar = document.getElementById('filter-bar');
const dropdown = document.getElementById('filter-dropdown');

function addFilterTag(label) {
  if (document.querySelector(`.filter-btn[data-filter="${label}"]`)) return;

  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.setAttribute('data-filter', label);
  btn.innerHTML = `${label} <span class="material-symbols-outlined remove-icon">close</span>`;

  btn.querySelector('.remove-icon').addEventListener('click', () => {
    btn.remove();

    // Uncheck corresponding checkbox
    const checkbox = dropdown.querySelector(`input[value="${label}"]`);
    if (checkbox) checkbox.checked = false;

    updateVisibleCards();
  });

  filterBar.appendChild(btn);
  updateVisibleCards();
}

// Hook up checkboxes in the dropdown
const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const value = checkbox.value;
    if (checkbox.checked) {
      addFilterTag(value);
    } else {
      const tag = document.querySelector(`.filter-btn[data-filter="${value}"]`);
      if (tag) tag.remove();
      updateVisibleCards();
    }
  });
});

// ==========================
// Filter Dropdown Toggle (Seyed)
// ==========================

const toggleBtn = document.getElementById('filter-toggle-btn');
toggleBtn.addEventListener('click', () => {
  dropdown.classList.toggle('hidden');
});

// ==========================
// Sorting Logic (Seyed)
// ==========================

const sortSelect = document.getElementById('sort-select');
let currentSort = ''; // keep track of the current sort

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  updateVisibleCards(); // sort filtered results too
});

// ==========================
// Filtering (Seyed)
// ==========================
function updateVisibleCards() {
  const activeFilters = Array.from(document.querySelectorAll('.filter-btn'))
    .map(btn => btn.getAttribute('data-filter'));

  let filtered = [...jobData];

  if (activeFilters.length > 0) {
    filtered = filtered.filter(job => activeFilters.includes(job.position));
  }

  if (currentSort === 'company') {
    filtered.sort((a, b) => a.company.localeCompare(b.company));
  } else if (currentSort === 'position') {
    filtered.sort((a, b) => a.position.localeCompare(b.position));
  }

  if (filtered.length === 0) {
    main.innerHTML = '<p style="padding: 1rem; color: #888;">No applications match the selected filters.</p>';
    return;
  }

  renderCards(filtered);
}

// ==========================
// Initial Render (Seyed)
// ==========================
renderCards(jobData);
