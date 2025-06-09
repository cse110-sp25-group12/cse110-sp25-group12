import puppeteer from 'puppeteer';

const isCI = process.env.GITHUB_ACTIONS === 'true';

// Test data for filtering functionality - diverse statuses and companies
const filterTestData = [
  {
    id: '1',
    company: 'Google',
    jobPosition: 'Software Engineer',
    status: 'Applied',
    dateApplied: '2025-01-15',
    positionType: 'Full-Time',
    salary: 140000,
    location: 'Mountain View, CA'
  },
  {
    id: '2',
    company: 'Meta',
    jobPosition: 'Product Designer',
    status: 'Interviewing',
    dateApplied: '2025-02-01',
    positionType: 'Full-Time',
    salary: 120000,
    location: 'Menlo Park, CA'
  },
  {
    id: '3',
    company: 'Apple',
    jobPosition: 'iOS Developer',
    status: 'Rejected',
    dateApplied: '2025-01-20',
    positionType: 'Full-Time',
    salary: 130000,
    location: 'Cupertino, CA'
  },
  {
    id: '4',
    company: 'Netflix',
    jobPosition: 'Data Scientist',
    status: 'Applied',
    dateApplied: '2025-02-10',
    positionType: 'Contract',
    salary: 110000,
    location: 'Los Gatos, CA'
  }
];

// Puppeteer-based tests for Applications Page Filtering functionality
describe('Applications Page Filtering E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup: Launch browser and preload filtering test data
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: isCI,
      slowMo: isCI ? 0 : 50,
      args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
    });
    page = await browser.newPage();

    // Inject test data into localStorage before page navigation
    await page.evaluateOnNewDocument((data) => {
      localStorage.setItem('applications', JSON.stringify(data));
    }, filterTestData);

    await page.goto('http://127.0.0.1:5500/source/pages/applications.html', { waitUntil: 'domcontentloaded' });

    // Wait for page to fully render
    await new Promise(res => setTimeout(res, 1000));
  }, 30000);

  // Close browser after tests finish
  afterAll(async () => {
    await browser.close();
  });

  // Test: Filter applications by status (show only specific status)
  test('should filter applications by status', async () => {
    const statusFilter = await page.$('#statusFilter');
    if (statusFilter) {
      // Filter to show only "Applied" status applications
      await page.select('#statusFilter', 'Applied');
      await new Promise(res => setTimeout(res, 500));

      // Count visible application cards (not hidden by CSS display:none)
      const visibleCards = await page.$$eval('.application-wrapper:not([style*="display: none"])', els => els.length);

      // Should show 2 applications (Google and Netflix both have "Applied" status)
      expect(visibleCards).toBe(2);
    }
  });

  // Test: Search applications by company name using search input
  test('should search applications by company name', async () => {
    const searchInput = await page.$('#searchInput');
    if (searchInput) {
      // Clear any existing filters first
      const clearButton = await page.$('#clearFilters');
      if (clearButton) {
        await page.click('#clearFilters');
        await new Promise(res => setTimeout(res, 300));
      }

      // Search for "Google"
      await page.type('#searchInput', 'Google');
      await new Promise(res => setTimeout(res, 500));

      // Count visible application cards
      const visibleCards = await page.$$eval('.application-wrapper:not([style*="display: none"])', els => els.length);

      // Should show 1 application (only Google matches)
      expect(visibleCards).toBe(1);

      // Clear search input for next test
      await page.evaluate(() => {
        const input = document.querySelector('#searchInput');
        if (input) input.value = '';
      });
    }
  });

  // Test: Clear all filters and show all applications
  test('should clear all filters and show all applications', async () => {
    // First apply some filters
    const statusFilter = await page.$('#statusFilter');
    if (statusFilter) {
      await page.select('#statusFilter', 'Interviewing');
      await new Promise(res => setTimeout(res, 300));
    }

    const searchInput = await page.$('#searchInput');
    if (searchInput) {
      await page.type('#searchInput', 'Meta');
      await new Promise(res => setTimeout(res, 300));
    }

    // Now clear all filters
    const clearButton = await page.$('#clearFilters');
    if (clearButton) {
      await page.click('#clearFilters');
      await new Promise(res => setTimeout(res, 500));

      // Count all visible application cards
      const visibleCards = await page.$$eval('.application-wrapper', els => els.length);

      // Should show all 4 applications after clearing filters
      expect(visibleCards).toBe(4);
    }
  });
});