'use strict';

const semverDiff = require('semver-diff');

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
   * Analyzes two semver for adjacency with leading
   *   semver matching components. Ex: For 1.0.0 and 1.0.1
   *   the two values are adjacent at the patch level by 1.
   *   so the adjacency Inspector would return:
   *   {
   *     adjacent: true,
   *     diffLevel: patch,
   *     difference: {
   *       major: 0,
   *       minor: 0,
   *       patch: 1
   *     }
   *   }
   *
   * @param {string} semverishToCompare - A semverish value that we will compare
   *   to this.semverish.
   *
   * @returns {Object} adjacency - An object describing the adjacency
   *   qualities of the two semver values.
   * @returns {Boolean} adjacency.adjacent - Indicates whether the two
   *   values are directly adjacent.
   * @returns {Boolean} adjacency.child - Indicates whether the second value
   *   is a hierarchical child of the first.
   * @returns {String} adjacency.diffLevel - Indicates the greatest part of
   *   the semver that differs between the two values.
   *   See: https://www.npmjs.com/package/semver-diff
   */
  analyzeSemverishAdjacency(lowerSemverish, higherSemverish) {
    if (lowerSemverish === higherSemverish) {
      // These are equal.
      return {
        adjacent: false,
        child: false,
        difference: null
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
      'build'
    ];

    // If the diff is null we have either equal elements or the first element
    // is a later version than the second.
    if (differenceLevel === null) {
      if (semverDiff(higherSemver, lowerSemver) === null) {
        // items are equal when realized but weren't initially,
        // higherSemver is a child of lowerSemver in this case.
        return {
          adjacent: false,
          child: true,
          difference: null
        };
      }
      if (levels.indexOf(lowerLevel) <= 1
        && levels.indexOf(semverDiff(higherSemver, lowerSemver)) === 3) {
        // In this case lower level was only specified up to minor version
        // and thus the laterVersion compared might still be a child.
        // Assuming that 1.0.0-alpha and 1.0.0 differe on prerelease
        return {
          adjacent: false,
          child: true,
          difference: null
        };
      }

      return {
        adjacent: false,
        child: false,
        difference: null
      };
    }

    if (levels.indexOf(differenceLevel) > levels.indexOf(lowerLevel)) {
      // WE have a child.
      return {
        adjacent: false,
        child: true,
        difference: null
      };
    }

    if (levels.indexOf(differenceLevel) === levels.indexOf(lowerLevel)) {
      // If this is prerelease we may have something.
      if (this.semverishToArray(lowerSemverish).length === 4
        && this.semverishToArray(higherSemverish).length > 4) {
        return {
          adjacent: false,
          child: true
        };
      }

      if (this.semverishToArray(lowerSemverish).length === 5
        && this.semverishToArray(higherSemverish).length === 5) {
        return {
          adjacent: (this.semverishToArray(higherSemverish)[4]
          - this.semverishToArray(lowerSemverish)[4] === 1),
          child: true
        };
      }

      return {
        adjacent: (
          this.semverishToArray(higherSemverish)[levels.indexOf(differenceLevel)]
          - this.semverishToArray(lowerSemverish)[levels.indexOf(differenceLevel)] === 1),
        child: false
      };
    }
    return {
      adjacent: false,
      child: false
    };
  }
};
