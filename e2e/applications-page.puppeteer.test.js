const puppeteer = require('puppeteer');

// Test data injected into localStorage before loading the page
const testData = [
  {
    id: "1",
    company: "Google",
    jobPosition: "Software Engineer",
    positionType: "Full-Time",
    salary: 120000,
    location: "Mountain View, CA",
    dateApplied: "2025-06-01",
    status: "Interviewing",
    contact: {
      email: "recruiter@google.com",
      phoneNumber: "123-456-7890"
    },
    notes: "Excited for the interview"
  }
];

describe('Applications Page E2E Test (Puppeteer)', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();

    // Inject localStorage BEFORE navigation
    await page.evaluateOnNewDocument((data) => {
      localStorage.setItem('applications', JSON.stringify(data));
    }, testData);

    await page.goto('http://127.0.0.1:5500/source/pages/applications.html', { waitUntil: 'domcontentloaded' });
    await new Promise(res => setTimeout(res, 1000));  // allow DOM/render time
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  test('should render page title correctly', async () => {
    const title = await page.$eval('.main-header h1', el => el.textContent);
    expect(title).toContain('All Applications');
  });

  test('should load application cards', async () => {
    const cards = await page.$$eval('.application-wrapper', els => els.length);
    expect(cards).toBeGreaterThan(0);
  });

  test('should have Add Application button in sidebar', async () => {
    const sidebar = await page.$('app-sidebar');
    expect(sidebar).not.toBeNull();
  });

  test('should display delete button on job card', async () => {
    const deleteBtns = await page.$$eval('.delete-btn', els => els.length);
    expect(deleteBtns).toBeGreaterThan(0);
  });

  test('should delete a job card', async () => {
    const initialCount = await page.$$eval('.application-wrapper', els => els.length);

    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await page.click('.delete-btn');

    await new Promise(res => setTimeout(res, 1000));

    const newCount = await page.$$eval('.application-wrapper', els => els.length);
    expect(newCount).toBe(initialCount - 1);
  }, 10000);

  test.skip('should have edit button on job card', async () => {
    const editBtns = await page.$$eval('.update-btn', els => els.length);
    expect(editBtns).toBeGreaterThan(0);
  });

  test('header count matches localStorage count', async () => {
    const jobs = await page.evaluate(() => JSON.parse(localStorage.getItem('applications')).length);
    const headerText = await page.$eval('.main-header h1', el => el.textContent);
    expect(headerText).toContain(`${jobs}`);
  });
});
