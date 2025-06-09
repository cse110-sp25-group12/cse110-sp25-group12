import puppeteer from 'puppeteer';

const isCI = process.env.GITHUB_ACTIONS === 'true';

// Sample test data inserted into localStorage before page load
const testData = [
  {
    id: '1',
    company: 'Google',
    jobPosition: 'Software Engineer',
    positionType: 'Full-Time',
    salary: 120000,
    location: 'Mountain View, CA',
    dateApplied: '2025-06-01',
    status: 'Interviewing',
    contact: {
      email: 'recruiter@google.com',
      phoneNumber: '123-456-7890'
    },
    notes: 'Excited for the interview'
  }
];

// Puppeteer-based end-to-end tests for the Applications Page
describe('Applications Page E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup: Launch browser and preload data before tests run
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: isCI,
      slowMo: isCI ? 0 : 50,
      args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
    });
    page = await browser.newPage();

    // Inject test data directly into localStorage before page navigation
    await page.evaluateOnNewDocument((data) => {
      localStorage.setItem('applications', JSON.stringify(data));
    }, testData);

    await page.goto('http://127.0.0.1:5500/source/pages/applications.html', { waitUntil: 'domcontentloaded' });

    // Wait briefly to ensure DOM fully renders
    await new Promise(res => setTimeout(res, 1000));
  }, 30000);

  // Close browser after tests finish
  afterAll(async () => {
    await browser.close();
  });

  // Test: Verify page title renders correctly
  test('should render page title correctly', async () => {
    const title = await page.$eval('.main-header h1', el => el.textContent);
    expect(title).toContain('All Applications');
  });

  // Test: Check that at least one application card is loaded
  test('should load application cards', async () => {
    const cards = await page.$$eval('.application-wrapper', els => els.length);
    expect(cards).toBeGreaterThan(0);
  });

  // Test: Verify that sidebar component is rendered
  test('should have Add Application button in sidebar', async () => {
    const sidebar = await page.$('app-sidebar');
    expect(sidebar).not.toBeNull();
  });

  // Test: Verify delete button exists inside shadow DOM of job card
  test('should display delete button on job card', async () => {
    const deleteBtns = await page.evaluate(() => {
      const cards = document.querySelectorAll('job-app-card');
      let total = 0;
      cards.forEach(card => {
        const shadowRoot = card.shadowRoot;
        if (shadowRoot && shadowRoot.querySelector('.delete-btn')) {
          total += 1;
        }
      });
      return total;
    });
    expect(deleteBtns).toBeGreaterThan(0);
  });

  // Test: Validate that job card deletion works correctly
  test('should delete a job card', async () => {
    const initialCount = await page.$$eval('.application-wrapper', els => els.length);

    // Listen for confirm dialog and accept it automatically
    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    // Enter shadow DOM to locate and click delete button
    await page.evaluate(() => {
      const card = document.querySelector('job-app-card');
      const shadow = card.shadowRoot;
      const deleteBtn = shadow.querySelector('.delete-btn');
      deleteBtn.click();
    });

    await new Promise(res => setTimeout(res, 1000)); // wait for deletion logic

    const newCount = await page.$$eval('.application-wrapper', els => els.length);
    expect(newCount).toBe(initialCount - 1);
  }, 10000);

  // Skipped test: Placeholder for edit button test
  test.skip('should have edit button on job card', async () => {
    const editBtns = await page.$$eval('.update-btn', els => els.length);
    expect(editBtns).toBeGreaterThan(0);
  });

  // Test: Verify that header count matches the number of applications in localStorage
  test('header count matches localStorage count', async () => {
    const jobs = await page.evaluate(() => JSON.parse(localStorage.getItem('applications')).length);
    const headerText = await page.$eval('.main-header h1', el => el.textContent);
    expect(headerText).toContain(`${jobs}`);
  });
});
