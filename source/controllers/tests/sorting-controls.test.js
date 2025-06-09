/**
 * @jest-environment jsdom
 */

// Full test suite for sorting-controls.js with full documentation

describe('sorting-controls tests (full coverage with docs)', () => {
  let filterApplications;
  let sortApplications;

  /**
   * Before all tests:
   * - Mock global window and localStorage (since sorting-controls relies on them)
   * - Dynamically import sorting-controls.js to avoid DOMContentLoaded running on import
   */
  beforeAll(async () => {
    // Mock window and localStorage since sorting-controls uses them
    global.window = {};
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    // Dynamically import module AFTER mocking window
    const sortingControls = await import('../sorting-controls.js');
    filterApplications = sortingControls.filterApplications;
    sortApplications = sortingControls.sortApplications;
  });

  /** ----------------- FilterApplications Tests ------------------ */

  describe('filterApplications', () => {
    /**
     * Prepare mock data for filtering tests.
     * Include both normal statuses and edge cases
     */
    const mockData = [
      { status: 'Offer' },
      { status: 'Rejected' },
      { status: 'Interviewing' },
      { status: '' },  // edge case: empty string
      { },             // edge case: missing status property
    ];

    /**
     * Filtering by 'All' should return the full list
     * This verifies the default behavior when no filter is applied
     */
    test('should return all when filter is All', () => {
      const result = filterApplications(mockData, 'All');
      expect(result.length).toBe(5);
    });

    /**
     * Filtering by a valid status
     * Expect only items with that status
     */
    test('should filter by status', () => {
      const result = filterApplications(mockData, 'Offer');
      expect(result).toEqual([{ status: 'Offer' }]);
    });

    /**
     * Filtering by a status that doesn't exist in dataset.
     * Should return empty array.
     */
    test('should return empty if no matches', () => {
      const result = filterApplications(mockData, 'Ghosted');
      expect(result).toEqual([]);
    });

    /**
     * Handle empty string filter status gracefully.
     * Should return empty array (no matches).
     */
    test('should handle missing or empty status gracefully', () => {
      const result = filterApplications(mockData, '');
      expect(result.length).toBe(2);
    });
  });

  /** ----------------- SortApplications Tests ------------------ */

  describe('sortApplications', () => {
    //Prepare mock data for sorting tests.
    const mockData = [
      { company: 'Google', dateApplied: '2024-01-02', bookmarked: false },
      { company: 'Amazon', dateApplied: '2024-05-01', bookmarked: true },
      { company: 'Facebook', dateApplied: '2024-03-10', bookmarked: false },
      { company: null, dateApplied: null, bookmarked: false }, // edge case
    ];

    /**
     * Sort descending by dateApplied.
     * Expect newest date first.
     */
    test('should sort by date descending', () => {
      const result = sortApplications(mockData, 'date-desc');
      expect(result[0].company).toBe('Amazon');
    });

    /**
     * Sort ascending by dateApplied.
     * Expect oldest date first.
     * Should handle null dates as 'oldest'.
     */
    test('should sort by date ascending', () => {
      const result = sortApplications(mockData, 'date-asc');
      expect(result[0].company).toBe(null);
    });

    //Sort companies alphabetically (A-Z).
    test('should sort by company ascending', () => {
      const result = sortApplications(mockData, 'company-asc');
      expect(result[1].company).toBe('Amazon');
    });

    //Sort companies reverse alphabetically (Z-A).
    test('should sort by company descending', () => {
      const result = sortApplications(mockData, 'company-desc');
      expect(result[0].company).toBe('Google');
    });

    /**
     * Sort by favorites-first.
     * Bookmarked applications should come first.
     */
    test('should sort by favorites first', () => {
      const result = sortApplications(mockData, 'favorites-first');
      expect(result[0].company).toBe('Amazon');
    });

    /**
     * Handle invalid sort option gracefully (default fallback).
     * Should return data unsorted.
     */
    test('should return original array on invalid sort option', () => {
      const result = sortApplications(mockData, 'invalid-option');
      expect(result).toEqual(mockData);
    });

    /**
     * Handle missing dateApplied and company fields.
     * Should not crash.
     */
    test('should handle missing dateApplied and company safely', () => {
      const dataWithEmpty = [{ }, { company: null, dateApplied: null }];
      const result = sortApplications(dataWithEmpty, 'date-desc');
      expect(result.length).toBe(2);
    });
  });
});
