'use strict';

const semver = require('semver');

/**
 * This is a semverist plugin for analyzing the adjacency of two semver.
 * It is self-contained.
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Converts a leading zero semver path to a semver range implementing.
   *   lazy semverist.
   *
   * @param {string} semverishValue - A semverish value.
   *
   * @param {any} leadingZeroCount - A count of leading zeroes in the semver.
   *   Leading zeroes can affect the behavior of certain range operators.
   *
   * @returns {string}
   *   A valid semver range implementing lazy semverist.
   */
  convertLeadingZeroSemverToLazySemveristRange(semverishValue) {
    let tmpSemver = semverishValue;

    const tmpArray = this.splitStringNoEmpties(semverishValue);
    if (tmpArray.length < 3) {
      tmpSemver = this.valueToSemver(semverishValue);
    }

    return semver.validRange(`>=${tmpSemver} < 1.0.0`);
  }
};
