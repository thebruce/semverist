'use strict';

const semver = require('semver');

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
   * Transforms a semverish path to a caret range.
   *
   * @param {string} pather
   *   A semverish path of at least a major value.
   * @returns {string}
   *   A valid semver range.
   */
  toCaretRange(pather) { // eslint-disable-line class-methods-use-this
    const tmpRange = semver.validRange(`^${pather}`);
    return tmpRange;
  }
};
