'use strict';

const semverUtils = require('semver-utils');
const semver = require('semver');
const _ = require('lodash');
const Molotov = require('../molotov');

module.exports = function rangeFactory(superNameSpace, pluginName) {
  const molotov = new Molotov();
  let setUp;
  if (pluginName) {
    setUp = molotov.getMolotov() // Ensures we get any superOverrides from config.
      .then(pluginMaker => pluginMaker.resolve())
      .then(resolved => resolved[superNameSpace][pluginName]);
  }
  else {
    setUp = molotov.getSupers()
      .then(superClasses => superClasses[superNameSpace]);
  }

  return setUp.then(extendedClass => class range extends extendedClass {
    init(configs) {
      if (configs) {
        super.init(configs);
      }
      else {
        super.init();
      }
    }

    /**
     * Gets the declarative lower bounds for a range.
     *
     * @returns {string} - A semver string.
     */
    getLowerBounds() {
      return this.lowerBounds;
    }

    /**
     * Sets a passed semverValue as the declared lower bounds of this range.
     *
     * @param {string} semverValue - A valid semver value which represents
     *   the bottom or lowest possible semver value for this range.
     */
    setLowerBounds(semverValue) {
      this.lowerBounds = semver.valid(semverValue);
    }

    /**
     * Gets the declarative upper bounds for a range.
     *
     * @returns {string} - A semver range string.
     */
    getUpperBounds() {
      return this.upperBounds;
    }

    /**
     * Sets a passed semver range as the declared upper bounds of this range.
     *
     * @param {string} semverValue - A valid semver value which represents
     *   the top or highest possible semver value for this range.
     */
    setUpperBounds(semverValue) {
      this.upperBounds = this.constructor.validateRange(semverValue);
    }

    /**
     * Validate a range string.
     *
     * @param {string} rangeString - A semver range string.
     * @returns {string) - A valid and formatted range string.
     * @throws - Throws an error If the passed range is not valid.
     */
    static validateRange(rangeString) {
      const validRange = semver.validRange(rangeString);
      if (validRange === null) {
        throw new Error('The passed range is not a valid semver range.');
      }
      return validRange;
    }

    /**
     * Set the terminal upper bounds of this range.
     *
     * @param {string} semverValue - A valid semver value that serves as
     *   the terminal upper bounds of this range. Given the various inheritence
     *   capabilities (inheritence and lazy semver) of the semverist, ranges
     *   may extend beyond their declared upperBounds until overridden. The
     *   terminal bounds provides a way to declare a termination to that range
     *   beyond, typically the position of the next occurence of the semverist
     *   element to which this range relates.
     */
    setTerminalBounds(semverValue) {
      this.terminalBounds = this.constructor.validateRange(semverValue);
    }

    /**
     * Returns the terminal element of this range.
     *
     * @returns {string} - The terminal bound of this range.
     *   Expressed as a valid range.
     */
    getTerminalBounds() {
      return this.terminalBounds;
    }

    getProcessedUpperBound() {
      // the upper bound range modified by ther terminal bound range
      // if different.
      return this.upperBounds;
    }

    setOptions() {
      this.options = this.createOptions(this.getSemveristElementType());
    }

    getOptions() {
      return this.options;
    }

    /**
     * An object that describes the metadata around a particular semverist
     *   range.
     *
     * @typedef {Object} semveristRange - A range object
     * @property {string} range - A valid semver range string that represents
     *   the range implied by the location of this semverist element at the
     *   indicated semverishValue and the effects of config defined inheritence
     *   type on the semverist element type for this semverist object.
     * @property {string} lowerBounds - A valid semver string that indicates the
     *   lowest possible value for this semver range. This is extracted from the
     *   conversion (if needed) of the semverish value associated to this string
     *   to a valid semver string.
     * @property {string} upperBounds - A valid semver range string that
     *   indicates the highest possible value expressed as a range.
     *   This is influenced by the type of inheritence indicated by config as
     *   well as any terminal bounds.
     * @property {string} semveristElement - A semverist element name that
     *   may be the semverist default value, a group name, or an attribute name.
     * @property {string} semverishValue - A semverish string value for this
     *   semverist element that relates to the position in the semverist
     *   hierarchy that we are tracking for this semverist Range.
     * @property {string[]} childrenSemverRanges - An array of semver range
     *   strings that share this semverist element that occur within the range
     *   implied by this semverishValue and the inheritence declared for this
     *   semverist Object. Thus the child ranges must be considered
     *   when resolving the range string of this semverist element whether
     *   it observes inheritence or lazy semverist inheritence strategies.
     *   If there is no
     *   inheritence strategy this will be an empty array.
     */

    /**
     * Sets the semverist range object associated to this range.
     *   If values are not yet available it attempts to set them.
     *   {@link semveristRange}
     * @throws - throws an error if we are unable to create the
     *   semverist object.
     */
    setSemveristRange() {
      this.semveristRange = {};

      // set lowerBounds
      // set upperBounds
      // set semverist semveristElement
      // set semverishValue
      // get childrenRanges.
      // set range.

      // Throw if we are unable to resolve them.
    }

    /**
     * Returns the semverist range object associated with this range.
     *
     * @returns {semveristRange}
     *   {@link semveristRange}
     */
    getSemveristRange() {
      return this.semveristRange;
    }

    setRange() {
      this.range = '';
      // take into account lowerBounds

      // take into account processed upper range - do we have any?
        // Y - we have an upper range.
        // Look at inheritence config. Do we have inheritence?
          // Y Inheritence
          // lazy semver?
            // Y
              // lower bounds to the first child.
            // N (inheritence)
              // lower bounds to exceptions to upper bounds
          // N - No inheritence
          // No inheritence means ranges satisfy only the lower bounds.
        // N - no upper range.
        // Run path to range.
    }

    getRange() {
      return this.range;
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
        options.inheritence !== 'semverImplied' &&
        options.inheritence !== null &&
        options.inheritence !== 'lazySemverist'
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
        options.inheritence === 'semverImplied' ||
        options.attribute === 'semveristObject' ||
        (
          options.inheritence === 'lazySemverist' &&
          options.attribute !== 'attribute'
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
     * Sets the range array for the range. This array is composed of
     *   valid semver values gathered for this range. Ranges can be
     *   created for individual semverist elements such as an attribute
     *   or for all semverist elements at once. The range object will
     *   be created accounting for each item according to your inheritence
     *   configuration settings and semverist hierarchy.
     *
     * @param {string} range
     *  A semver range.
     */
    setChildRangeArray(rangeArray) {
      // Test if it is an array.
      let tmpArray = [];
      if (rangeArray) {
        if (_.isArray(rangeArray)) {
          tmpArray = _.map(rangeArray, value => this.constructor.validateRange(value));
        }
        else {
          tmpArray.push(this.constructor.validateRange(rangeArray));
        }
      }
      this.childRangeArray = tmpArray;
    }

    /**
     * Gets the range array for this item.
     *
     * @returns {string}
     *  A valid semver range.
     */
    getChildRangeArray() {
      return this.childRangeArray;
    }

    /**
     * Adds a valid semver string to the range array for this range and
     * updates range object metadata as a result.
     *
     * @param {string} semverValue
     */
    addToChildRangeArray(semverRange) {
      // Add value to array.
      this.childRangeArray.push(this.constructor.validateRange(semverRange));
      // Sort array,
      this.childRangeArray = this.sortRangeArray(this.childRangeArray);
    }

    /**
     * Determines if a semverValue is satisfies the range of the object.
     *
     * @param {string} semverValue - a valid semver value.
     * @returns {Boolean} - true or false as to whether the passed
     *   value satisfies the range of this semverist range.
     */
    satisfiesRange(semverValue) {
      return semver.satisfies(semverValue, this.getRange());
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
  });
};
