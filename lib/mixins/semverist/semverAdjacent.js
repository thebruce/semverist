const semverDiff = require('semver-diff');
const semver = require('semver');

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
   * Analyzes two semver for adjacency with leading
   *   semver matching components. Ex: For 1.0.0 and 1.0.1
   *   the two values are adjacent at the patch level by 1.
   *   so the adjacency Inspector would return:
   *   {
   *     adjacent: true,
   *     child: false
   *   }
   *
   * @param {string} lowerSemverish - A semverish value that we will compare
   *   to the higher semverish.
   * @param {string} higherSemverish - A semverish value that we will compare
   *   to the lowerSemverish.
   *
   * @returns {Object} adjacency - An object describing the adjacency
   *   qualities of the two semver values.
   * @returns {Boolean} adjacency.adjacent - Indicates whether the two
   *   values are directly adjacent.
   * @returns {Boolean} adjacency.child - Indicates whether the second value
   *   is a hierarchical child of the first.
   */
  analyzeSemverishAdjacency(lowerSemverish, higherSemverish) {
    if (lowerSemverish === higherSemverish) {
      // These are equal.
      return {
        adjacent: false,
        child: false,
        equal: true,
      };
    }

    // Turn these semverish values to semver values for comparison.
    const lowerSemver = this.valueToSemver(lowerSemverish);
    const higherSemver = this.valueToSemver(higherSemverish);
    const differenceLevel = semverDiff(lowerSemver, higherSemver);

    // What level does the semverish go to?
    const lowerLevel = this.determineSemverishLevel(lowerSemverish);

    const levels = [
      'major',
      'minor',
      'patch',
      'prerelease',
      'build',
    ];

    let adjacent = false;
    let child = false;
    let equal = false;

    // If the diff is null we have either equal elements or the first element
    // is a later version than the second.
    if ((differenceLevel === null && semverDiff(higherSemver, lowerSemver) === null)
          ||
          (
            levels.indexOf(lowerLevel) <= 1
            && levels.indexOf(semverDiff(higherSemver, lowerSemver)) === 3
          )
          ||
          (levels.indexOf(differenceLevel) > levels.indexOf(lowerLevel)
          )) {
      // A number of cases where we have a child.
      // 1) We have a child if the diff is null and both values are equal
      // now that they have been turned into semver from semverish. Which
      // means one of the values is a hierarchical child of the first.
      // 2) THe difference between the two values occurs at a
      // level of specificity that is more than the lower level,
      // meaning that everything was equal along the way
      // so that the second value is a hierarchical child of the first.
      child = true;
      if (differenceLevel === null && semverDiff(higherSemver, lowerSemver) === null) {
        equal = true;
      }
    }
    else if (levels.indexOf(differenceLevel) === levels.indexOf(lowerLevel)) {
      // The difference level is the same as the specificity level of
      // the first value. Normally this would indicate that we do not
      // have a child but may have adjacency. However If this is prerelease
      // (lenth 4 or 5) we may have something.
      if (this.semverishToArray(lowerSemverish).length === 4
        && this.semverishToArray(higherSemverish).length > 4) {
        // we can't determine adjacency for prereleases with
        // out dot separated numbers. But we can know if they have children.
        // Ensure that this is the same greek alpha.
        if (
          this.semverishToArray(lowerSemverish)[3]
            ===
              this.semverishToArray(higherSemverish)[3]
        ) {
          child = true;
        }
      }
      else if (this.semverishToArray(lowerSemverish).length === 5
        && this.semverishToArray(higherSemverish).length === 5) {
        // Again if this is a prerelease we may have something.
        // We can try to determine adjacency for pre releases that do include
        // dot separated numbers.
        if (
          this.semverishToArray(lowerSemverish)[3]
            ===
              this.semverishToArray(higherSemverish)[3]
        ) {
          adjacent = (this.semverishToArray(higherSemverish)[4]
            - this.semverishToArray(lowerSemverish)[4] === 1);
        }
      }
      else if ((this.semverishToArray(higherSemverish)[levels.indexOf(differenceLevel)]
          - this.semverishToArray(lowerSemverish)[levels.indexOf(differenceLevel)] === 1)
          && semverDiff(semver.inc(lowerSemver, differenceLevel), higherSemver) === null) {
        // This is defnitely not a child but may be adjacent.
        adjacent = this.semverishToArray(
          higherSemverish
        )[levels.indexOf(differenceLevel)]
          - this.semverishToArray(lowerSemverish)[levels.indexOf(differenceLevel)] === 1;
      }
    }
    // Otherwise we have no adjacency or child.
    return {
      adjacent,
      child,
      equal,
    };
  }
};
