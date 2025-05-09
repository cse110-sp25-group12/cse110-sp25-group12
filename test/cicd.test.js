const { sum, wrongSum } = require('../source/cicd');

//Both tests should pass
test('sum: 1 + 1 = 2', () => {
  expect(sum(1, 1) === 2).toBe(true);
});

test('wrongSum: 1 + 1 = 2', () => {
  expect(wrongSum(1, 1) === 2).toBe(false);
});

//This test should fail
// test('sum: 1 + 1 = 100', () => {
//   expect(sum(1, 1) === 100).toBe(true);
// });
