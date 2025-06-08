import puppeteer from 'puppeteer';

// Puppeteer-based end-to-end tests for the Dashboard Page
describe('Dashboard E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup: Launch browser and navigate to Dashboard before tests run
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,  // Show browser window for visibility (useful during debugging)
      slowMo: 50,       // Slight delay for stability between actions
    });

    page = await browser.newPage();

    // Navigate to the Dashboard page
    await page.goto('http://127.0.0.1:5500/source/pages/dashboard.html', { waitUntil: 'networkidle0' });

    // Short delay to ensure all dynamic content finishes rendering
    await new Promise(res => setTimeout(res, 1000));
  }, 30000);

  // Teardown: Close browser after tests complete
  afterAll(async () => {
    await browser.close();
  });

  // Test: Verify that all dashboard cards are rendered
  test('should render all dashboard cards', async () => {
    const cardCount = await page.$$eval('.content-card', cards => cards.length);
    expect(cardCount).toBe(7);
  });

  // Test: Check if Reset Dashboard button exists
  test('should have Reset Dashboard button', async () => {
    const resetButton = await page.$('#resetDataBtn');
    expect(resetButton).not.toBeNull();
  });

  // Test: Verify both charts are present on the page
  test('should have both charts present', async () => {
    const appsChart = await page.$('#applicationsChart');
    const statusChart = await page.$('#statusChart');
    expect(appsChart).not.toBeNull();
    expect(statusChart).not.toBeNull();
  });

  // Test: Validate correct page title for Dashboard page
  test('should have correct page title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toBe('JobTrack - Dashboard');
  });

  // Test: Check total applications count is rendered (requires data injection)
  test('Total Applications shows correct count', async () => {
    const text = await page.$eval('.content-card:nth-of-type(1) .content-card-stat', el => el.textContent.trim());
    expect(text).toBe('...');
  });

  // Test: Verify Reset button functionality (no assertion yet on data clearing)
  test('Reset button clears data', async () => {
    await page.click('#resetDataBtn');
  });
});
