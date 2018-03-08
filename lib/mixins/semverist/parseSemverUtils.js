const _ = require('lodash');
const semverUtils = require('semver-utils');

/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
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
   * Sets the parsed version of the related semver value to the
   *   passed semverish value. Used to establish a parsed version
   *   of this object's semverish value. Note: The semverValue
   *   needed for this function may have more granularity than the
   *   original semverish value as a result of being translated
   *   to a valid semver.
   * @param {string} semverValue
   *   A valid semver string.
   * @returns {void}
   */
  setSemverParsed(semverValue) {
    this.semverParsed = this.constructor.parseSemver(semverValue);
  }

  /**
   * Returns the parsed object for this semver value.
   *
   * @returns {object}
   *   A parsed semver object from semverUtils.
   */
  getSemverParsed() {
    return this.semverParsed;
  }

  /**
   * Returns parse semver.
   *
   * @static
   * @param {semver} semverValue
   *   A semver string.
   * @returns {object}
   *   a parsed semverValue.
   *
   */
  static parseSemver(semverValue) {
    return semverUtils.parse(semverValue);
  }

  /**
   * Sets an array of semver pieces from the original value.
   *
   * @param {string} semverish
   *   A semverish value with the semveristElement Removed.
   * @returns {array}
   *   An array of semverish pieces that can be related to
   *     the original semverist path.
   */
  setSemverishArray(semverish) {
    this.semverishArray = this.semverishToArray(semverish);
  }

  /**
   * Gets an array of path items related to the original
   *   semverish value.
   * @returns {array}
   *   An array of items with path elements from the original
   *     semverish value.
   */
  getSemverishArray() {
    return this.semverishArray;
  }

  /**
   * Turns a semverish value to an array.
   *
   * @param {string} semverish
   *  A semverish value.
   * @returns {Array}
   *   An array with semverish values.
   */
  semverishToArray(semverish) {
    const tmpSemverish = _.cloneDeep(semverish);
    let tmpArray = this.splitStringNoEmpties(tmpSemverish);
    // Check to see if tmpSemverish can be parsed.
    if (semverUtils.parse(tmpSemverish)) {
      const tmpParsed = semverUtils.parse(tmpSemverish);
      // The only way this is true is if we have a parseable semverish value.
      if (_.has(tmpParsed, 'release')) {
        // The original semverish value had a prerelease in it.
        // Note: This is the key value here in that alpha.0 is
        // a valid semver prerelease when parsed, but for hierarchy
        // its important that it is split.
        tmpArray = tmpParsed.version.split('.');
        Array.prototype.push.apply(
          tmpArray,
          this.splitStringNoEmpties(tmpParsed.release)
        );
        if (_.has(tmpParsed, 'build')) {
          tmpArray.push(tmpParsed.build);
        }
      }
    }
    return tmpArray;
  }


  /**
   * Despecifies the semverish value associated with this object to the desired
   *   level. Can give you less granularity reducing a patch level semver to its
   *   minor or major components etc.
   *
   * @param {integer} desiredLevel - The level of semver positions you want
   *   to report back. Must not be greater than the number of semver positions
   *   in the original semverish value.
   *
   * @returns {string} - A semverish value reduced to the passed desired level
   *   of semver positions.
   */
  despecifySemver(desiredLevel) {
    let tmpLevel = desiredLevel;
    if (desiredLevel === undefined) {
      tmpLevel = 1;
    }
    return this.despecify(this.getSemver(), tmpLevel);
  }

  /**
   * A utility function to despecify a semver value to the
   *   desired level. Despecifying loses granularity below
   *   the indicated level.
   *
   * @param {string} semver - A valid semver string.
   * @param {int} level - A number indicating the semver place
   *   level that you wish to  despecify from, i.e. 1- major
   *   2 - minor, 3 - patch, 4 - prerelease, 5 - build
   * @returns {string} A semverish string descpecified to the level
   *   indicated. Note that with prereleases this will needed
   *   to be intelligently
   */
  despecify(semver, level) {
    // Break into parsed components.
    const parsed = this.constructor.parseSemver(semver);
    // Split up the semver version sting (only goes to patch even
    // if prerelease).
    const tmpSemver = parsed.version.split('.');

    if (_.has(parsed, 'release')) {
      Array.prototype.push.apply(
        tmpSemver,
        this.splitStringNoEmpties(parsed.release)
      );
    }

    if (_.has(parsed, 'build')) {
      tmpSemver.push(parsed.build);
    }
    if (level >= 4) {
      if (level !== 5) {
        delete parsed.build;
      }
      return semverUtils.stringify(parsed);
    }
    return tmpSemver.slice(0, level).join('.');
  }
};
