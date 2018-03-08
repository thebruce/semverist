

const toSemver = require('version-comparison/lib/toSemver');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const _ = require('lodash');
const semverUtils = require('semver-utils');
const path = require('path');

/**
 * This is a manifest plugin
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 * @param {Class} superclass
 * A super class or mixed in super class.
 * @returns {Class}
 *   A mixed in class.
 */
module.exports = superclass => class extends superclass {
  /**
   * Write the composition to a directory.
   * @returns {void}
   */
  writeComposition() {
    // if this has been called the object writer has already written out objects
    // to the composition. We need to take each object and write
    // directories and files
    // out based on the naming and contents.
    // Crawl through the object, if it has
    this.directoryWriter('root');
  }

  /**
   * A recursive function used to traverse the composition draft
   *   and write semverist elements into the manifest's composition
   *   with a semver hierarchical object. If a semver directory, rather
   *   than a semverist element is encoutered the function calls itself
   *   with that new semverish Object path in order to explore and
   *   traverse.
   *
   * @param {string} level - A string of a full path within a semverish
   *   Object.
   * @returns {void}
   */
  directoryWriter(level) {
    let semveristAtLevel;
    let levelPrep = '';
    // If the level is root, we are begining at the very top level
    // of a semverish object.
    if (level === 'root') {
      semveristAtLevel = Object.keys(this.getComposition());
    }
    else {
      // Otherwise the level (path at this level) has been passed
      // via a recursive call.
      semveristAtLevel = Object.keys(_.get(this.getComposition(), level));
      levelPrep = `${level}.`;
    }

    // Now we have an object with any keys below our current level.
    semveristAtLevel.forEach((key) => {
      // See if toSemver works against the (notRoot Level).key or
      // (for roots) just key.
      // make test value.
      try {
        let testValue = key;
        if (level !== 'root') {
          testValue = `${levelPrep}${key}`;
        }
        toSemver(testValue);
        // This worked so we know we have a directory. Create directory.
        const parsed = semverUtils.parse(toSemver(testValue));
        if (parsed.release && this.splitStringNoEmpties(parsed.release).length >= 3) {
          this.writeSemveristElementFile(testValue);
        }
        else {
          this.makeSemverDirectory(testValue);
          // And keep on digging:
          this.directoryWriter(testValue);
        }
      }
      catch (error) {
        // Attempt to catch prereleases.
        this.writeSemveristElementFile(`${levelPrep}${key}`);
      }
    },
    this);
  }

  /**
   * Makes a semver hierarchy directory.
   *
   * @param {string} semverLevel - a valid semver string path.
   * @returns {void}
   */
  makeSemverDirectory(semverLevel) {
    const preparedSemver = semverLevel.replace(/\./g, '/');
    const dirPath = path.join(this.getCompositionDestination(), preparedSemver);
    mkdirp.sync(`${dirPath}`);
  }

  /**
   * Writes the semverist element to the given file path.
   *
   * @param {string} semverElementPath - A semverist element path.
   * @returns {void}
   */
  writeSemveristElementFile(semverElementPath) {
    const originalSemverPath = _.clone(semverElementPath);
    const preparedSemver = semverElementPath.replace(/\./g, '/');
    const fileName = `${preparedSemver}.json`;
    fs.writeJSONSync(
      path.join(
        this.getCompositionDestination(),
        fileName
      ), _.get(this.getComposition(), originalSemverPath));
  }
};
