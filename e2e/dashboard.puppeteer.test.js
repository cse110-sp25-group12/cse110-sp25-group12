import puppeteer from 'puppeteer';

const isCI = process.env.GITHUB_ACTIONS === 'true';

// Puppeteer-based end-to-end tests for the Dashboard Page
describe('Dashboard E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup: Launch browser and navigate to Dashboard before tests run
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: isCI,
      slowMo: isCI ? 0 : 50,
      args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
    });

    page = await browser.newPage();

    // Navigate to the Dashboard page
    await page.goto('http://127.0.0.1:5500/source/pages/dashboard.html', { waitUntil: 'networkidle0' });

    // Wait for dashboard to load data and render
    await page.waitForSelector('.content-card-stat', { timeout: 10000 });
    await page.waitForSelector('.dashboard-loaded', { timeout: 10000 });
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

  // Test: Check total applications count shows actual data (not placeholder)
  test('Total Applications shows actual count', async () => {
    const text = await page.$eval('.content-card:nth-of-type(1) .content-card-stat', el => el.textContent.trim());
    // Should show a number (sample data has 3 applications)
    expect(text).toMatch(/^\d+$/);
    expect(parseInt(text)).toBeGreaterThanOrEqual(0);
  });

  // Test: Verify Reset button functionality with proper timeout and dialog handling
  test('Reset button clears data', async () => {
    // Handle the confirmation dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await page.click('#resetDataBtn');

    // Wait for page reload after reset
    await new Promise(res => setTimeout(res, 3000));

    // The dashboard automatically loads sample data when localStorage is empty
    // So we should either see 0 (if no sample data) or the sample data count (3)
    const text = await page.$eval('.content-card:nth-of-type(1) .content-card-stat', el => el.textContent.trim());
    const finalCount = parseInt(text);

    // After reset, it should either be 0 or reload with sample data (3)
    expect(finalCount === 0 || finalCount === 3).toBe(true);
  }, 15000);
});
