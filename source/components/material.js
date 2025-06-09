/* global Chart */


(function() {
  // Declare variables that will hold DOM element references
  let htmlElement,
    themeToggleButton,
    themeToggleIcon,
    themeToggleLabel,
    sidebarToggleButton,
    addApplicationBtn;

  let applicationsChartInstance, statusChartInstance;

  // --- Sample Chart Data (Simulating data from a JSON file) ---
  const sampleChartData = {
    applicationsOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Applications Sent',
          data: [10, 15, 8, 12, 20, 25, 18]
        },
        {
          label: 'Interviews Scheduled',
          data: [2, 3, 1, 4, 5, 6, 3]
        }
      ]
    },
    applicationStatus: {
      labels: ['Applied', 'Screening', 'Interviewing', 'Offered', 'Rejected', 'Ghosted'],
      data: [40, 10, 15, 2, 20, 5]
    }
  };

  // --- Theme Toggle Functions ---
  function applyTheme(theme) {
    if (!htmlElement) htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);

    if (themeToggleIcon && themeToggleLabel) {
      if (theme === 'dark') {
        themeToggleIcon.textContent = 'dark_mode';
        themeToggleLabel.textContent = 'Dark Mode';
      } else {
        themeToggleIcon.textContent = 'light_mode';
        themeToggleLabel.textContent = 'Light Mode';
      }
    }
    if (typeof createCharts === 'function') {
      // Pass the chart data when re-creating charts due to theme change
      //setTimeout(() => createCharts(sampleChartData), 50);
    }
  }

  function toggleTheme() {
    if (!htmlElement) htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
  }

  // --- Sidebar Toggle Functions ---
  function applySidebarState(collapsed) {
    if (!htmlElement) htmlElement = document.documentElement;
    htmlElement.setAttribute('data-sidebar-collapsed', collapsed ? 'true' : 'false');

    const newWidth = collapsed
      ? getComputedStyle(htmlElement).getPropertyValue('--sidebar-collapsed-width')
      : getComputedStyle(htmlElement).getPropertyValue('--sidebar-expanded-width');
    htmlElement.style.setProperty('--sidebar-width', newWidth.trim());
  }

  function toggleSidebar() {
    if (!htmlElement) htmlElement = document.documentElement;
    const isCollapsed = htmlElement.getAttribute('data-sidebar-collapsed') === 'true';
    applySidebarState(!isCollapsed);
    localStorage.setItem('sidebarCollapsed', !isCollapsed);
  }

  // --- Chart.js Functions ---
  function getChartColors() {
    if (!htmlElement) htmlElement = document.documentElement;
    const style = getComputedStyle(htmlElement);
    const getColor = (prop) => style.getPropertyValue(prop).trim();

    return {
      primary: getColor('--md-sys-color-primary'),
      secondary: getColor('--md-sys-color-secondary'), // Used for second dataset in line chart
      tertiary: getColor('--md-sys-color-tertiary'),
      errorContainer: getColor('--md-sys-color-error-container'),
      onSurfaceVariant: getColor('--md-sys-color-on-surface-variant'),
      outline: getColor('--md-sys-color-outline'),
      surface: getColor('--md-sys-color-surface'),
      // For pie/doughnut, we can generate a slightly varied palette
      pieSliceColors: [
        getColor('--md-sys-color-primary'),
        getColor('--md-sys-color-secondary'),
        getColor('--md-sys-color-tertiary'),
        getColor('--md-sys-color-error-container'),
        getColor('--md-sys-color-primary-container'), // Added for more variety
        getColor('--md-sys-color-secondary-container') // Added for more variety
      ].filter(Boolean) // Filter out any potentially empty strings if a color isn't defined
    };
  }

  // Modified createCharts to accept chartData parameter
  function createCharts(chartData) {
    if (!chartData) {
      console.error('Chart data not provided to createCharts function.');
      return;
    }
    const chartColors = getChartColors();

    if (applicationsChartInstance) applicationsChartInstance.destroy();
    if (statusChartInstance) statusChartInstance.destroy();

    const applicationsCtx = document.getElementById('applicationsChart');
    if (applicationsCtx && chartData.applicationsOverTime) {
      applicationsChartInstance = new Chart(applicationsCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: chartData.applicationsOverTime.labels,
          datasets: chartData.applicationsOverTime.datasets.map((dataset, index) => ({
            ...dataset, // Spread original dataset properties (label, data)
            borderColor: index === 0 ? chartColors.primary : chartColors.secondary, // Example: use primary for first, secondary for second
            backgroundColor: (index === 0 ? chartColors.primary : chartColors.secondary) + '33', // Add alpha
            tension: 0.3,
            fill: true
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, grid: { color: chartColors.outline }, ticks: { color: chartColors.onSurfaceVariant } },
            x: { grid: { color: chartColors.outline }, ticks: { color: chartColors.onSurfaceVariant } }
          },
          plugins: {
            legend: { labels: { color: chartColors.onSurfaceVariant } }
          }
        }
      });
    }

    const statusCtx = document.getElementById('statusChart');
    if (statusCtx && chartData.applicationStatus) {
      statusChartInstance = new Chart(statusCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: chartData.applicationStatus.labels,
          datasets: [{
            label: 'Application Status', // This label might not be directly visible on doughnut but good for context
            data: chartData.applicationStatus.data,
            backgroundColor: chartColors.pieSliceColors.slice(0, chartData.applicationStatus.labels.length), // Ensure enough colors
            borderColor: chartColors.surface,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: chartColors.onSurfaceVariant } }
          }
        }
      });
    }
  }

  // --- Event Listeners and Initial Setup ---
  function initializeApp() {
    htmlElement = document.documentElement;
    themeToggleButton = document.getElementById('themeToggle');
    themeToggleIcon = document.getElementById('themeToggleIcon');
    themeToggleLabel = document.getElementById('themeToggleLabel');
    sidebarToggleButton = document.getElementById('sidebarToggle');
    addApplicationBtn = document.getElementById('addApplicationBtn');

    if (themeToggleButton) {
      themeToggleButton.addEventListener('click', toggleTheme);
    }
    if (sidebarToggleButton) {
      sidebarToggleButton.addEventListener('click', toggleSidebar);
    }
    if (addApplicationBtn) {
      addApplicationBtn.addEventListener('click', () => {
        console.log('Add new application clicked!');
      });
    }

    const savedTheme = localStorage.getItem('appTheme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (systemPrefersDark) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }

    if (window.innerWidth > 768) {
      const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
      applySidebarState(savedSidebarState);
    } else {
      applySidebarState(true);
    }

    // Create charts with the sample data Commented out for now
    // Uncomment the line below to create charts with sample data
    //createCharts(sampleChartData);
  }

  document.addEventListener('DOMContentLoaded', initializeApp);

})(); // End of IIFE
