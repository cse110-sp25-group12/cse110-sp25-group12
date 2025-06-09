/**
 * Generates a UUID, using crypto module in Node.js or browser crypto API
 * @returns {string} A UUID string.
 * @description Generates a UUID, using crypto module in Node.js or browser crypto API
 * I have to use this function because the crypto module is not available in the browser, now it should pass the tests
 */
function generateUUID() {
  // In Node.js environment (like Jest), use the imported randomUUID
  if (typeof randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // In browser environment, use the global crypto API
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Creates a new job application card and stores it in localStorage.
 * @param {Object} formData - The input data from the form.
 * @returns {Object} The newly created card object.
 */
export function createApplication(formData) {
  const newCard = {
    id: generateUUID(),
    ...formData,
    logo: formData.logo
  };

  const cards = JSON.parse(localStorage.getItem('applications')) || [];
  cards.push(newCard);
  localStorage.setItem('applications', JSON.stringify(cards));

  return newCard;
}

describe('createApplication - Enhanced Coverage Tests', () => {
  // Mock localStorage for this test suite
  let mockLocalStorage;

  beforeAll(() => {
    // Setup localStorage mock
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn()
    };

    // Make localStorage available globally
    global.localStorage = mockLocalStorage;
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset localStorage mock to return empty array by default
    mockLocalStorage.getItem.mockReturnValue('[]');
  });

  afterAll(() => {
    // Clean up global localStorage mock
    delete global.localStorage;
  });

  // Test 1: Basic functionality with complete data
  test('should create application with all fields and generate UUID', () => {
    const formData = {
      company: 'Google',
      jobPosition: 'Software Engineer',
      dateApplied: '2025-06-01',
      status: 'Applied',
      positionType: 'Full-Time',
      salary: '120000',
      location: 'Mountain View, CA',
      contact: {
        name: 'John Doe',
        email: 'john@google.com',
        phoneNumber: '1234567890'
      },
      notes: 'Great opportunity',
      bookmarked: false,
      logo: 'google-logo.png'
    };

    const result = createApplication(formData);

    // Verify the returned object
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.company).toBe('Google');
    expect(result.logo).toBe('google-logo.png');

    // Verify localStorage was called correctly
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('applications');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'applications',
      expect.stringContaining('Google')
    );
  });

  // Test 2: Minimal data (empty optional fields)
  test('should handle minimal form data', () => {
    const minimalData = {
      company: 'Apple',
      jobPosition: 'Developer'
    };

    const result = createApplication(minimalData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.company).toBe('Apple');
    expect(result.jobPosition).toBe('Developer');

    // Verify localStorage interaction
    expect(mockLocalStorage.getItem).toHaveBeenCalled();
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  // Test 3: Empty form data (edge case)
  test('should handle completely empty form data', () => {
    const emptyData = {};

    const result = createApplication(emptyData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');

    // Verify localStorage was called
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('applications');
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  // Test 4: Special characters in form data
  test('should handle special characters in form data', () => {
    const specialData = {
      company: 'Test & Company <script>alert("xss")</script>',
      jobPosition: 'Developer & Designer',
      notes: 'Special chars: !@#$%^&*()',
      contact: {
        name: 'John O\'Brien',
        email: 'test+tag@company.com'
      }
    };

    const result = createApplication(specialData);

    expect(result).toBeDefined();
    expect(result.company).toBe('Test & Company <script>alert("xss")</script>');
    expect(result.contact.name).toBe('John O\'Brien');

    // Verify data was passed through correctly (no sanitization expected)
    expect(result.notes).toBe('Special chars: !@#$%^&*()');
  });

  // Test 5: Multiple applications (appending to existing)
  test('should append to existing applications in localStorage', () => {
    // Mock existing applications in localStorage
    const existingApps = [
      { id: 'existing-1', company: 'Existing Company', jobPosition: 'Existing Job' }
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingApps));

    const newAppData = { company: 'New Company', jobPosition: 'New Job' };
    const result = createApplication(newAppData);

    expect(result).toBeDefined();
    expect(result.company).toBe('New Company');

    // Verify it called getItem to get existing data
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('applications');

    // Verify it saved the combined data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'applications',
      expect.stringContaining('New Company')
    );
  });

  // Test 6: UUID uniqueness
  test('should generate unique UUIDs for different applications', () => {
    const app1 = { company: 'Test 1' };
    const app2 = { company: 'Test 2' };
    const app3 = { company: 'Test 3' };

    const result1 = createApplication(app1);
    const result2 = createApplication(app2);
    const result3 = createApplication(app3);

    // All IDs should be different
    expect(result1.id).not.toBe(result2.id);
    expect(result2.id).not.toBe(result3.id);
    expect(result1.id).not.toBe(result3.id);

    // All IDs should be valid UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(result1.id).toMatch(uuidRegex);
    expect(result2.id).toMatch(uuidRegex);
    expect(result3.id).toMatch(uuidRegex);
  });

  // Test 7: Null and undefined values
  test('should handle null and undefined values', () => {
    const dataWithNulls = {
      company: 'Test Company',
      jobPosition: null,
      dateApplied: undefined,
      status: '',
      notes: null,
      contact: null
    };

    const result = createApplication(dataWithNulls);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.company).toBe('Test Company');
    expect(result.jobPosition).toBeNull();
    expect(result.dateApplied).toBeUndefined();
    expect(result.contact).toBeNull();
  });

  // Test 8: Logo field specifically
  test('should handle logo field correctly', () => {
    const dataWithLogo = {
      company: 'LogoTest Inc',
      logo: 'test-logo.png'
    };

    const dataWithoutLogo = {
      company: 'NoLogo Inc'
    };

    const result1 = createApplication(dataWithLogo);
    const result2 = createApplication(dataWithoutLogo);

    expect(result1.logo).toBe('test-logo.png');
    expect(result2.logo).toBeUndefined();

    // Verify both were saved
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
  });

  // Test 9: localStorage getItem returns null (empty localStorage)
  test('should handle empty localStorage (getItem returns null)', () => {
    // Mock empty localStorage
    mockLocalStorage.getItem.mockReturnValue(null);

    const testData = { company: 'Empty Storage Test' };
    const result = createApplication(testData);

    expect(result).toBeDefined();
    expect(result.company).toBe('Empty Storage Test');

    // Should still save the data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'applications',
      expect.stringContaining('Empty Storage Test')
    );
  });

  // Test 10: localStorage error handling
  test('should handle localStorage errors', () => {
    // Create a fresh mock for this test only
    const errorMock = {
      getItem: jest.fn().mockReturnValue('[]'),
      setItem: jest.fn().mockImplementation(() => {
        throw new Error('localStorage is full');
      })
    };

    // Temporarily replace the global mock
    const originalMock = global.localStorage;
    global.localStorage = errorMock;

    const testData = { company: 'Error Test' };

    // Should throw because the function doesn't handle localStorage errors
    expect(() => {
      createApplication(testData);
    }).toThrow('localStorage is full');

    // Restore the original mock
    global.localStorage = originalMock;
  });

  // Test 11: Corrupted localStorage data
  test('should handle corrupted existing data in localStorage', () => {
    // Create a fresh mock for this test only
    const corruptedMock = {
      getItem: jest.fn().mockReturnValue('invalid-json-data'),
      setItem: jest.fn()
    };

    // Temporarily replace the global mock
    const originalMock = global.localStorage;
    global.localStorage = corruptedMock;

    const newData = { company: 'Test After Corruption' };

    // Should throw because JSON.parse will fail
    expect(() => {
      createApplication(newData);
    }).toThrow();

    // Restore the original mock
    global.localStorage = originalMock;
  });

  // Test 12: Complex nested form data
  test('should handle complex nested form data', () => {
    const complexData = {
      company: 'Complex Corp',
      contact: {
        name: 'Jane Doe',
        email: 'jane@complex.com',
        phoneNumber: '555-0123',
        socialMedia: {
          linkedin: 'jane-doe',
          twitter: '@janedoe'
        }
      },
      skills: ['JavaScript', 'React', 'Node.js'],
      interviewDates: ['2025-06-15', '2025-06-20'],
      metadata: {
        source: 'LinkedIn',
        referral: 'John Smith'
      }
    };

    const result = createApplication(complexData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.contact.socialMedia.linkedin).toBe('jane-doe');
    expect(result.skills).toHaveLength(3);
    expect(result.skills[0]).toBe('JavaScript');
    expect(result.metadata.source).toBe('LinkedIn');
  });

  // Test 13: Data spreading behavior (tests the ...formData spread)
  test('should correctly spread formData into newCard object', () => {
    const formData = {
      company: 'Spread Test',
      customField: 'custom value',
      nestedObject: { key: 'value' },
      arrayField: [1, 2, 3]
    };

    const result = createApplication(formData);

    // All original properties should be preserved
    expect(result.company).toBe('Spread Test');
    expect(result.customField).toBe('custom value');
    expect(result.nestedObject.key).toBe('value');
    expect(result.arrayField).toEqual([1, 2, 3]);

    // Plus the generated ID
    expect(result.id).toBeDefined();
  });

  // Test 14: Large data values
  test('should handle large data values', () => {
    const largeData = {
      company: 'A'.repeat(500),
      notes: 'B'.repeat(1000),
      customArray: new Array(100).fill('item')
    };

    const result = createApplication(largeData);

    expect(result).toBeDefined();
    expect(result.company.length).toBe(500);
    expect(result.notes.length).toBe(1000);
    expect(result.customArray.length).toBe(100);
  });

  // Test 15: UUID generation with mocked crypto
  test('should generate UUID with different crypto scenarios', () => {
    // Test with crypto available
    const mockCrypto = {
      randomUUID: jest.fn().mockReturnValue('mocked-uuid-12345')
    };

    const originalCrypto = global.crypto;
    global.crypto = mockCrypto;

    const result1 = createApplication({ company: 'Crypto Test' });
    expect(result1.id).toBe('mocked-uuid-12345');

    // Test fallback when crypto is undefined
    delete global.crypto;
    const result2 = createApplication({ company: 'Fallback Test' });
    expect(result2.id).toBeDefined();
    expect(typeof result2.id).toBe('string');
    expect(result2.id.length).toBeGreaterThan(10); // Should be a reasonable UUID length

    // Restore original crypto
    global.crypto = originalCrypto;
  });
});