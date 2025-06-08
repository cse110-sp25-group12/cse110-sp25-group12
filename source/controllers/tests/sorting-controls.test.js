/**
 * @jest-environment jsdom
 */

// Main test suite for sorting-controls.js
describe('sorting-controls tests', () => {
  let filterApplications;
  let sortApplications;

  // Before all tests, mock window and localStorage, then import the functions under test
  beforeAll(async () => {
    global.window = {};
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    // Dynamically import the module to avoid initialization conflicts
    const sortingControls = await import('../sorting-controls.js');
    filterApplications = sortingControls.filterApplications;
    sortApplications = sortingControls.sortApplications;
  });

  // Group for filterApplications tests
  describe('filterApplications', () => {
    // Sample data for filtering tests
    const mockData = [
      { status: 'Offer' },
      { status: 'Rejected' },
      { status: 'Interviewing' },
    ];

    // Test: should return all items if filter is 'All'
    test('should return all when filter is All', () => {
      const result = filterApplications(mockData, 'All');
      expect(result.length).toBe(3);
    });

    // Test: should filter items by provided status
    test('should filter by status', () => {
      const result = filterApplications(mockData, 'Offer');
      expect(result).toEqual([{ status: 'Offer' }]);
    });

    // Test: should return empty array when no matches are found
    test('should return empty if no matches', () => {
      const result = filterApplications(mockData, 'Ghosted');
      expect(result).toEqual([]);
    });
  });

  // Group for sortApplications tests
  describe('sortApplications', () => {
    // Sample data for sorting tests
    const mockData = [
      { company: 'Google', dateApplied: '2024-01-02' },
      { company: 'Amazon', dateApplied: '2024-05-01' },
    ];

    // Test: should sort by date descending (newest first)
    test('should sort by date descending', () => {
      const result = sortApplications(mockData, 'date-desc');
      expect(result[0].company).toBe('Amazon');  // Newer date should come first
    });

    // Test: should sort companies alphabetically ascending
    test('should sort by company ascending', () => {
      const result = sortApplications(mockData, 'company-asc');
      expect(result[0].company).toBe('Amazon');
    });
  });
});
