import { createApplication } from '../createApplication';

describe('createApplication', function () {
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

  test('should create a new application and store it in localStorage', function () {
    const formData = {
      company: 'OpenAI',
      position: 'Frontend Developer',
      logo: 'logo.png'
    };

    const newCard = createApplication(formData);

    expect(newCard).toHaveProperty('id');
    expect(newCard.company).toBe('OpenAI');
    expect(newCard.position).toBe('Frontend Developer');
    expect(newCard.logo).toBe('logo.png');

    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(newCard.id);
  });

  test('should handle empty formData object gracefully', function () {
    const formData = {};
    const newCard = createApplication(formData);

    expect(newCard).toHaveProperty('id');
    expect(newCard.logo).toBe(undefined);

    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored.length).toBe(1);
  });

  test('should throw if formData is null', function () {
    expect(function () {
      createApplication(null);
    }).toThrow();
  });

  test('should throw if formData is undefined', function () {
    expect(function () {
      createApplication(undefined);
    }).toThrow();
  });

  test('should append to existing applications in localStorage', function () {
    const existing = [{ id: '123', company: 'Test' }];
    localStorage.setItem('applications', JSON.stringify(existing));

    const formData = {
      company: 'OpenAI',
      position: 'Dev',
      logo: 'logo.png'
    };

    const newCard = createApplication(formData);

    const stored = JSON.parse(localStorage.getItem('applications'));
    expect(stored.length).toBe(2);
    expect(stored[1].id).toBe(newCard.id);
  });

  test('should assign a unique id to each new card', function () {
    const card1 = createApplication({ company: 'A', logo: 'a.png' });
    const card2 = createApplication({ company: 'B', logo: 'b.png' });

    expect(card1.id).not.toBe(card2.id);
  });

  //not included the test for invalid input types (e.g., non-object or null formData)
  //it could be added if need↓
  //test('should throw if formData is not an object', () => {
  //expect(() => createApplication('string')).toThrow();
  //expect(() => createApplication(123)).toThrow();
  //expect(() => createApplication([])).toThrow();
  //});


});
