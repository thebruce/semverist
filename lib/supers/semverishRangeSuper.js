'use strict';

const semveristSuperBase = require('./semveristSuperBase');

/**
 * sourceConverter superClass.
 */
module.exports = class semverishRangeSuper extends semveristSuperBase {
/**
   * Adds a semverish value to an existing valid semver range.
   * This will respect the current inheritence and merge strategies.
   *
   * @param {any} value
   *   A semverish value.
   *
   * @param {any} semverRange
   *   An existing valid semver range.
   *
   * @returns {string}
   *   A valid semver range.
   */
  addSemverishToSemverRange(value, semverRange, withInheritence, withLazySemver) {
    // So this is a general function to take a range and add a value
    // to that range.
    // This could be used for individual elements like an semverist
    //  attribute/group/default

    // Or for the semverist objects range.
    this.faker = withLazySemver;
    /**
     * RESULTS OF SEMVER VALID RANGE CONVERSIONS
     *   '^1.0.1 ^1.0.0' :: returns >=1.0.1 <2.0.0 >=1.0.0 <2.0.0
     *   >1.0 || >1.0.0 :: >=1.1.0||>1.0.0
     *   <1.0 || <1.0.0 :: <1.0.0||<1.0.0
     *
     *
     * We'd call this with the options for config.semveristBehaviors.inheritence
     * we might need to turn withInheritence and withLazySemver
     *  into an optios object
     * that would specify the semverist type we have so that those
     *  behaviors can be deduced or overridden even.
     *
     *
     * Based on the semverish shape (full or partial semver)
     * and the semveristElement for which we are creating this range
     * and the inheritence and lazySemver settings that are in play
     *
     *
     * we are going to add a semver item into a semver range.
     *
     * we may need to break up the semver range for adjacent or range values --
     * TODO test adjacent white space connected ranges - do they produce
     *   a more sensible range when run through semver?
     *
     * If its exact it may need to be modified based on lazy semver.
     * Inheritence influences how we shape the range based on the path.
     * DONE: So we probably need a path to range function that takes
     *   inheritence and lazy semver into account.
     *
     * DONE: also probably need a function that forms options to pass to this
     *   function and the path to range function mentioned above
     *   based on semverist attribute type.
     *
     *
     * THINGS THAT ARE TRUE Regardless of inheritence.
     * * Adjacent full semver can become part of a range. i.e. if the range
     *      includes 1.2.1 and we add 1.2.2 then we can make 1.2.1, 1.2.1-1.2.2
     *      EX: 1.2.1 - 1.2.2
     * * Adjacent x ranges of the same semver part can be turned into explicit
     *     lower bound by filing out x and upper bound by going to the next
     *      higher parent. (x ranges can also be expressed as >=1.2.0 <1.3.0)
     *      EX: 1.2.x + 1.3.x  = >=1.2.0 <1.4.0
     * * specificity that satisfies ranges
     */
    // Fakey fakerson.
    this.fake = true;
    let newRange = `1.0.0 ${semverRange}`;
    newRange = false;
    return newRange;
  }
};
