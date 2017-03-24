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
    init(configs, semverish) {
      if (configs !== undefined) {
        super.init(configs);
      }
      else {
        super.init();
      }
      if (semverish) {
        // Set items from the passed semverish instance.
        this.setLowerBounds(semverish.getSemver());
        this.setSemverish(semverish.getSemverish());
        this.semverishArray = semverish.getSemverishArray();
        this.setSemveristElement(semverish.getSemverishElement());
        this.semveristElementType = semverish.getSemveristElementType();
        this.setOptions();
        this.semver(semverish.getSemver());
        this.setExceptions();
        this.setRange();
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
      let tmpSemver = semverValue;
      if (semver.valid(semverValue)) {
        tmpSemver = this.constructor.validateRange(`<${semverValue}`);
      }
      tmpSemver = this.constructor.validateRange(tmpSemver);
      if (tmpSemver) {
        this.terminalBounds = tmpSemver;
      }
      else {
        throw new Error('Terminal bounds must be a valid range or semver string');
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
     * @property {Array} exceptions - An array of semverish values that
     *   represent related occurences of this same semverist element within
     *   the semverish hierarchy that should override the instance of this
     *   element represented by this range class.
     * @property {string} range - A valid semver range string that represents
     *   the range implied by the location of this semverist element at the
     *   indicated semverishValue and the effects of config defined inheritence
     *   type on the semverist element type for this semverist object.
     * @property {string} lowerBounds - A valid semver string that indicates the
     *   lowest possible value for this semver range. This is extracted from the
     *   conversion (if needed) of the semverish value associated to this string
     *   to a valid semver string.
     * @property {string} semveristElement - A semverist element name that
     *   may be the semverist default value, a group name, or an attribute name.
     * @property {string} semveristElementType - the type of the semverist
     *   element.
     * @property {string} semverishValue - A semverish string value for this
     *   semverist element that relates to the position in the semverist
     *   hierarchy that we are tracking for this semverist Range.
     * @property {string[]} exceptionRange - A semver range string that
     *   represents entities that share this semverist element amd occur
     *   within the range implied by this semverishValue and the
     *   inheritence declared for this semverist Object. Thus the
     *   child ranges must be considered when resolving the range
     *   string of this semverist element whether it observes inheritence
     *   or lazy semverist inheritence strategies.
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
      this.semveristRange = {
        lowerBounds: this.getLowerBounds(),
        exceptions: this.getExceptions(),
        exceptionRange: this.makeExceptionRange(),
        semverishValue: this.getSemverish(),
        semveristElement: this.getSemveristElement(),
        semveristElementType: this.getSemveristElementType(),
        range: this.getRange()
      };
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
      let tmpRange;
      // take into account lowerBounds. This must be there.
      if (!this.getLowerBounds()) {
        throw new Error('Can not create a range without a lower bounds value.');
      }
      if (!this.getRange()) {
        // If we have not yet set any kind of range for this object now is
        // the time. We can construct a range from this value based
        // on our config.
        tmpRange = this.pathToRange(this.getSemverish(), this.getOptions());
      }
      else if (this.getSemveristConfig().semveristBehaviors.inheritence === 'lazySemverist') {
        // If lazy semver is turned on and we have a terminal bound.
        const finalthing = this.getExceptions() ?
          this.makeExceptionRange() : this.getTerminalBounds();

        tmpRange = this.constructor.rangeMaker(this.getLowerBounds(), '>=', finalthing, '<');
      }
      else if (this.useSemverImplied(this.getOptions())) {
        tmpRange = this.makeInheritenceRangeFromSemverish(
          this.getLowerBounds(),
          this.makeExceptionRange()
        );
      }
      else {
        // No inheritence means ranges satisfy only the lower bounds.
        tmpRange = this.getLowerBounds();
      }
      this.range = tmpRange;
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
      let highestElementTurnedToRange;
      try {
        const tmpParsed = semverUtils.parseRange(rangeValue);
        const lastItem = tmpParsed[tmpParsed.length - 1];
        highestElementTurnedToRange = semverUtils.stringifyRange([lastItem]);
        if (lastItem.operator.indexOf('<') === -1) {
          // We found less than as an operator.
          throw new Error();
        }
      }
      catch (error) {
        throw new Error('The range has no terminal value');
      }
      return highestElementTurnedToRange;
    }

    /**
     * Takes a path and returns a range based on semverist configuration.
     *
     * @param {string} path
     *   A semverish style path separated by periods.
     * @param {any} options
     */
    pathToRange(pather, options) {
      let tmpExceptions;
      // If we have exceptions let's add them to the mix.
      if (this.getExceptions()) {
        tmpExceptions = this.makeExceptionRange();
      }
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
      // If path is semverish and not semver, convert.
      const pathSemver = this.valueToSemver(pather);

      // Break the path up into its constituent parts.
      const parsed = semverUtils.parse(pathSemver);

      if (options.inheritence === null) {
        // No inheritence means things are set and only apply to
        // exact semver equivalents.
        return semver.validRange(this.valueToSemver(pather));
      }
      // Check to see if semver implied inheritence is in effect.
      if (this.useSemverImplied(options)) {
        // If have the terminal number of parts,
        // 3 for non-prelease or prerelease with a build indicated.
        // then we are talking about a specific semver version only.
        if ((pathArray.length === 3 && !_.has(parsed, 'release')) || (_.has(parsed, 'build'))) {
          return semver.validRange(this.valueToSemver(pather));
        }
        // return a range based on hierarchical inheritence.
        return this.makeInheritenceRangeFromSemverish(pather, tmpExceptions);
      }
      // Or Return a lazy semver based range.
      return this.makeLazySemveristRangeFromSemverish(
        pather,
        this.getSemveristConfig().semveristBehaviors.lazySemverist.preReleaseForwards,
        tmpExceptions
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
    makeInheritenceRangeFromSemverish(earlySemverish, exceptions) {
      const tmpSemverEarly = this.valueToSemver(earlySemverish);
      const levels = this.constructor.getSemverLevels();
      const semverishLevel = this.determineSemverishLevel(earlySemverish);
      // Tmp Range top is the inheritence based termination of this range.
      const tmpRangeTop = this.despecify(
        semver.inc(tmpSemverEarly, semverishLevel),
        levels.indexOf(semverishLevel) + 1
      );

      // Conditional sets.
      let tmpSemverLater;
      let tmpExceptions;
      if (exceptions) tmpExceptions = exceptions;
      if (this.getTerminalBounds()) tmpSemverLater = this.getTerminalBounds();

      // Prereleases cause issues because of the typical use case
      // for them and what they mean. In semver prereleases can have
      // breaking changes so we tightly scope that in range logic.
      // To do so we must run the prerelease to < patch version
      // since prerelease names are very arbitrary.
      // This will be different than the tmpRangeTop and requires
      // special handling below.
      if (_.has(this.constructor.parseSemver(tmpSemverEarly), 'release')) {
        const hierarchicalEnd = this.despecify(earlySemverish, 3);
        if (tmpSemverLater) {
          // Test to see that our laterSemverish is less than or equal to \
          // what our hierarchical inheritence would dictate.
          if (semver.satisfiesRange(hierarchicalEnd, tmpSemverLater)) {
            // If we have a prerelease we want to push up until
            // the patch version.
            throw new Error(`An inheritence based range could not be created because the ${tmpSemverLater} was not smaller than the ${hierarchicalEnd} value which satisfies inheritence.`);
          }
        }
        tmpSemverLater = hierarchicalEnd;
      }
      else if (tmpSemverLater) {
        // Otherwise, our terminal bounds has been indicated which must be
        // smaller than the normal hierarchical end (as opposed to the
        // prerelease hierarchical end above) as indicated
        // by the value in tmpRangeTop.
        if (semver.satisfiesRange(tmpRangeTop, tmpSemverLater)) {
          throw new Error(`An inheritence based range could not be created because the ${tmpSemverLater} was not smaller than the ${tmpRangeTop} value which satisfies inheritence.`);
        }
      }
      else {
        // If we've made it this far then we know that the default terminal
        // value for this inheritence is the one we want.
        tmpSemverLater = tmpRangeTop;
      }
      return this.constructor.rangeMaker(tmpSemverEarly, '>=', tmpSemverLater, '<', tmpExceptions);
    }

    /**
     * A range making utility function.
     *
     * @static
     * @param {sting} firstValue - a semverish value.
     * @param {string} firstOperator - a semver range operator string.
     * @param {string} secondValue - a semverish value.
     * @param {string} secondOperator - a semver range operator string.
     * @returns  {string} - a valid semver range string.
     */
    static rangeMaker(firstValue, firstOperator, secondValue, secondOperator, exception) {
      let tmpException = exception;
      if (!exception) tmpException = '';
      return semver.validRange(
        `${firstOperator}${firstValue} ${tmpException} ${secondOperator}${secondValue}`
      );
    }

    /**
     * Makes a lazy semverist range from a semverish value.
     *
     * @param {string} earlySemverish - a valid semver string.
     * @param {boolean} prereleaseForwards - Whether prerelease forwards
     *   should be considered.
     * @param {string} laterSemverishRange - valid semver range.
     * @param {string} exceptions - a valid semver range.
     * @returns {string} - returns a valid semverist range.
     */
    makeLazySemveristRangeFromSemverish(
      earlySemverish,
      prereleaseForwards,
      exceptions) {
      let tmpExceptions;
      let tmpSemverLater;
      let terminalSemverRange;

      const semverishLevel = this.determineSemverishLevel(earlySemverish);
      const tmpSemverEarly = this.valueToSemver(earlySemverish);
      // Figure out our lowest terminal point.

      if (exceptions) tmpExceptions = exceptions;
      if (this.getTerminalBounds()) tmpSemverLater = this.getTerminalBounds();
      // Let's start with maxiumum lazy semverist value, which
      // is our final value if exceptions and later semverish are not lower.
      const nextSemver = semver.inc(this.valueToSemver(this.despecify(tmpSemverEarly, 1)), 'major');

      // Default - will be undefined if we have no tmpSemverLater.
      terminalSemverRange = semver.validRange(`<${nextSemver}`);

      if (tmpExceptions) {
        terminalSemverRange = tmpExceptions;
        // We do have exceptions, which is a range.
        if (tmpSemverLater) {
          // We also have later semverish which is also a semver range.
          if (semver.satisfies(
            semverUtils.stringify(semverUtils.parseRange(tmpSemverLater)[0]),
            tmpExceptions)
          ) {
            // later Semverish value satisfies tmpExceptions so tmpSemverLater
            // value is lower.
            terminalSemverRange = tmpSemverLater;
          }
        }
      }
      else if (tmpSemverLater) {
        if (semver.satisfies(
          semverUtils.stringify(
            semverUtils.parseRange(
              tmpSemverLater)[0]
            ),
            terminalSemverRange
            )
          ) {
          terminalSemverRange = tmpSemverLater;
        }
      }

      let tmpRange = `>=${tmpSemverEarly}`;
      // Prereleases are a problem for lazy semverist.
      if (semverishLevel === 'prerelease' || semverishLevel === 'build') {
        // if we have prerelease forwards we need to get the
        // next patch level item.
        const nextPatchFromEarlierSemverish = this.despecify(tmpSemverEarly, 3);

        if (terminalSemverRange) {
          // This would only be true if terminal Semver range is smaller
          // than the next patch.
          if (
            semver.lt(
              semverUtils.stringify(
                semverUtils.parseRange(
                  terminalSemverRange)[0]
                ),
                nextPatchFromEarlierSemverish
              )
            ) {
            return semver.validRange(`${tmpRange} ${terminalSemverRange}`);
          }
        }
        // Being that terminalSemver Range is not lt the next patch we
        // need to account for prerelease
        tmpRange = semver.validRange(`${tmpRange} <${nextPatchFromEarlierSemverish}`);
        if (!prereleaseForwards) {
          // Without forwards we go from the prerelease guy up to the
          // next patch version.
          return tmpRange;
        }
        // If we do have prerelease forwards let's prepare temp range
        // for the next item.
        tmpRange = `${tmpRange} >= ${this.despecify(tmpSemverEarly, 3)}`;
      }

      return semver.validRange(`${tmpRange} ${terminalSemverRange}`);
    }

    /**
     * Set Exceptions for this range class.
     *
     */
    setExceptions() {
      this.exceptions = [];
    }

    /**
     * Get exceptions for this range class.
     *
     * @returns {array} - An array of exception semver strings.
     */
    getExceptions() {
      return this.exceptions;
    }

    /**
     * Add an exception semverish value to an array of similar values tracking
     *   occurences of this ranges same semverist element within the lower and
     *   upper bounds of this range according to its presribed inheritence
     *    behavior.
     *
     * @param {string} semverishValue - a semverish string.
     */
    addException(semverishValue) {
      const levels = this.constructor.getSemverLevels();
      // All exceptions must satisfy the range.

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
    makeExceptionRange() {
      if (this.getExceptions().length) {
        // We have exceptions.
        if (this.useSemverImplied()) {
          // We have a semver implied situation.
          // We won't have anything that doesn't belong.
          // We need to crawl through all values and figure out adjacencies
          // If items are adjacent which should extend the exception range.
          const adjacencies = [];
          // Our first item
          adjacencies.push({
            open: _.head(this.getExceptions()),
            close: _.head(this.getExceptions())
          });

          _.tail(this.getExceptions()).forEach((exception) => {
            if (
              this.analyzeSemverishAdjacency(
                adjacencies[adjacencies.length - 1].close,
                exception
              ).adjacent) {
              // The current close must be in adjacencies.
              adjacencies[adjacencies.length - 1].close = exception;
            }
            else {
              // Not adjacent.
              adjacencies.push(
                {
                  open: exception,
                  close: exception
                }
              );
            }
          });

          let tmpRange = '';

          adjacencies.forEach((item) => {
            if (item.open === item.close) {
              // We have no adjacent items.
              const rangePrep = semverUtils.parseRange(
                this.makeInheritenceRangeFromSemverish(item.open)
              );
              rangePrep[0].operator = '>';
              if (this.getExceptions().length === 1
                ||
                adjacencies.indexOf(item.open) !== adjacencies.length - 1) {
                rangePrep[0].operator = '<';
              }
              if (_.isArray(rangePrep) && rangePrep[1]) {
                rangePrep[1].operator = '>';
                // If there is only one exception, or we are on the last
                // item in the exceptions and the ending part of the
                // range was created through inheritence and not by
                // explicit declaration, then we need to change the
                // operator to >= and not just >.
                if (
                  this.getExceptions().length === 1
                  ||
                  ((adjacencies.indexOf(item.open) === adjacencies.length - 1)
                    && (adjacencies.indexOf(semverUtils.stringify(rangePrep[1])) === -1))) {
                  rangePrep[1].operator = '>=';
                }
              }
              tmpRange = `${tmpRange} ${semverUtils.stringifyRange(rangePrep)}`;
            }
            else {
              // We have adjacent items.
              tmpRange = `${tmpRange} ${this.constructor.rangeMaker(
                item.open, '<', item.close, '>'
              )}`;
            }
          }, this);
          return semver.validRange(tmpRange);
        }
        else if (this.getOptions().inheritence === 'lazySemverist') {
          return semver.validRange(`< ${this.getExceptions()[0]}`);
        }
      }
      return null;
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
