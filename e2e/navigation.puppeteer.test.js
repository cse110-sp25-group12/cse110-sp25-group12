import puppeteer from 'puppeteer';

const isCI = process.env.GITHUB_ACTIONS === 'true';

// Puppeteer-based tests for Cross-Page Navigation functionality
describe('Cross-Page Navigation E2E Test (Puppeteer)', () => {
  let browser, page;

  // Setup: Launch browser before navigation tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: isCI,
      slowMo: isCI ? 0 : 50,
      args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
    });
    page = await browser.newPage();
  }, 30000);

  // Close browser after tests finish
  afterAll(async () => {
    await browser.close();
  });

  // Test: Navigate from dashboard to applications page
  test('should navigate from dashboard to applications page', async () => {
    // Start on dashboard page
    await page.goto('http://127.0.0.1:5500/source/pages/dashboard.html', { waitUntil: 'networkidle0' });
    
    // Look for link or button that navigates to applications page
    const applicationsLink = await page.$('a[href*="applications"]');
    if (applicationsLink) {
      await applicationsLink.click();
      await page.waitForNavigation();

      // Verify we're now on applications page
      const currentUrl = page.url();
      expect(currentUrl).toContain('applications.html');
    }
  });

  // Test: Navigate to add application page from applications page
  test('should navigate to add application page', async () => {
    // Start on applications page
    await page.goto('http://127.0.0.1:5500/source/pages/applications.html', { waitUntil: 'domcontentloaded' });
    
    // Look for "Add Application" button or link
    const addButton = await page.$('#addApplicationBtn');
    if (addButton) {
      await addButton.click();
      await page.waitForNavigation();

      // Verify we're now on add application page
      const currentUrl = page.url();
      expect(currentUrl).toContain('add_application.html');
    }
  });

  // Test: Verify sidebar navigation is consistent across pages
  test('should have consistent sidebar navigation', async () => {
    // Test sidebar on dashboard page
    await page.goto('http://127.0.0.1:5500/source/pages/dashboard.html', { waitUntil: 'networkidle0' });
    
    // Check if sidebar component exists
    const sidebar = await page.$('app-sidebar');
    expect(sidebar).not.toBeNull();

    // Check if sidebar has navigation links within shadow DOM
    const navLinks = await page.evaluate(() => {
      const sidebar = document.querySelector('app-sidebar');
      if (sidebar && sidebar.shadowRoot) {
        return sidebar.shadowRoot.querySelectorAll('a').length;
      }
      return 0;
    });

    // Should have navigation links in sidebar
    expect(navLinks).toBeGreaterThan(0);

    // Test sidebar consistency on applications page
    await page.goto('http://127.0.0.1:5500/source/pages/applications.html', { waitUntil: 'domcontentloaded' });
    
    const sidebarOnAppsPage = await page.$('app-sidebar');
    expect(sidebarOnAppsPage).not.toBeNull();

    // Verify sidebar has same structure on different pages
    const navLinksOnAppsPage = await page.evaluate(() => {
      const sidebar = document.querySelector('app-sidebar');
      if (sidebar && sidebar.shadowRoot) {
        return sidebar.shadowRoot.querySelectorAll('a').length;
      }
      return 0;
    });

    // Should have consistent navigation structure
    expect(navLinksOnAppsPage).toBe(navLinks);
  });
});