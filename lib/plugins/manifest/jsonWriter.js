'use strict';

const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

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
   * Writes the semverist element to the given file path.
   *
   * @param {string} semverElementPath - A semverist element path.
   */
  writeSemveristElementFile(semverElementPath) {
    const originalSemverPath = _.clone(semverElementPath);
    const preparedSemver = semverElementPath.replace(/\./g, '/');
    const fileName = `${preparedSemver}${this.getElementPathExtension(semverElementPath)}`;
    fs.writeJSONSync(
      path.join(
        this.getCompositionDestination(),
        fileName
      ), _.get(this.getComposition(), originalSemverPath));
  }

  /**
   * Gets the element extension. If none is provided '.json'
   *   will be used.
   * @param {string} pather - A semverist path.
   * @returns {string} - A file extension.
   */
  getElementPathExtension(pather) {
    let tmpExtension = '.json';
    // If this was a directory read and we haven't turned off original
    // extensions - see if we have any overrides.
    const overrides = super.getElementPathExtension(pather);

    if (overrides) tmpExtension = overrides;
    return tmpExtension;
  }
};
