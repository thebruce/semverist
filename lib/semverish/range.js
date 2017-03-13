'use strict';

const semverUtils = require('semver-utils');
const semver = require('semver');
const _ = require('lodash');
const Molotov = require('../molotov');

module.exports = function rangeFactory(superNameSpace, pluginName) {
  const molotov = new Molotov();
  let setUp;
  if (pluginName) {
    setUp = molotov.getMolotov()  // Ensures we get any superOverrides from config.
    .then(pluginMaker => pluginMaker.resolve())
    .then(resolved => resolved[superNameSpace][pluginName]);
  }
  else {
    setUp = molotov.getSupers()
    .then(superClasses => superClasses[superNameSpace]);
  }

  return setUp.then(extendedClass => class range extends extendedClass {
    init(rangeValue, config) {
      super.init(config);
    }

    /**
     * Sets the range for this object.
     *
     * @param {string} range
     *  A semver range.
     */
    setRange(rangeValue) {
      this.range = semver.validRange(rangeValue);
    }

    /**
     * Gets the range for this item.
     *
     * @returns {string}
     *  A valid semver range.
     */
    getRange() {
      return this.getRange;
    }

    setLowerBounds(semverValue) {
      this.lowerBounds = semver.valid(semverValue);
    }

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
    addSemverishToSemverRange(value, inheritenceOverride) {
      // add single values up into a valid range

      // a
      this.fake = inheritenceOverride;
      // So this is a general function to take a range and add a value
      // to that range.
      // This could be used for individual elements like an semverist
      //  attribute/group/default

      // Or for the semverist objects range.
      this.faker = value;
      /**
       * RESULTS OF SEMVER VALID RANGE CONVERSIONS
       *   '^1.0.1 ^1.0.0' :: returns >=1.0.1 <2.0.0 >=1.0.0 <2.0.0
       *   >1.0 || >1.0.0 :: >=1.1.0||>1.0.0
       *   <1.0 || <1.0.0 :: <1.0.0||<1.0.0
       *
       *
       * We'd call this with the options for
       * config.semveristBehaviors.inheritence
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
       * we may need to break up the semver range for adjacent or
       *   range values --
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
       *      includes 1.2.1 and we add 1.2.2 then we can make 1.2.1,
       *      1.2.1-1.2.2 EX: 1.2.1 - 1.2.2
       * * Adjacent x ranges of the same semver part can be turned into explicit
       *     lower bound by filing out x and upper bound by going to the next
       *      higher parent. (x ranges can also be expressed as >=1.2.0 <1.3.0)
       *      EX: 1.2.x + 1.3.x  = >=1.2.0 <1.4.0
       * * specificity that satisfies ranges
       */
      // Fakey fakerson.
      this.fake = true;
      let newRange = `1.0.0 ${value}`;
      newRange = false;
      return newRange;
    }

    /**
     * Returns the count of leading zeroes in major, minor and patch
     * values from a parsed semver string.
     *
     * @param {string} semverishValue
     *   A semverish path of a least a major value.
     * @returns {integer}
     *   A count of leading zeroes in this semverish path.
     */
    semverLeadingZeroCount() { // eslint-disable-line class-methods-use-this
      if (!this.getSemverParsed()) {
        throw new Error('There must be a parsed semver to analyze.');
      }
      let count = 0;
      if (this.getSemverParsed().major === '0') {
        count += 1;
        if (this.getSemverParsed().minor === '0') {
          count += 1;
          if (this.getSemverParsed().patch === '0') {
            count += 1;
          }
        }
      }
      let subCount = 0;
      // here difference between semver and parsed
      this.getSemverishArray().slice(0, 3).forEach((item) => {
        if (_.isFinite(_.parseInt(item))) {
          subCount += 1;
        }
      });
      if (count > 0) {
        count -= (3 - subCount);
      }
      // array 0,1,2 <- if they are all numbers
      return count;
    }

    /**
     * Converts a leading zero semver path to a semver range implementing.
     *   lazy semverist.
     *
     * @param {string} semverishValue - A semverish value.
     *
     * @param {any} leadingZeroCount - A count of leading zeroes in the semver.
     *   Leading zeroes can affect the behavior of certain range operators.
     *
     * @returns {string}
     *   A valid semver range implementing lazy semverist.
     */
    convertLeadingZeroSemverToLazySemveristRange(semverishValue) {
      let tmpSemver = semverishValue;

      const tmpArray = this.splitStringNoEmpties(semverishValue);
      if (tmpArray.length < 3) {
        tmpSemver = this.valueToSemver(semverishValue);
      }

      return semver.validRange(`>=${tmpSemver} < 1.0.0`);
    }

    /**
     * Takes a path and returns a range based on semverist configuration.
     *
     * @param {string} path
     *   A semverish style path separated by periods.
     * @param {any} options
     */
    pathToRange(pather, options) {
      // Break into parts filter out empties.
      const pathArray = this.splitStringNoEmpties(pather);

      if (pathArray.length === 0) {
        // A path must have atlease one component to it.
        throw new Error('The path must have atleast a single major component.');
      }
      if (!_.has(options, 'inheritence')) {
        throw new Error('The options object must have inheritence defined even if its value is null.');
      }
      if (
        options.inheritence !== 'semverImplied'
        && options.inheritence !== null
        && options.inheritence !== 'lazySemverist'
      ) {
        throw new Error('The options inheritence attribute must one of the following values: semverImplied, undefined, or lazySemverist');
      }

      // Break the path up into its constituent parts.
      const parsed = semverUtils.parse(pather);

      if (options.inheritence === null) {
        // No inheritence means things are set and only apply to
        // exact semver equivalents.
        return this.valueToSemver(pather);
      }

      if (
        options.inheritence === 'semverImplied'
        ||
        options.attribute === 'semveristObject'
        ||
        (
          options.inheritence === 'lazySemverist'
          && options.attribute !== 'attribute'
        )
      ) {
        // If have the terminal number of parts,
        // 3 for non-prelease or prerelease with a build indicated.
        // then we are talking about a specific semver version only.
        if ((pathArray.length === 3 && !_.has(parsed, 'release')) || (_.has(parsed, 'build'))) {
          return pather;
        }
        // Otherwise semver inheritence kicks in and we attache a tilde
        // to our value before forming into a valid range.
        return this.toTildeRange(pather);
      }

      if (pathArray.length > 1) {
        if (pathArray.length > 2) {
          // Get leading 0s count for use later.
          const leadingZeroCount = this.semverLeadingZeroCount(pather);
          if (_.has(parsed, 'release')) {
            // we have a prerelease
            // Is prerelease forwards on?
            if (this.getSemveristConfig().semveristBehaviors.lazySemverist.preReleaseForwards) {
              // Prerelease forwards are on.
              if (leadingZeroCount !== 0) {
                let tmpPather = pather;
                // If we have a prerelease but no sub-release fill that out.
                if (this.splitStringNoEmpties(parsed.release).length !== 2) {
                  tmpPather = `${tmpPather}.0`;
                }
                let tmpMajor = this.despecifySemver(tmpPather, 1);
                tmpMajor = this.getNextHigherMajor(tmpMajor);
                return `>=${tmpPather} <${tmpMajor}`;
              }
              return this.toCaretRange(pather);
            }
          }
          else {
            if (leadingZeroCount > 0) {
              return this.convertLeadingZeroSemverToLazySemveristRange(pather, leadingZeroCount);
            }
            let tmpMajor = this.despecifySemver(pather, 1);
            tmpMajor = this.getNextHigherMajor(tmpMajor);
            return `>=${pather} <${tmpMajor}`;
          }
        }
        else {
          // We have 2 items
          return `>=${pather}.0 <${this.getNextHigherMajor(pather)}`;
        }
      }

      // Can return for >3 length with prerelease with no prerelease forwards.
      return this.toTildeRange(pather);
    }

    /**
   * Transforms a semverish path to a tilde range.
   *
   * @param {string} pather
   *   A semverish path of at least a major value.
   * @returns {string}
   *   A valid semver range.
   */
    toTildeRange(pather) { // eslint-disable-line class-methods-use-this
      return semver.validRange(`~${pather}`);
    }

    /**
     * Transforms a semverish path to a caret range.
     *
     * @param {string} pather
     *   A semverish path of at least a major value.
     * @returns {string}
     *   A valid semver range.
     */
    toCaretRange(pather) { // eslint-disable-line class-methods-use-this
      return semver.validRange(`^${pather}`);
    }

    /**
     * Returns the next highest major version at 0 minor and 0 patch. This
     *   can be useful when constructing lazySemverist ranges.
     *
     * @param {string} pather
     *   A semverist string.
     * @returns {string}
     *  A semver path at the next highest major level, at 0 minor
     *   and 0 patch versions.
     */
    getNextHigherMajor() {
      return `${Number(this.getSemverParsed().major) + 1}.0.0`;
    }
  });
};

