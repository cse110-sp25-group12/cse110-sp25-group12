const puppeteer = require('puppeteer');

// Test suite for end-to-end testing of the Dashboard page
describe('Dashboard E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup browser and navigate before running tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,  // Run with browser UI for visibility
      slowMo: 50,       // Slow down interactions for more stable test runs
    });

    page = await browser.newPage();

    // Navigate to local dashboard page and wait for network to settle
    await page.goto('http://127.0.0.1:5500/source/pages/dashboard.html', { waitUntil: 'networkidle0' });

    // Short delay to allow page animations or dynamic content to fully render
    await new Promise(res => setTimeout(res, 1000));
  }, 30000); // Timeout for full setup

  // Close browser after tests complete
  afterAll(async () => {
    await browser.close();
  });

  // Test: Verify all dashboard summary cards are rendered
  test('should render all dashboard cards', async () => {
    const cardCount = await page.$$eval('.content-card', cards => cards.length);
    expect(cardCount).toBe(7);  // Expect 7 cards (based on dashboard layout)
  });

  // Test: Check that Reset Dashboard button is present
  test('should have Reset Dashboard button', async () => {
    const resetButton = await page.$('#resetDataBtn');
    expect(resetButton).not.toBeNull();
  });

  // Test: Check both charts are rendered (Applications and Status charts)
  test('should have both charts present', async () => {
    const appsChart = await page.$('#applicationsChart');
    const statusChart = await page.$('#statusChart');
    expect(appsChart).not.toBeNull();
    expect(statusChart).not.toBeNull();
  });

  // Test: Confirm correct page title is shown
  test('should have correct page title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toBe('JobTrack - Dashboard');
  });

  // Test: Check that total applications count is displayed (data-dependent test)
  test('Total Applications shows correct count', async () => {
    const text = await page.$eval(".content-card:nth-of-type(1) .content-card-stat", el => el.textContent.trim());
    expect(text).toBe('...');
  });

  // Test: Verify Reset button click functionality (actual reset verification can be expanded)
  test('Reset button clears data', async () => {
    await page.click('#resetDataBtn');
    // NOTE: Add verification steps here to check localStorage or DOM changes after reset
  });
});
