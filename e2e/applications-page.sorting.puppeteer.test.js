import puppeteer from 'puppeteer';

const isCI = process.env.GITHUB_ACTIONS === 'true';

// Test data for sorting functionality
const testData = [
  {
    id: '1',
    company: 'Zebra Corp',
    jobPosition: 'Software Engineer',
    dateApplied: '2025-01-01',
    status: 'Applied',
    positionType: 'Full-Time',
    salary: 90000,
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    company: 'Apple Inc',
    jobPosition: 'Product Designer',
    dateApplied: '2025-06-01',
    status: 'Interviewing',
    positionType: 'Full-Time',
    salary: 130000,
    location: 'Cupertino, CA'
  },
  {
    id: '3',
    company: 'Meta',
    jobPosition: 'Product Manager',
    dateApplied: '2025-03-15',
    status: 'Rejected',
    positionType: 'Full-Time',
    salary: 150000,
    location: 'Menlo Park, CA'
  }
];

// Puppeteer-based tests for Applications Page Sorting functionality
describe('Applications Page Sorting E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup: Launch browser and preload sorting test data
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
    }, testData);

    await page.goto('http://127.0.0.1:5500/source/pages/applications.html', { waitUntil: 'domcontentloaded' });

    // Wait for page to fully render
    await new Promise(res => setTimeout(res, 1000));
  }, 30000);

  // Close browser after tests finish
  afterAll(async () => {
    await browser.close();
  });

  // Test: Sort applications by company name alphabetically
  test('should sort applications by company name', async () => {
    const sortSelect = await page.$('#sortBy');
    if (sortSelect) {
      await page.select('#sortBy', 'company');
      await new Promise(res => setTimeout(res, 500));

      const companies = await page.evaluate(() => {
        const cards = document.querySelectorAll('job-app-card');
        return Array.from(cards).map(card => card.shadowRoot.querySelector('.company-name').textContent);
      });

      // Should be sorted alphabetically: Apple Inc, Meta, Zebra Corp
      expect(companies).toEqual(['Apple Inc', 'Meta', 'Zebra Corp']);
    }
  });

  // Test: Sort applications by date applied (chronological order)
  test('should sort applications by date applied', async () => {
    const sortSelect = await page.$('#sortBy');
    if (sortSelect) {
      await page.select('#sortBy', 'dateApplied');
      await new Promise(res => setTimeout(res, 500));

      const dates = await page.evaluate(() => {
        const cards = document.querySelectorAll('job-app-card');
        return Array.from(cards).map(card => card.shadowRoot.querySelector('.date-applied').textContent);
      });

      // Verify dates are in chronological order (earliest first)
      expect(new Date(dates[0])).toBeLessThanOrEqual(new Date(dates[1]));
      expect(new Date(dates[1])).toBeLessThanOrEqual(new Date(dates[2]));
    }
  });

  // Test: Toggle sort direction (ascending/descending)
  test('should toggle sort direction', async () => {
    const sortDirection = await page.$('#sortDirection');
    if (sortDirection) {
      // First, sort by company name
      const sortSelect = await page.$('#sortBy');
      if (sortSelect) {
        await page.select('#sortBy', 'company');
        await new Promise(res => setTimeout(res, 500));
      }

      // Then toggle sort direction
      await page.click('#sortDirection');
      await new Promise(res => setTimeout(res, 500));

      const companies = await page.evaluate(() => {
        const cards = document.querySelectorAll('job-app-card');
        return Array.from(cards).map(card => card.shadowRoot.querySelector('.company-name').textContent);
      });

      // Should be reverse alphabetical order: Zebra Corp, Meta, Apple Inc
      expect(companies).toEqual(['Zebra Corp', 'Meta', 'Apple Inc']);
    }
  });
});