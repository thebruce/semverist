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
      if (configs !== undefined) {
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
    setUpperBounds(semverRange) {
      this.upperBounds = this.constructor.validateRange(semverRange);
      // Upper bounds should be higher than lower bounds.
      // And lower bounds must satisfy or be less than upper bounds.
      // ltr would be applicable in prerelease lowerbounds cases.
      if (!semver.satisfies(this.getLowerBounds(), this.upperBounds)) {
        if (
          !semver.outside(this.getLowerBounds(), this.upperBounds, '<')
          && (this.determineSemverishLevel(this.getLowerBounds()) !== 'prerelease')
        ) {
          throw new Error('Lower bounds value must satisfy or be less than upperBounds range');
        }
      }
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
      if (
        semver.satisfies(semverValue, this.getUpperBounds())
        ||
        semverValue === semverUtils.stringify(semverUtils.parseRange(this.getUpperBounds())[0])) {
        // Lazy semver terminal bounds can be equal or later and semver implied
        // can be equal or a child.
        this.terminalBounds = this.constructor.validateRange(`<${semverValue}`);
      }
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

    /**
     * Gets the implied upper bound which is a terminalBounds if present, if
     *   not then an upperBounds and if not, a null value.
     *
     * @returns {string|null} - A string or a null depending on whether
     *   we were able to retrieve either a terminal or upperbounds string
     *   or neither.
     */
    getProcessedUpperBound() {
      // Do we have a terminal bounds
      if (this.terminalBounds) {
        return this.getTerminalBounds();
      }
      // If not do we have upper bounds.
      if (this.upperBounds) {
        return this.getUpperBounds();
      }
      // If not we have no top.
      return null;
    }

    /**
     * Set Options for this range object.
     */
    setOptions() {
      this.options = this.createOptions(this.getSemveristElementType());
    }

    /**
     * Get options for this range object.
     *
     * @returns {object} - An options object.
     */
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

    /**
     * Sets a valid semver range for this range class.
     * @throws - Will throw if no lowerBounds is set for this range class.
     */
    setRange() {
      // take into account lowerBounds. This must be there.
      if (!this.getLowerBounds()) {
        throw new Error('Can not create a range without a lower bounds value.');
      }
      if (!this.getProcessedUpperBound()) {
        // If we have no upper bounds at the moment, we only have one value.
        // We can construct a range from this value based on our config.
        this.range = this.pathToRange(this.getSemverish(), this.getOptions());
        // We have no upperBound, we should set one from the new range.
        this.setUpperBounds(this.constructor.getHighestSemverinTerminalRange(this.range));
      }
      else if (this.getSemveristConfig().semveristBehaviors.inheritence === 'lazySemverist') {
        // If lazy semver is turned on and we have an upper bound.
        let finalthing;
        if (this.getChildRangeArray()) {
          // LowerBounds to first child is the range.
          finalthing = this.getChildRangeArray()[0];
        }
        else {
          finalthing = this.getProcessedUpperBound();
        }
        this.range = `>=${this.getLowerBounds()} <${finalthing}`;
      }
      else if (this.getSemveristConfig().semveristBehaviors.inheritence === 'semverImplied') {
        this.range = this.makeInheritenceRangeFromSemverish(
          this.getLowerBounds(),
          this.getProcessedUpperBound()
        );
        // We may have a new terminal range.
      }
      else {
        // No inheritence means ranges satisfy only the lower bounds.
        this.range = this.getLowerBounds();
      }
    }

    /**
     * Returns the range for this class.
     *
     * @returns {string} - a valid semver range string.
     */
    getRange() {
      return this.range;
    }

    /**
     * Returns the Highest Semver range element in a range if there is a
     *   terminal value at the end. Termninal values have a <
     *   or <= operator.
     *
     * @static
     * @param {string} rangeValue - a valid semver range string.
     * @returns {string} - a valid semver range.
     */
    static getHighestSemverinTerminalRange(rangeValue) {
      const tmpParsed = semverUtils.parseRange(rangeValue);
      const lastItem = tmpParsed[tmpParsed.length - 1];
      if (lastItem.operator.indexOf('<') !== -1) {
        // We found less than as an operator.
        return semverUtils.stringifyRange([lastItem]);
      }
      throw new Error('The range has no terminal value');
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
        throw new Error('The options inheritence attribute must one of the following values: semverImplied, null, or lazySemverist');
      }
      // If path is semverish and not semver.
      const pathSemver = this.valueToSemver(pather);

      // Break the path up into its constituent parts.
      const parsed = semverUtils.parse(pathSemver);

      if (options.inheritence === null) {
        // No inheritence means things are set and only apply to
        // exact semver equivalents.
        return this.valueToSemver(pather);
      }
      if (this.useSemverImplied(options)) {
        // If have the terminal number of parts,
        // 3 for non-prelease or prerelease with a build indicated.
        // then we are talking about a specific semver version only.
        if ((pathArray.length === 3 && !_.has(parsed, 'release')) || (_.has(parsed, 'build'))) {
          return pather;
        }
        // return a range based on hierarchical inheritence.
        return this.makeInheritenceRangeFromSemverish(pather);
      }
      // Or Return a lazy semver based range.
      return this.makeLazySemveristRangeFromSemverish(
        pather,
        this.getSemveristConfig().semveristBehaviors.lazySemverist.preReleaseForwards
      );
    }

    /**
     * Determines whether semver implied inheritence should be used.
     *
     * @param {Object} [options] - An optional options object which contains
     *   information about the inheritence behavior and semantic element in
     *   use for this range class.
     * @returns {Boolean} - true if semverImplied inheritence should be used
     *   given this options object.
     */
    useSemverImplied(options) {
      let tmpOptions = options;
      if (options === undefined) {
        tmpOptions = this.getOptions();
        if (!_.has(tmpOptions, 'attributeType')) {
          tmpOptions.attribute = this.getSemveristElementType();
        }
      }

      if (tmpOptions.inheritence !== null) {
        return (
          tmpOptions.inheritence === 'semverImplied' ||
          tmpOptions.attributeType === 'semveristObject' ||
          (
            tmpOptions.inheritence === 'lazySemverist' &&
            tmpOptions.attributeType !== 'attribute'
          )
        );
      }
      return null;
    }

    /**
     * Creates a range with hierarchical inheritence for a semverish value.
     *
     * @param {string} semverish
     * @returns {string} - a semver range.
     */
    makeInheritenceRangeFromSemverish(earlySemverish, laterSemverish) {
      const semverishLevel = this.determineSemverishLevel(earlySemverish);
      let tmpSemverLater;
      // Semverish to semver
      const tmpSemverEarly = this.valueToSemver(earlySemverish);
      if (laterSemverish !== undefined) {
        tmpSemverLater = this.valueToSemver(laterSemverish);
      }
      if (_.has(this.constructor.parseSemver(tmpSemverEarly), 'release')) {
        // Test to see that our laterSemverish is less than or equal to what our
        // hierarchical inheritence would dictate.
        const hierarchicalEnd = this.despecify(earlySemverish, 3);

        if (tmpSemverLater) {
          if (semver.lte(tmpSemverLater, hierarchicalEnd)) {
          // If we have a prerelease we want to push up until the patch version.
            return semver.validRange(`>=${tmpSemverEarly} <${tmpSemverLater}`);
          }
          throw new Error(`An inheritence based range could not be created because the ${laterSemverish} was not smaller than the ${hierarchicalEnd} value which satisfies inheritence.`);
        }
        return semver.validRange(`>=${tmpSemverEarly} <${hierarchicalEnd}`);
      }
      // otherwise we have anything up to patch.
      const levels = [
        'major',
        'minor',
        'patch',
        'release',
        'build'
      ];
      const tmpRangeTop = this.despecify(
        semver.inc(tmpSemverEarly, semverishLevel),
        levels.indexOf(semverishLevel) + 1
      );
      if (tmpSemverLater) {
        if (semver.lte(tmpSemverLater, tmpRangeTop)) {
          // If we have a prerelease we want to push up until the patch version.
          return semver.validRange(`>=${tmpSemverEarly} <${tmpSemverLater}`);
        }
        throw new Error(`An inheritence based range could not be created because the ${laterSemverish} was not smaller than the ${tmpRangeTop} value which satisfies inheritence.`);
      }
      return semver.validRange(`>=${tmpSemverEarly} <${tmpRangeTop}`);
    }


    makeLazySemveristRangeFromSemverish(earlySemverish, prereleaseForwards, laterSemverish) {
      const semverishLevel = this.determineSemverishLevel(earlySemverish);
      const tmpSemverEarly = this.valueToSemver(earlySemverish);
      let tmpSemverLater;
      if (laterSemverish !== undefined) {
        tmpSemverLater = this.valueToSemver(laterSemverish);
      }
      let tmpRange = `>=${tmpSemverEarly} <`;
      // Prereleases are a problem for lazy semverist.
      if (semverishLevel === 'prerelease' || semverishLevel === 'build') {
        // if we have prerelease forwards
        const nextSemver = this.despecify(tmpSemverEarly, 3);
        if (tmpSemverLater) {
          if (semver.lte(tmpSemverLater, nextSemver)) {
            return `${tmpRange}${tmpSemverLater}`;
          }
        }
        tmpRange = `${tmpRange}${nextSemver}`;
        if (!prereleaseForwards) {
          // Without forwards we go from the prerelease guy up to the
          // next patch version.
          return semver.validRange(tmpRange);
        }
        // If we do have prerelease forwards let's prepare temp range
        // for the next item.
        tmpRange = `${tmpRange} >= ${this.despecify(tmpSemverEarly, 3)} <`;
      }
      // For lazy semverist we want this to run to the upperBounds,
      // and if we've gotten this far, any upperBounds indicated
      // has not satisfied the equation yet.
      const tmpTerminal = semver.inc(
          this.valueToSemver(
            this.despecify(
              tmpSemverEarly,
              1
            )
          ),
          'major'
        );
      if (tmpSemverLater) {
        // We have a terminal value. Let's ensure that it is lower than
        // the default.
        if (semver.lte(tmpSemverLater, tmpTerminal)) {
          return semver.validRange(`${tmpRange}${tmpSemverLater}`);
        }
        throw new Error('The terminal value of a lazy semver range was higher than the default.');
      }
      return semver.validRange(
        `${tmpRange}${semver.inc(
          this.valueToSemver(
            this.despecify(
              tmpSemverEarly,
              1
            )
          ),
          'major'
        )}`);
    }

    /**
     * Sets the range array for the range. This array is composed of
     *   valid semver ranges gathered for this range. Ranges can be
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

    setExceptions() {
      this.exceptions = [];
    }

    getExceptions() {
      return this.exceptions;
    }

    addException(semverishValue) {
      const levels = [
        'major',
        'minor',
        'patch',
        'prerelease',
        'build'
      ];
      // All exceptions must satisfy the range.
      if (this.satisfiesRange(this.valueToSemver(semverishValue))) {
        // Depending on our inheritence scheme and what semverish
        // Element we have.
        if (this.getOptions().inheritence !== null
        && this.getOptions().inheritence !== undefined && this.getExceptions().length === 0) {
          this.exceptions.push(semverishValue);
        }
        else if (this.useSemverImplied()) {
          let childOfSomeone = false;
          // Semver Implied - add exceptions if the value is not a child of
          // an existing value.
          // Is the new value a child of any existing values.
          this.getExceptions().forEach((element) => {
            const test = this.analyzeSemverishAdjacency(element, semverishValue);
            if (test.child) {
              childOfSomeone = true;
            }
          }, this);
          if (!childOfSomeone) {
            const cleanUpItems = [];
            // It was not a child value. We will add it. But first let's see if
            // we should rip out any values
            // because they are children of this value.
            this.getExceptions().forEach((element) => {
              const test = this.analyzeSemverishAdjacency(semverishValue, element);
              if (test.child) {
                childOfSomeone = true;
                cleanUpItems.push(element);
              }
            }, this);
            // Filter out any clean up cleanUpItems
            this.exceptions = _.difference(this.exceptions, cleanUpItems);
            this.exceptions.push(semverishValue);
            // sort array.
            this.exceptions = this.sortSemverishArray(this.exceptions);
          }
        }
        else if (this.getOptions().inheritence === 'lazySemverist') {
          // Lazy Semverist. - Only add if this is lower than the
          // current exception
          if (semver.lte(
            this.valueToSemver(semverishValue),
            this.valueToSemver(
              this.getExceptions()[0])
            )) {
            if (
              levels.indexOf(this.determineSemverishLevel(semverishValue))
              <= levels.indexOf(this.determineSemverishLevel(this.getExceptions()[0]))) {
              this.exceptions = [semverishValue];
            }
          }
        }
      }
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
  });
};
