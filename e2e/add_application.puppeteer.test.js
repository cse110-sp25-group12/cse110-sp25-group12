const puppeteer = require('puppeteer');

describe('Add Application Page E2E Test (Puppeteer)', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50 
    });
    page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/source/pages/add_application.html', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));  // <-- safe compatible delay
  }, 30000); 

  afterAll(async () => {
    await browser.close();
  });

  test('should render page title correctly', async () => {
    const title = await page.title();
    expect(title).toBe('JobTrack - Add Application');
  });

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

  test('should successfully fill and submit the form', async () => {
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
    await page.click('#submitBtn');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }, 25000);
});
