'use strict';

const _ = require('lodash');
const semverUtils = require('semver-utils');

/**
 * This is a semverist plugin for semver parsing. It is self-contained.
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
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
   */
  setSemverParsed(semverValue) {
    this.semverParsed = semverUtils.parse(semverValue);
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
   * Sets an array of semver pieces from the original value.
   *
   * @param {string} semverish
   *   A semverish value with the semveristElement Removed.
   * @returns {array}
   *   An array of semverish pieces that can be related to
   *     the original semverist path.
   */
  setSemverishArray(semverish) {
    const tmpSemverish = _.cloneDeep(semverish);
    this.semverishArray = this.splitStringNoEmpties(tmpSemverish);
    // Check to see if tmpSemverish can be parsed.
    if (semverUtils.parse(tmpSemverish)) {
      const tmpParsed = semverUtils.parse(tmpSemverish);
      // The only way this is true is if we have a parseable semverish value.
      if (_.has(tmpParsed, 'release')) {
        // The original semverish value had a prerelease in it.
        this.semverishArray = tmpParsed.version.split('.');
        Array.prototype.push.apply(
          this.semverishArray,
          this.splitStringNoEmpties(tmpParsed.release)
        );
        if (_.has(tmpParsed, 'build')) {
          this.semverishArray.push(tmpParsed.build);
        }
      }
    }
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
    const tmpSemver = this.getSemverParsed().version.split('.');
    let count = 3;

    let subCount = 0;
    this.getSemverishArray().slice(0, 3).forEach((item) => {
      if (_.isFinite(_.parseInt(item))) {
        subCount += 1;
      }
    });
    if (subCount <= 2) {
      count -= (3 - subCount);
    }

    tmpSemver.slice(0, count + 1);

    if (_.has(this.getSemverParsed(), 'release')) {
      Array.prototype.push.apply(
        tmpSemver,
        this.splitStringNoEmpties(this.getSemverParsed().release)
      );
    }

    if (_.has(this.getSemverParsed(), 'build')) {
      tmpSemver.push(this.getSemverParsed().build);
    }

    return tmpSemver.slice(0, tmpLevel).join('.');
  }
};
