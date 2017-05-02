'use strict';

const fs = require('fs-extra');

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
  getFileContents(pather) {
    if (super.getFileContents) {
      return super.getFileContents(pather);
    }
    return fs.readJsonSync(pather, {throws: false});
  }
};
