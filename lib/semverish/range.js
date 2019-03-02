const semverUtils = require('semver-utils');
const semver = require('semver');
const _ = require('lodash');
const Molotov = require('../molotov');

const molotovDefaults = {
  overrides: {},
  cocktailClasses: [],
};

module.exports = function rangeFactory(
  superNameSpace,
  pluginName,
  molotovConfig = molotovDefaults
) {
  // eslint-disable-line max-len
  const molotov = Molotov(molotovConfig);
  let setUp;
  if (pluginName) {
    setUp = molotov.getMolotov().resolve()[superNameSpace][pluginName]; // Ensures we get any superOverrides from config.
  } else {
    setUp = molotov
      .mixSupers()
      .getMolotov()
      .getSupers()[superNameSpace];
  }

  return Promise.resolve(setUp).then(
    extendedClass =>
      class range extends extendedClass {
        /**
         *
         *
         * @param {Object} configs
         *   Configuration object.
         * @param {Semverish} semverish
         *   An instance of the semverish class.
         * @returns {void}
         */
        init(configs, semverish) {
          if (configs !== undefined) {
            super.init(configs);
          } else {
            super.init();
          }
          if (
            this.getSemveristConfig().semveristBehaviors.inheritence !==
              'semverImplied' &&
            this.getSemveristConfig().semveristBehaviors.inheritence !== null &&
            this.getSemveristConfig().semveristBehaviors.inheritence !==
              'lazySemverist'
          ) {
            throw new Error(
              'The options inheritence attribute must one of the following values: semverImplied, null, or lazySemverist'
            );
          }
          if (semverish) {
            this.semverishHoo = semverish;
            // Set items from the passed semverish instance.
            this.setLowerBounds(semverish.getSemver());
            this.setSemverish(semverish.getSemverish());
            this.semverishArray = semverish.getSemverishArray();
            this.setSemveristElement(semverish.getSemveristElement());
            this.semveristElementType = semverish.getSemveristElementType();
            this.setOptions();
            this.setTerminalBounds(
              this.calculateImpliedTerminalBounds(this.getSemverish())
            );
            this.setSemver(semverish.getSemver());
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
         * @returns {void}
         */
        setLowerBounds(semverValue) {
          this.lowerBounds = semver.valid(semverValue);
        }

        /**
         * Calculates the implied terminal bounds for a given semverish
         *   with the inheritence style from the config provided for this
         *   instance of the range class.
         *
         * @param {string} semverishValue - The starting semverish value for
         *   this range.
         * @returns {string} - A valid semver range string.
         * @returns {void}
         */
        calculateImpliedTerminalBounds(semverishValue) {
          let calculatedTerminal;
          let tmpTerminal;
          const pathArray = this.splitStringNoEmpties(semverishValue);
          // Break the path up into its constituent parts.
          const semverishLevel = this.determineSemverishLevel(semverishValue);
          const tmpSemverEarly = this.valueToSemver(semverishValue);
          const parsed = semverUtils.parse(tmpSemverEarly);
          // Are we in lazy semver?  Carry up to next major
          if (
            this.getSemveristConfig().semveristBehaviors.inheritence ===
              'lazySemverist' &&
            this.getSemveristElementType() === 'attribute'
          ) {
            // terminal bounds is next major.
            tmpTerminal = semver.inc(
              this.valueToSemver(this.despecify(tmpSemverEarly, 1)),
              'major'
            );
            calculatedTerminal = this.constructor.validateRange(
              `<${tmpTerminal}`
            );
          } else {
            // If have the terminal number of parts,
            // 3 for non-prelease or prerelease with a build indicated.
            // then we are talking about a specific semver version only.
            if (
              (pathArray.length === 3 && !_.has(parsed, 'release')) ||
              _.has(parsed, 'build')
            ) {
              calculatedTerminal = semver.validRange(
                this.valueToSemver(semverishValue)
              );
            } else if (_.has(parsed, 'release')) {
              // Prereleases cause issues because of the typical use case
              // for them and what they mean. In semver prereleases can have
              // breaking changes so we tightly scope that in range logic.
              // To do so we must run the prerelease to < patch version
              // since prerelease names are very arbitrary.
              // However if we have a terminal, its
              // probably been set, so we should take it.
              if (this.getTerminalBounds()) {
                calculatedTerminal = this.getTerminalBounds();
              } else {
                const hierarchicalEnd = this.despecify(tmpSemverEarly, 3);
                calculatedTerminal = this.constructor.validateRange(
                  `<${hierarchicalEnd}`
                );
              }
            } else {
              tmpTerminal = this.despecify(
                semver.inc(tmpSemverEarly, semverishLevel),
                this.constructor.getSemverLevelIndex(semverishLevel) + 1
              );
              calculatedTerminal = this.constructor.validateRange(
                `<${this.valueToSemver(tmpTerminal)}`
              ); // eslint-disable-line max-len
            }
            return calculatedTerminal;
          }
          return calculatedTerminal;
        }

        /**
         * Validate a range string.
         *
         * @param {string} rangeString - A semver range string.
         * @returns {string} A valid and formatted range string.
         * @throws - Throws an error If the passed range is not valid.
         * @returns {void}
         */
        static validateRange(rangeString) {
          const validRange = semver.validRange(rangeString);
          if (validRange === null) {
            throw new Error('The passed range is not a valid semver range.');
          }
          return validRange;
        }

        /**
         * Adjusts the terminal bounds of this range.
         *
         * @param {string} semverish
         *   A semverish value.
         * @returns {void}
         */
        adjustTerminalBounds(semverish) {
          // Reset terminal bounds to this value if it is not the
          // same as the semverish
          // && if it is lower than the calculated end
          // && if it is lower than the current terminal bounds.
          if (
            (semverish !== this.getSemverish() &&
              semver.satisfies(
                this.valueToSemver(semverish),
                this.getTerminalBounds()
              ) &&
              semver.satisfies(
                this.valueToSemver(semverish),
                this.calculateImpliedTerminalBounds(this.getSemverish())
              )) ||
            (semverish !== this.getSemverish() &&
              this.getSemveristConfig().semveristBehaviors.inheritence ===
                'lazySemverist' &&
              this.getSemveristElementType() === 'attribute' &&
              this.getTerminalBounds() === this.getSemverish())
          ) {
            this.terminalBounds = this.constructor.validateRange(
              `<${this.valueToSemver(semverish)}`
            );
          }
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
         * @returns {void}
         */
        setTerminalBounds(semverValue) {
          let tmpSemver = semverValue;
          // Test for single values, as per null and terminal values.
          if (semver.valid(semverValue)) {
            tmpSemver = this.constructor.validateRange(semverValue);
          }
          tmpSemver = this.constructor.validateRange(tmpSemver);
          this.terminalBounds = tmpSemver;
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
         * @returns {void}
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
         * @returns {void}
         */
        setSemveristRange() {
          // Check to see if we need to change the lower bounds.
          this.adjustLowerBounds();
          this.setRange();
          // Check to see if we need a terminalBounds.
          this.semveristRange = {
            lowerBounds: this.getLowerBounds(),
            exceptions: this.getExceptions(),
            exceptionRange: this.makeExceptionRange(),
            adjustedExceptions: this.getAdjustedExceptions(),
            semverishValue: this.getSemverish(),
            semveristElement: this.getSemveristElement(),
            semveristElementType: this.getSemveristElementType(),
            range: this.getRange(),
            terminalBounds: this.getTerminalBounds(),
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
         * @returns {void}
         */
        setRange() {
          let tmpRange;
          // take into account lowerBounds. This must be there.
          if (!this.getLowerBounds()) {
            throw new Error(
              'Can not create a range without a lower bounds value.'
            );
          }
          if (!this.getRange()) {
            // If we have not yet set any kind of range for this object now is
            // the time. We can construct a range from this value based
            // on our config.
            tmpRange = this.pathToRange(
              this.getSemverish(),
              this.getOptions(),
              this.getLowerBounds()
            );
          } else if (
            this.getSemveristConfig().semveristBehaviors.inheritence ===
              'lazySemverist' &&
            this.getSemveristElementType() === 'attribute'
          ) {
            tmpRange = this.makeLazySemveristRangeFromSemverish(
              this.getLowerBounds(),
              this.getSemveristConfig().semveristBehaviors.lazySemverist
                .preReleaseForwards,
              this.makeExceptionRange(),
              true
            );
          } else if (this.useSemverImplied(this.getOptions())) {
            tmpRange = this.makeInheritenceRangeFromSemverish(
              this.getSemverish(),
              this.makeExceptionRange(),
              this.getLowerBounds()
            );
          } else {
            // No inheritence means ranges satisfy only the lower bounds.
            tmpRange = this.getRange();
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
         * Takes a path and returns a range based on semverist configuration.
         *
         * @param {string} pather
         *   A semverish style path separated by periods.
         * @param {any} options
         *   Options for use with this path to range.
         * @returns {string}
         *   A semver range.
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
            // A path must have atleast one component to it.
            throw new Error(
              'The path must have atleast a single major component.'
            );
          }

          // If path is semverish and not semver, convert.
          const pathSemver = this.valueToSemver(pather);

          // Break the path up into its constituent parts.
          const parsed = semverUtils.parse(pathSemver);

          if (options.inheritence === null) {
            // No inheritence means things are set and only apply to
            // exact semver equivalents.
            let tmpSemver = this.valueToSemver(pather);
            if (semver.parse(tmpSemver).prerelease.length === 1) {
              tmpSemver = this.valueToSemver(`${tmpSemver}.0`);
            }
            return semver.validRange(tmpSemver);
          }
          // Check to see if semver implied inheritence is in effect.
          if (this.useSemverImplied(options)) {
            // If have the terminal number of parts,
            // 3 for non-prelease or prerelease with a build indicated.
            // then we are talking about a specific semver version only.
            if (
              (pathArray.length === 3 && !_.has(parsed, 'release')) ||
              _.has(parsed, 'build')
            ) {
              return semver.validRange(this.valueToSemver(pather));
            }
            // return a range based on hierarchical inheritence.
            return this.makeInheritenceRangeFromSemverish(
              pather,
              tmpExceptions,
              this.getLowerBounds()
            );
          }
          // Or Return a lazy semver based range.
          return this.makeLazySemveristRangeFromSemverish(
            pather,
            this.getSemveristConfig().semveristBehaviors.lazySemverist
              .preReleaseForwards,
            tmpExceptions,
            true
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
            tmpOptions.attribute = this.getSemveristElementType();
          }

          if (tmpOptions.inheritence !== null) {
            return (
              tmpOptions.inheritence === 'semverImplied' ||
              tmpOptions.attributeType === 'semveristObject' ||
              (tmpOptions.inheritence === 'lazySemverist' &&
                tmpOptions.attributeType !== 'attribute')
            );
          }
          return null;
        }

        /**
         * Creates a range with hierarchical inheritence for a semverish value.
         *
         * @param {string} earlySemverish
         *   A semverish value.
         * @param {string} exceptions
         *    An exceptions string.
         * @param {string} lowerBounds
         *    An a lowerBounds string.
         * @returns {string}
         *    a semver range.
         */
        makeInheritenceRangeFromSemverish(
          earlySemverish,
          exceptions,
          lowerBounds
        ) {
          let tmpSemverEarly = this.valueToSemver(earlySemverish);
          if (lowerBounds) tmpSemverEarly = lowerBounds;
          // Tmp Range top is the inheritence based termination of this range.
          const tmpRangeTop = this.calculateImpliedTerminalBounds(
            earlySemverish
          );
          const parsed = semverUtils.parse(earlySemverish);

          const pathArray = this.splitStringNoEmpties(earlySemverish);
          if (
            (pathArray.length === 3 && !_.has(parsed, 'release')) ||
            _.has(parsed, 'build')
          ) {
            return semver.validRange(this.valueToSemver(earlySemverish));
          }
          // Conditional sets.
          let tmpSemverLater;
          let tmpExceptions;
          if (exceptions) tmpExceptions = exceptions;

          // Prereleases cause issues because of the typical use case
          // for them and what they mean. In semver prereleases can have
          // breaking changes so we tightly scope that in range logic.
          // To do so we must run the prerelease to < patch version
          // since prerelease names are very arbitrary. BUT - we if
          // we have already set terminal bounds we should keep that.
          // This will be different than the tmpRangeTop and requires
          // special handling below.
          if (
            _.has(this.constructor.parseSemver(tmpSemverEarly), 'release') &&
            !this.getTerminalBounds()
          ) {
            const hierarchicalEnd = this.despecify(earlySemverish, 3);
            tmpSemverLater = `<${this.valueToSemver(hierarchicalEnd)}`;
          } else {
            // If we've made it this far then we know that the default terminal
            // value for this inheritence is the one we want.
            tmpSemverLater = tmpRangeTop;
          }
          return this.constructor.rangeMaker(
            tmpSemverEarly,
            '>=',
            tmpSemverLater,
            '<',
            tmpExceptions
          );
        }

        /**
         * A range making utility function.
         *
         * @static
         * @param {sting} firstValue - a semverish value.
         * @param {string} firstOperator - a semver range operator string.
         * @param {string} secondValue - a semverish value.
         * @param {string} secondOperator - a semver range operator string.
         * @param {string} exception - an exception value.
         * @returns  {string} - a valid semver range string.
         */
        static rangeMaker(
          firstValue,
          firstOperator,
          secondValue,
          secondOperator,
          exception
        ) {
          let tmpException = exception;
          let secondItem = `${secondOperator}${secondValue}`;
          if (!semver.validRange(secondItem)) {
            secondItem = secondValue;
          }
          if (!exception) tmpException = '';
          return semver.validRange(
            `${firstOperator}${firstValue} ${tmpException} ${secondItem}`
          );
        }

        /**
         * Makes a lazy semverist range from a semverish value.
         *
         * @param {string} earlySemverish - a valid semver string.
         * @param {boolean} prereleaseForwards - Whether prerelease forwards
         *   should be considered.
         * @param {string} exceptions - a valid semver range.
         * @returns {string} - returns a valid semverist range.
         */
        makeLazySemveristRangeFromSemverish(
          earlySemverish,
          prereleaseForwards,
          exceptions
        ) {
          let tmpExceptions;
          let tmpSemverLater;
          let terminalSemverRange;

          const semverishLevel = this.determineSemverishLevel(earlySemverish);
          const tmpSemverEarly = this.valueToSemver(earlySemverish);
          // Figure out our lowest terminal point.

          if (exceptions) tmpExceptions = exceptions;
          if (this.getTerminalBounds())
            tmpSemverLater = this.getTerminalBounds();
          // Let's start with maxiumum lazy semverist value, which
          // is our final value if exceptions and later semverish are not lower.
          const nextSemver = semver.inc(
            this.valueToSemver(this.despecify(tmpSemverEarly, 1)),
            'major'
          );

          // Default - will be undefined if we have no tmpSemverLater.
          terminalSemverRange = semver.validRange(`<${nextSemver}`);

          if (tmpExceptions) {
            // We do have exceptions, which is a range.
            terminalSemverRange = tmpExceptions;
          } else if (tmpSemverLater) {
            if (
              semver.satisfies(
                semverUtils.stringify(
                  semverUtils.parseRange(tmpSemverLater)[0]
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
            const nextPatchFromEarlierSemverish = this.despecify(
              tmpSemverEarly,
              3
            );
            // Being that terminalSemver Range is not lt the next patch we
            // need to account for prerelease
            tmpRange = semver.validRange(
              `${tmpRange} <${nextPatchFromEarlierSemverish}`
            );
            if (!prereleaseForwards) {
              // Without forwards we go from the prerelease guy up to the
              // next patch version.
              this.terminalBounds = `<${nextPatchFromEarlierSemverish}`;
              return tmpRange;
            }
            // If we do have prerelease forwards let's prepare temp range
            // for the next item.
            tmpRange = `${tmpRange} >= ${this.despecify(tmpSemverEarly, 3)}`;
          }
          return semver.validRange(`${tmpRange} ${terminalSemverRange}`);
        }
        /**
         * Adjusts the lower bounds of this range based on the analysis
         *   of a passed semverish value.
         *
         * @param {string} semverish
         *   A semverish value.
         * @returns {void}
         */
        adjustLowerBounds(semverish) {
          let tmpSemverish = semverish;
          const exceptions = this.getAdjustedExceptions();
          if (!semverish) {
            tmpSemverish = this.getSemverish();
          }
          // Check lower bounds against exceptions.
          // Get Lower Bounds check against exceptions.
          const childMakesForAdjustment = _.find(exceptions, value => {
            const tmpAnalysis = this.analyzeSemverishAdjacency(
              tmpSemverish,
              value
            );
            // If any of the exceptions are children and equal or adjacent
            // to the start of this range
            // We will need to bump up the lowerBounds.
            return tmpAnalysis.equal || tmpAnalysis.adjacent;
          });
          if (childMakesForAdjustment) {
            // Set new lowerbounds.
            // Get semverish getSemverL
            const semverishLevel = this.determineSemverishLevel(
              childMakesForAdjustment
            );
            // Tmp Range top is the inheritence based termination of this range.
            const newLowerSemverish = this.despecify(
              semver.inc(
                this.valueToSemver(childMakesForAdjustment),
                semverishLevel
              ),
              this.constructor.getSemverLevelIndex(semverishLevel) + 1
            );
            this.setLowerBounds(this.valueToSemver(newLowerSemverish));
            // Add an adjustment to exceptions
            this.addAdjustedException(childMakesForAdjustment);
            // Also call this method again and keep doing it until we do not
            // have an equal child or adjacent exception.
            this.adjustLowerBounds(newLowerSemverish);
          }
        }
        /**
         *  Adds an exception to the adjustedExceptions array.
         *
         * @param {string} exception
         *   A semver value.
         * @returns {void}
         */
        addAdjustedException(exception) {
          this.adjustedExceptions.push(exception);
        }

        /**
         *  Gets the adjusted exceptions array after its been sorted.
         *
         * @returns {array}
         *   A sorted semverish array.
         */
        getAdjustedExceptions() {
          if (this.adjustedExceptions === undefined) {
            this.adjustedExceptions = [];
          }
          // Give us this.exceptions minus this.adjustedExceptions.
          return this.sortSemverishArray(
            _.difference(this.getExceptions(), this.adjustedExceptions)
          );
        }

        /**
         * Set Exceptions for this range class.
         * @returns {void}
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
         * @returns {boolean}
         *   Returns true after the process completes..
         */
        addException(semverishValue) {
          // Depending on our inheritence scheme and what semverish
          // Element we have.
          if (
            this.getOptions().inheritence === null ||
            this.getOptions().inheritence === undefined
          ) {
            // early return.
            return false;
          } else if (
            this.getOptions().inheritence !== null &&
            this.getOptions().inheritence !== undefined &&
            this.getExceptions().length === 0
          ) {
            this.exceptions.push(semverishValue);
          } else if (this.useSemverImplied()) {
            let childOfSomeone = false;
            // Semver Implied - add exceptions if the value is not a child of
            // an existing value.
            // Is the new value a child of any existing values.
            this.getExceptions().forEach(element => {
              const test = this.analyzeSemverishAdjacency(
                element,
                semverishValue
              );
              if (test.child) {
                childOfSomeone = true;
              }
            }, this);
            if (!childOfSomeone) {
              const cleanUpItems = [];
              // It was not a child value. We will add it. But first let's see if
              // we should rip out any values
              // because they are children of this value.
              this.getExceptions().forEach(element => {
                const test = this.analyzeSemverishAdjacency(
                  semverishValue,
                  element
                );
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
          } else if (
            semver.lte(
              this.valueToSemver(semverishValue),
              this.valueToSemver(this.getExceptions()[0])
            ) &&
            this.constructor.getSemverLevelIndex(
              this.determineSemverishLevel(semverishValue)
            ) <=
              this.constructor.getSemverLevelIndex(
                this.determineSemverishLevel(this.getExceptions()[0])
              ) // eslint-disable-line max-len
          ) {
            // Lazy Semverist. - Only add if this is lower than the
            // current exception
            this.exceptions = [semverishValue];
          }
          return true;
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
         * @returns {string | null}
         *   Returns a valid semver range or null.
         */
        makeExceptionRange() {
          if (this.getAdjustedExceptions().length) {
            // We have exceptions.
            if (this.useSemverImplied()) {
              // We have a semver implied situation.
              // We won't have anything in the exceptions that doesn't belong.
              // exceptions are validated as they come in. Knowing that,
              // we need to crawl through all values and figure out adjacencies.
              // If items are adjacent which should extend the exception range.
              const adjacencies = this.createAdjacencyArray(
                this.getAdjustedExceptions()
              );

              // We'll be constructing our range in this variable.
              let tmpRange = '';

              adjacencies.forEach(item => {
                if (item.open === item.close) {
                  // We have no adjacencies for this item.
                  const rangePrep = semverUtils.parseRange(
                    this.makeInheritenceRangeFromSemverish(item.open)
                  ); // eslint-disable-line max-len
                  rangePrep[0].operator = '>=';
                  if (
                    this.getExceptions().length === 1 ||
                    adjacencies[adjacencies.length - 1].open !== item.open
                  ) {
                    rangePrep[0].operator = '<';
                  }
                  if (_.isArray(rangePrep) && rangePrep[1]) {
                    // If there is only one exception, or we are on the last
                    // item in the exceptions and the ending part of the
                    // range was created through inheritence and not by
                    // explicit declaration, then we need to change the
                    // operator to >= and not just >.
                    rangePrep[1].operator = '>=';
                  }
                  if (
                    _.isArray(rangePrep) &&
                    rangePrep[0] &&
                    adjacencies[adjacencies.length - 1].open === item.open
                  ) {
                    // last item - test for finality.
                    if (
                      this.testFinalItemAgainstRangeSemverish(
                        this.getSemverish(),
                        item.open
                      )
                    ) {
                      rangePrep[0].operator = '<';
                      rangePrep.push(
                        semverUtils.parse(
                          semver.inc(
                            this.valueToSemver(
                              semverUtils.stringify(rangePrep[0])
                            ),
                            'patch'
                          )
                        )
                      );
                      rangePrep[1].operator = '>=';
                    }
                  }
                  tmpRange = `${tmpRange} ${semverUtils.stringifyRange(
                    rangePrep
                  )}`;
                } else {
                  // We have adjacent items.
                  tmpRange = `${tmpRange} ${this.constructor.rangeMaker(
                    item.open,
                    '<',
                    item.close,
                    '>'
                  )}`; // eslint-disable-line max-len
                }
              }, this);
              return semver.validRange(tmpRange);
            }
            // Or we have a lazy semverist.
            return semver.validRange(`< ${this.getExceptions()[0]}`);
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

        /**
         * Creates an array of adjacencies. Analyzes the passed exceptions
         *   to determine if the ending or close of one item abutts the next
         *   item which is useful in determining whether to end or extend
         *   a range's ending bounds.
         *
         * @param {array} exceptions
         *   An exceptions array.
         * @returns {array} - An array of adjacency objects with an open
         *   and closing semverish range.
         */
        createAdjacencyArray(exceptions) {
          const adjacencies = [];
          // We need to supply one item to compare to all following items.
          adjacencies.push({
            open: _.head(exceptions),
            close: _.head(exceptions),
          });

          // With the hopper we loaded we can compare adjacencies of items
          // starting against our very first item (this the tail - meaning
          // we are skipping it, no reason to compare to itself)
          // which we've pushed into the adjacencies array.
          _.tail(exceptions).forEach(exception => {
            // We will analyze each item to determine if the closing
            // of the previous item (which can be incremented by
            // other adjacencies) is adjacent to the current exception.
            if (
              this.analyzeSemverishAdjacency(
                adjacencies[adjacencies.length - 1].close,
                exception
              ).adjacent
            ) {
              // this is adjacent and so we will update last adjacency
              // with this exception value.
              adjacencies[adjacencies.length - 1].close = exception;
            } else {
              // Not adjacent so we will add a new value to the adjacencies.
              // and move on to examine the next item's adjacency to this one.
              adjacencies.push({
                open: exception,
                close: exception,
              });
            }
          });
          return adjacencies;
        }

        /**
         * Tests to see if an item in a range should be treated as a
         *   ending bound in lazy semverist and needs a projected
         *   terminal semver value.  This can be useful at the end
         *   of a lazy semverist structure as ranges can be valid
         *   until the next major.
         * @param {string} semverish - a sevmerish value string.
         * @param {string} itemSemverish - a semverish value string.
         * @returns {boolean} - whether this should be treated as a
         *   final item.
         */
        testFinalItemAgainstRangeSemverish(semverish, itemSemverish) {
          let treatAsFinal = false;
          const semverishLevel = this.determineSemverishLevel(semverish);
          if (
            (semverishLevel === 'major' ||
              semverishLevel === 'minor' ||
              semverishLevel === 'patch') &&
            this.determineSemverishLevel(itemSemverish) === 'patch'
          ) {
            treatAsFinal = true;
          }
          return treatAsFinal;
        }
      }
  );
};
