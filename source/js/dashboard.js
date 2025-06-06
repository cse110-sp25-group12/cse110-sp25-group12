import Chart from 'chart.js/auto';

/**
 * Main function that initializes the dashboard and renders all charts and statistics
 * Loads application data from localStorage and displays relevant metrics
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load applications from localStorage or use empty array if none exists
  const applications = JSON.parse(localStorage.getItem('applications')) || [];

  // === DOM References ===
  const totalApplicationsEl = document.querySelector(
    '.content-card:nth-child(1) .content-card-stat'
  );
  const totalApplicationsDetailsEl = document.querySelector(
    '.content-card:nth-child(1) .content-card-details p'
  );
  const interviewsScheduledEl = document.querySelector(
    '.content-card:nth-child(2) .content-card-stat'
  );
  const interviewsScheduledDetailsEl = document.querySelector(
    '.content-card:nth-child(2) .content-card-details p'
  );
  const activeProcessesEl = document.querySelector(
    '.content-card:nth-child(3) .content-card-stat'
  );
  const activeProcessesDetailsEl = document.querySelector(
    '.content-card:nth-child(3) .content-card-details p'
  );
  const offersReceivedEl = document.querySelector(
    '.content-card:nth-child(4) .content-card-stat'
  );
  const offersReceivedDetailsEl = document.querySelector(
    '.content-card:nth-child(4) .content-card-details p'
  );

  const applicationsChartEl = document.getElementById('applicationsChart');
  const statusChartEl = document.getElementById('statusChart');

  /**
   * Returns applications submitted during the current week
   * @returns {Array} Applications from the current week
   */
  const getThisWeeksApplications = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    return applications.filter((app) => {
      if (!app.dateApplied) return false;
      const appDate = new Date(app.dateApplied);
      return appDate >= startOfWeek;
    });
  };

  /**
   * Returns applications submitted during the previous week
   * @returns {Array} Applications from the previous week
   */
  const getPreviousWeeksApplications = () => {
    const today = new Date();
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfPrevWeek = new Date(startOfThisWeek);
    startOfPrevWeek.setDate(startOfThisWeek.getDate() - 7);

    const endOfPrevWeek = new Date(startOfThisWeek);
    endOfPrevWeek.setMilliseconds(-1);

    return applications.filter((app) => {
      if (!app.dateApplied) return false;
      const appDate = new Date(app.dateApplied);
      return appDate >= startOfPrevWeek && appDate <= endOfPrevWeek;
    });
  };

  /**
   * Returns upcoming interviews (scheduled for today or later)
   * @returns {Array} Applications with upcoming interviews
   */
  const getUpcomingInterviews = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return applications.filter((app) => {
      if (app.status !== 'Interviewing') return false;

      // Check if interview date exists in importantDates
      if (app.importantDates) {
        const interviewDateStr =
          app.importantDates['Technical Interview'] ||
          app.importantDates['Phone Interview'] ||
          app.importantDates['Interview'];

        if (interviewDateStr) {
          const interviewDate = new Date(interviewDateStr);
          return interviewDate >= today;
        }
      }
      return false;
    });
  };

  /**
   * Returns applications awaiting feedback (Applied or Screening status)
   * @returns {Array} Applications awaiting feedback
   */
  const getAwaitingFeedback = () => {
    return applications.filter(
      (app) => app.status === 'Applied' || app.status === 'Screening'
    );
  };

  /**
   * Returns offers received in the last 7 days
   * @returns {Array} Recently received offers
   */
  const getNewOffers = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return applications.filter((app) => {
      if (app.status !== 'Offer' && app.status !== 'Offered') return false;

      // If we don't have status update date, check the application date
      const dateToCheck = app.statusUpdateDate || app.dateApplied;
      if (!dateToCheck) return false;

      const date = new Date(dateToCheck);
      return date >= oneWeekAgo;
    });
  };

  /**
   * Organizes applications data by month for time-series chart
   * @returns {Object} Object containing months labels and datasets
   */
  const getApplicationsByMonth = () => {
    // Define all months
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Initialize counters for each month
    const appsByMonth = Array(12).fill(0);
    const interviewsByMonth = Array(12).fill(0);

    // Current year
    const currentYear = new Date().getFullYear();

    applications.forEach((app) => {
      if (app.dateApplied) {
        const appDate = new Date(app.dateApplied);

        // Only count applications from current year
        if (appDate.getFullYear() === currentYear) {
          const month = appDate.getMonth();
          appsByMonth[month]++;

          // Count interviews and offers
          if (
            app.status === 'Interviewing' ||
            app.status === 'Offer' ||
            app.status === 'Offered'
          ) {
            interviewsByMonth[month]++;
          }
        }
      }
    });

    // Find the first and last month with data
    let firstMonthWithData = 0;
    let lastMonthWithData = 11;

    for (let i = 0; i < 12; i++) {
      if (appsByMonth[i] > 0) {
        firstMonthWithData = i;
        break;
      }
    }

    for (let i = 11; i >= 0; i--) {
      if (appsByMonth[i] > 0) {
        lastMonthWithData = i;
        break;
      }
    }

    // Include at least 6 months or up to current month
    const currentMonth = new Date().getMonth();
    firstMonthWithData = Math.min(
      firstMonthWithData,
      Math.max(0, currentMonth - 5)
    );
    lastMonthWithData = Math.max(lastMonthWithData, Math.min(currentMonth, 11));

    // Extract relevant months
    const relevantMonths = [];
    const applicationsData = [];
    const interviewsData = [];

    for (let i = firstMonthWithData; i <= lastMonthWithData; i++) {
      relevantMonths.push(months[i]);
      applicationsData.push(appsByMonth[i]);
      interviewsData.push(interviewsByMonth[i]);
    }

    // If no data, provide at least 3 months of empty data
    if (relevantMonths.length === 0) {
      const currentMonth = new Date().getMonth();
      for (let i = Math.max(0, currentMonth - 2); i <= currentMonth; i++) {
        relevantMonths.push(months[i]);
        applicationsData.push(0);
        interviewsData.push(0);
      }
    }

    return {
      months: relevantMonths,
      applications: applicationsData,
      interviews: interviewsData,
    };
  };

  // === Update Dashboard Statistics ===

  // Check if elements exist before updating content
  if (totalApplicationsEl) {
    totalApplicationsEl.textContent = applications.length;
  }

  if (interviewsScheduledEl) {
    const interviewCount = applications.filter(
      (app) => app.status === 'Interviewing'
    ).length;
    interviewsScheduledEl.textContent = interviewCount;
  }

  if (activeProcessesEl) {
    const activeCount = applications.filter((app) =>
      ['Applied', 'Screening', 'Interviewing'].includes(app.status)
    ).length;
    activeProcessesEl.textContent = activeCount;
  }

  if (offersReceivedEl) {
    const offerCount = applications.filter(
      (app) => app.status === 'Offer' || app.status === 'Offered'
    ).length;
    offersReceivedEl.textContent = offerCount;
  }

  // Update dynamic stats below the main numbers
  if (totalApplicationsDetailsEl) {
    const thisWeekApps = getThisWeeksApplications();
    const prevWeekApps = getPreviousWeeksApplications();
    const weekOverWeekChange = thisWeekApps.length - prevWeekApps.length;
    const changeText =
      weekOverWeekChange >= 0
        ? `+${weekOverWeekChange}`
        : weekOverWeekChange;
    totalApplicationsDetailsEl.textContent = `${changeText} this week`;
  }

  if (interviewsScheduledDetailsEl) {
    const upcomingInterviews = getUpcomingInterviews();
    interviewsScheduledDetailsEl.textContent = `${upcomingInterviews.length} upcoming`;
  }

  if (activeProcessesDetailsEl) {
    const awaitingFeedback = getAwaitingFeedback();
    activeProcessesDetailsEl.textContent = `Awaiting feedback for ${awaitingFeedback.length}`;
  }

  if (offersReceivedDetailsEl) {
    const newOffers = getNewOffers();
    offersReceivedDetailsEl.textContent =
      newOffers.length > 0
        ? `${newOffers.length} new offer${
          newOffers.length > 1 ? 's' : ''
        }!`
        : 'No new offers';
  }

  // === Chart Colors ===
  /**
   * Gets CSS color from root variables
   * @param {string} varName - CSS variable name
   * @returns {string} Color value or fallback
   */
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

  // === Applications Over Time Chart ===
  if (applicationsChartEl) {
    const monthlyData = getApplicationsByMonth();

    try {
      new Chart(applicationsChartEl.getContext('2d'), { /*eslint-disable-line */
        type: 'line',
        data: {
          labels: monthlyData.months,
          datasets: [
            {
              label: 'Applications Sent',
              data: monthlyData.applications,
              borderColor: chartColors.primary,
              backgroundColor: chartColors.primary + '33',
              tension: 0.3,
              fill: true,
            },
            {
              label: 'Interviews Scheduled',
              data: monthlyData.interviews,
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
    } catch (error) {
      console.error('Error creating applications chart:', error);
    }
  }

  // === Dynamic Status Breakdown Chart ===
  if (statusChartEl) {
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

    // Handle both 'Offer' and 'Offered' statuses
    applications.forEach((app) => {
      let status = app.status || 'Applied'; // fallback if missing

      // Map 'Offered' to 'Offer' for consistency
      if (status === 'Offered') status = 'Offer';

      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    try {
      new Chart(statusChartEl.getContext('2d'), { /*eslint-disable-line */
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
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage =
                    total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating status chart:', error);
    }
  }

  // === Reset Button ===
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const confirmReset = confirm(
        'Are you sure you want to clear all application data?'
      );
      if (confirmReset) {
        try {
          localStorage.removeItem('applications');
          location.reload();
        } catch (error) {
          console.error('Error clearing application data:', error);
          alert('Failed to clear application data. Please try again.');
        }
      }
    });
  }
});
