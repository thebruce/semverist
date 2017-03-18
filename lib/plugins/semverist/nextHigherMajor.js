'use strict';

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
   * Returns the next highest major version at 0 minor and 0 patch. This
   *   can be useful when constructing lazySemverist ranges.
   *
   * @param {string} pather
   *   A semverist string.
   * @returns {string}
   *  A semver path at the next highest major level, at 0 minor
   *   and 0 patch versions.
   */
  getNextHigherMajor() {
    return `${Number(this.getSemverParsed().major) + 1}.0.0`;
  }
};
