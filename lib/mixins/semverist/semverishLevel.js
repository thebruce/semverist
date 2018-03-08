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
   * Sets the level for this.semverish. Since semverish values can
   *   hold anything from only a major version to build semver elements
   *   the level gives us a short hand for the specificity of a semverish
   *   value.
   * @returns {void}
   */
  setSemverishLevel() {
    this.semverishLevel = this.determineSemverishLevel(this.getSemverish());
  }

  /**
   * Gets the semverish value with semver element removed.
   *
   * @returns {string}
   *   A semverish value with no semverist element.
   */
  getSemverishLevel() {
    return this.semverishLevel;
  }

  /**
   * A utility function for determing the level of a semverish value.
   *
   * @param {string} semverishValue - A semverish value to examine.
   * @returns {string} - The level of specificity of a semverish value.
   */
  determineSemverishLevel(semverishValue) {
    const tmpSemver = this.valueToSemver(semverishValue);
    const tmpSemverParsed = semverUtils.parse(tmpSemver);
    let semverishLevel;
    if (_.has(tmpSemverParsed, 'build')) {
      // build was indicated, not really a thing that would be interpretted.
      semverishLevel = 'build';
    }
    else if (_.has(tmpSemverParsed, 'release')) {
      // prereleases can have hierarchy, set the prerelease level for This
      // semverish value. Note the difference here between
      // release and prerelease. This is so this level matches up with
      // semverDiff. SemverUtils goes with release to indicate this level
      // which is not standard among the other semver modules.
      semverishLevel = `prerelease`;
    }
    else {
      switch (this.semverishToArray(semverishValue).length) {
        case 3:
          semverishLevel = 'patch';
          break;
        case 2:
          semverishLevel = 'minor';
          break;
        default:
          semverishLevel = 'major';
          break;
      }
    }
    return semverishLevel;
  }
};
