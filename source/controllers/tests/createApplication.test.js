import { createApplication } from '../createApplication';

// Test suite for createApplication function
describe('createApplication', function () {

  // Before each test, mock localStorage to isolate tests
  beforeEach(function () {
    const localStorageMock = (function () {
      let store = {};
      return {
        getItem: function (key) {
          return store[key] || null;
        },
        setItem: function (key, value) {
          store[key] = value;
        },
        clear: function () {
          store = {};
        }
      };
    })();
    global.localStorage = localStorageMock;
  });

  // Test: should successfully create a new application entry and store it in localStorage
  test('should create a new application and store it in localStorage', function () {
    const formData = {
      company: 'OpenAI',
      position: 'Frontend Developer',
      logo: 'logo.png'
    };

    const newCard = createApplication(formData);

    // Validate properties of created application object
    expect(newCard).toHaveProperty('id');
    expect(newCard.company).toBe('OpenAI');
    expect(newCard.position).toBe('Frontend Developer');
    expect(newCard.logo).toBe('logo.png');

    // Validate that it's correctly saved to localStorage
    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(newCard.id);
  });

  // Test: handle empty formData object without error
  test('should handle empty formData object gracefully', function () {
    const formData = {};
    const newCard = createApplication(formData);

    // Validate it still creates a valid object with id
    expect(newCard).toHaveProperty('id');
    expect(newCard.logo).toBe(undefined);

    // Ensure it is saved to localStorage
    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored.length).toBe(1);
  });

  // Test: should throw error if formData is null
  test('should throw if formData is null', function () {
    expect(function () {
      createApplication(null);
    }).toThrow();
  });

  // Test: should throw error if formData is undefined
  test('should throw if formData is undefined', function () {
    expect(function () {
      createApplication(undefined);
    }).toThrow();
  });

  // Test: append new application to existing localStorage data
  test('should append to existing applications in localStorage', function () {
    const existing = [{ id: '123', company: 'Test' }];
    localStorage.setItem('applications', JSON.stringify(existing));

    const formData = {
      company: 'OpenAI',
      position: 'Dev',
      logo: 'logo.png'
    };

    const newCard = createApplication(formData);

    // Validate two records now exist in storage
    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored.length).toBe(2);
    expect(stored[1].id).toBe(newCard.id);
  });

  // Test: ensure each card receives a unique ID
  test('should assign a unique id to each new card', function () {
    const card1 = createApplication({ company: 'A', logo: 'a.png' });
    const card2 = createApplication({ company: 'B', logo: 'b.png' });

    expect(card1.id).not.toBe(card2.id);
  });

});