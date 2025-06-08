const puppeteer = require('puppeteer');

// Main test suite for Add Application Page E2E using Puppeteer
describe('Add Application Page E2E Test (Puppeteer)', () => {
  let browser, page;

  // Launch Puppeteer before running tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Run browser in visible mode (for debugging)
      slowMo: 50       // Slow down each operation slightly for stability
    });

    page = await browser.newPage();

    // Navigate to local Add Application page
    await page.goto('http://127.0.0.1:5500/source/pages/add_application.html', { waitUntil: 'networkidle0' });

    // Add small delay to ensure page is fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, 30000); // Allow up to 30 seconds for setup

  // Close browser after tests finish
  afterAll(async () => {
    await browser.close();
  });

  // Test: Verify page title is rendered correctly
  test('should render page title correctly', async () => {
    const title = await page.title();
    expect(title).toBe('JobTrack - Add Application');
  });

  // Test: Verify form and essential input fields exist on page
  test('should have form and required fields present', async () => {
    const formExists = await page.$('#addApplicationForm') !== null;
    const companyFieldExists = await page.$('#company') !== null;
    const jobPositionFieldExists = await page.$('#jobPosition') !== null;
    const dateAppliedFieldExists = await page.$('#dateApplied') !== null;

    expect(formExists).toBe(true);
    expect(companyFieldExists).toBe(true);
    expect(jobPositionFieldExists).toBe(true);
    expect(dateAppliedFieldExists).toBe(true);
  });

  // Test: Simulate filling out the form and submitting it
  test('should successfully fill and submit the form', async () => {
    // Fill input fields
    await page.type('#company', 'Google');
    await page.type('#jobPosition', 'Software Engineer');
    await page.select('#positionType', 'Full-Time');
    await page.type('#salary', '120000');
    await page.type('#location', 'San Francisco');
    await page.select('#status', 'Applied');
    await page.type('#contactName', 'Seyed Amirreza Shams');
    await page.type('#contactEmail', 'SeyedShams@gitcommitmentissues.com');
    await page.type('#contactPhone', '1234567890');
    await page.type('#notes', 'Excited to apply!');
    await page.type('#dateApplied', '05-06-2024');

    // Click submit button
    await page.click('#submitBtn');

    // Allow time for form submission and any redirects/updates
    await new Promise(resolve => setTimeout(resolve, 3000));
  }, 25000); // Allow up to 25 seconds for form submission test
});
