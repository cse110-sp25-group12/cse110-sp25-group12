const puppeteer = require('puppeteer');

describe('Dashboard E2E Test (Puppeteer)', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
    });

    page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/source/pages/dashboard.html', { waitUntil: 'networkidle0' });

    await new Promise(res => setTimeout(res, 1000));
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  test('should render all dashboard cards', async () => {
    const cardCount = await page.$$eval('.content-card', cards => cards.length);
    expect(cardCount).toBe(7);
  });

  test('should have Reset Dashboard button', async () => {
    const resetButton = await page.$('#resetDataBtn');
    expect(resetButton).not.toBeNull();
  });

  test('should have both charts present', async () => {
    const appsChart = await page.$('#applicationsChart');
    const statusChart = await page.$('#statusChart');
    expect(appsChart).not.toBeNull();
    expect(statusChart).not.toBeNull();
  });

  test('should have correct page title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toBe('JobTrack - Dashboard');
  });

  test('Total Applications shows correct count', async () => {
    const text = await page.$eval(".content-card:nth-of-type(1) .content-card-stat", el => el.textContent.trim());
    expect(text).toBe('...');
});

  test('Reset button clears data', async () => {
    await page.click('#resetDataBtn');
    // add checks to verify localStorage or UI state cleared
  });
});
