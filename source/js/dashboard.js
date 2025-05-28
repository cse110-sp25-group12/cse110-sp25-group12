document.addEventListener('DOMContentLoaded', () => {
  const applications = JSON.parse(localStorage.getItem('applications')) || [];

  // === DOM References ===
  const totalApplicationsEl = document.querySelector(
    '.content-card:nth-child(1) .content-card-stat'
  );
  const interviewsScheduledEl = document.querySelector(
    '.content-card:nth-child(2) .content-card-stat'
  );
  const activeProcessesEl = document.querySelector(
    '.content-card:nth-child(3) .content-card-stat'
  );
  const offersReceivedEl = document.querySelector(
    '.content-card:nth-child(4) .content-card-stat'
  );

  const applicationsChartEl = document.getElementById('applicationsChart');
  const statusChartEl = document.getElementById('statusChart');

  // === Static Summary Stats  ===
  totalApplicationsEl.textContent = applications.length;
  interviewsScheduledEl.textContent = applications.filter(
    (app) => app.status === 'Interviewing'
  ).length;
  activeProcessesEl.textContent = applications.filter((app) =>
    ['Applied', 'Screening', 'Interviewing'].includes(app.status)
  ).length;
  offersReceivedEl.textContent = applications.filter(
    (app) => app.status === 'Offer'
  ).length;

  // === Chart Colors ===
  const getCSSColor = (varName) =>
    getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const chartColors = {
    primary: getCSSColor('--md-sys-color-primary') || '#4f46e5',
    secondary: getCSSColor('--md-sys-color-secondary') || '#06b6d4',
    surface: getCSSColor('--md-sys-color-surface') || '#fff',
    outline: getCSSColor('--md-sys-color-outline') || '#e5e7eb',
    onSurfaceVariant:
      getCSSColor('--md-sys-color-on-surface-variant') || '#6b7280',
    pieSliceColors: [
      '#4f46e5',
      '#06b6d4',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#9ca3af',
    ],
  };

  // === Applications Over Time  ===
  new Chart(applicationsChartEl.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Applications Sent',
          data: [10, 15, 8, 12, 20, 25, 18],
          borderColor: chartColors.primary,
          backgroundColor: chartColors.primary + '33',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Interviews Scheduled',
          data: [2, 3, 1, 4, 5, 6, 3],
          borderColor: chartColors.secondary,
          backgroundColor: chartColors.secondary + '33',
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: chartColors.outline },
          ticks: { color: chartColors.onSurfaceVariant },
        },
        x: {
          grid: { color: chartColors.outline },
          ticks: { color: chartColors.onSurfaceVariant },
        },
      },
      plugins: {
        legend: { labels: { color: chartColors.onSurfaceVariant } },
      },
    },
  });

  // === Dynamic Status Breakdown Chart ===
  const statusLabels = [
    'Applied',
    'Screening',
    'Interviewing',
    'Offer',
    'Rejected',
    'Ghosted',
  ];
  const statusCounts = {
    Applied: 0,
    Screening: 0,
    Interviewing: 0,
    Offer: 0,
    Rejected: 0,
    Ghosted: 0,
  };

  applications.forEach((app) => {
    const status = app.status || 'Applied'; // fallback if missing
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    }
  });

  new Chart(statusChartEl.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: statusLabels,
      datasets: [
        {
          label: 'Application Status',
          data: statusLabels.map((label) => statusCounts[label]),
          backgroundColor: chartColors.pieSliceColors,
          borderColor: chartColors.surface,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: chartColors.onSurfaceVariant },
        },
      },
    },
  });

  // === Reset Button ===
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const confirmReset = confirm(
        'Are you sure you want to clear all application data?'
      );
      if (confirmReset) {
        localStorage.removeItem('applications');
        location.reload();
      }
    });
  }
});
