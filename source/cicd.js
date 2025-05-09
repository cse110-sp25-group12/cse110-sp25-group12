/**
 * Function correctly adds 2 numbers
 * @param {Number} a1 - First addend
 * @param {Number} a2 - Second addend
 * @returns correct sum
 */
function sum(a1, a2) {
    return a1 + a2;
}

/**
 * Function wrongly adds 2 numbers
 * @param {Number} a1 - First addend
 * @param {Number} a2 - Second addend
 * @returns wrong sum
 */
function wrongSum(a1, a2) {
  return a1 + a2 + 1;
}

module.exports = {
  sum,
  wrongSum
};
