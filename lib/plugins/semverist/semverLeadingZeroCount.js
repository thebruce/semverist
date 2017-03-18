'use strict';

const _ = require('lodash');

/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Returns the count of leading zeroes in major, minor and patch
   * values from a parsed semver string.
   *
   * @param {string} semverishValue
   *   A semverish path of a least a major value.
   * @returns {integer}
   *   A count of leading zeroes in this semverish path.
   */
  semverLeadingZeroCount() { // eslint-disable-line class-methods-use-this
    if (!this.getSemverParsed()) {
      throw new Error('There must be a parsed semver to analyze.');
    }
    let count = 0;
    if (this.getSemverParsed().major === '0') {
      count += 1;
      if (this.getSemverParsed().minor === '0') {
        count += 1;
        if (this.getSemverParsed().patch === '0') {
          count += 1;
        }
      }
    }
    let subCount = 0;
    // here difference between semver and parsed
    this.getSemverishArray().slice(0, 3).forEach((item) => {
      if (_.isFinite(_.parseInt(item))) {
        subCount += 1;
      }
    });
    if (count > 0) {
      count -= (3 - subCount);
    }
    // array 0,1,2 <- if they are all numbers
    return count;
  }
};
