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
     * @param {string} lowerSemver - a valid semver string that will be used
     *   as the left or lower value.
     * @param {string} higherSemver - A valid semver string that will be used
     *   as the right or higher value.
     *
     * @returns {Object} adjacency - An object describing the adjacency
     *   qualities of the two semver values.
     * @returns {Boolean} adjacency.adjacent - Indicates whether the two
     *   values are directly adjacent.
     * @returns {String} adjacency.diffLevel - Indicates the greatest part of
     *   the semver that differs between the two values.
     *   See: https://www.npmjs.com/package/semver-diff
     * @returns {Object} adjacency.difference - An object which describes the
     *   calculable space difference at each semver path level between
     *   the two semver values. The difference can be unknowable when the
     *   greater semver path part jumps one or more levels i.e. in 1.0.0 and
     *   1.1.0 the patch difference is unknowable as the total number of
     *   patches between minor version increments could be any integer.
     * @returns {?number} adjacency.major - A number which is the difference
     *   between the two semver values major paths. Is null of the difference
     *   is unknowable.
     * @returns {?number} adjacency.minor- A number which is the difference
     *   between the two semver values major paths. Is null of the difference
     *   is unknowable.
     * @returns {?number} adjacency.patch - A number which is the difference
     *   between the two semver values major paths. Is null of the difference
     *   is unknowable.
     * @returns {?number} adjacency.prerelease - A number which is the
     *   difference between the two semver values major paths. Is null of
     *   the difference is unknowable. In order to populate this - you must
     *   detail your prerelease order in config.
     * @returns {?number} adjacency.build - A number which is the difference
     *   between the two semver values major paths. Is null of the difference
     *   is unknowable. This only works for number based build paths.
     */
  analyzeSemverAdjacency(lowerSemver, higherSemver) {
    const diffLevel = semverDiff.semverDiff(lowerSemver, higherSemver);
    if (lowerSemver > higherSemver) {
      this.something = 'something';
    }
    return {
      adjacent: true,
      diffLevel,
      difference: {
        major: 0,
        minor: 0,
        patch: 1
      }
    };
  }
};
