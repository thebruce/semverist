

const _ = require('lodash');
const Molotov = require('../molotov');
const semver = require('semver');
const semverishFactory = require('../semverish/semverish');
const rangeFactory = require('../semverish/range');

const molotovDefaults = {
  overrides: {},
  cocktailClasses: [],
};

module.exports = function converterFactory(superNameSpace, pluginName, molotovConfig = molotovDefaults) { // eslint-disable-line max-len
  const molotov = Molotov(molotovConfig);
  let setUp;
  if (pluginName) {
    setUp = molotov.getMolotov().resolve()[superNameSpace][pluginName]; // Ensures we get any superOverrides from config.
  }
  else {
    setUp = molotov.mixSupers().getMolotov().getSupers()[superNameSpace];
  }

  return Promise.resolve(setUp).then(extendedClass => class converter extends extendedClass {
    /**
       * Init function for converter super class.
       *   Sets the converter object up based on semverishObject
       *   and either default or provided configs.
       *
       * @param {Object} semverishObject - A semverish Object.
       * @param {Object} configs - Overrides for default configuration
       *   or the config provided by the config module.
       * @returns {void}
       */
    init(semverishObject, configs) {
      if (configs !== undefined) {
        // Pass the init configs on to the super.
        super.init(configs);
      }
      else {
        super.init();
      }
      this.setConverter({
        semverRealizations: [],
        default: {},
        group: {},
        attribute: {},
      });
      this.setSemverishObject(semverishObject);
      this.setSemveristClasses();
    }

    /**
       *   Converter objects
       *   are a set of assembly
       *   instructions based on:
       *     1) The contents of the source semverist object.
       *     2) The inheritence type of the semverist config.
       *     3) The lazy semver settings in semverist config.
       *   These instructions store information on how a semverist element
       *   should be
       *   represented in semver through structured inheritence of attributes
       *   (groups/default/attributes) in semver leavesxs
       *   and the order of those elements.
       *
       * @typedef {Object} converterObject - An object that transforms a
       *   semverish Object into a proto inspector object, a much simpler
       *   helper object which can be used to create the inspector Object.
       * @property {Array} semverRealizations - An array of semver value strings
       *   that include all specifically declared semver values within the
       *   hierarchy of the semver object as well as those implied but not
       *   specifically stated such as major or minor hierarchies with no
       *   minor or patch declared respectively.
       * @property {Object} default -
       * @property {converterItem} default.defaultInstance -
       * @property {Object} group -
       * @property {...converterItem} group.groupInstance -
       * @property {Object} attribute -
       * @property {...converterIten} attribute.attributeInstance -
       */

    /**
       *   Converter item
       *
       * @typedef {Object} converterItem - An object containing range
       *   keyed objects with details about the instances of this
       *   semverist element.
       * @property {semverRangeItem} converterItem.semverRangeItem - An object
       *   keyed by a semver range. A semver value can be tested against the
       *   range and will only be satisfied
       *   by a single semverRangeItem for a particular semverist element.
       * @property {Object} semverRangeItem.range - A valid semver range
       *   representing the range of semver values to which this element
       *   applies.
       * @property {String} semverRangeItem.lowerBounds - A valid semver
       *   string that indicates the lowest possible value for this semver
       *   range. This is extracted from the conversion (if needed) of the
       *   semverish value associated to this string
       *   to a valid semver string.
       * @property {Object} semverRangeItem.upperBounds -
       * @property {string} semverRangeItem.semveristElement - A semverist
       *   element name that may be the semverist default value, a group name,
       *   or an attribute name.
       * @property {strung} semverRangeItem.semverishValue - A semverish string
       *   value for this semverist element that relates to the position in the
       *   semverist hierarchy that we are tracking for this semverist Range.
       * @property {Object} semverRangeItem.childrenSemverish - An array of
       *   semverish values that are children of this semverish instance range
       *   string, that share this semverist element amd occur within the range
       *   implied by this semverishValue and the inheritence declared for this
       *   semverist Object. Thus the child semverish must be considered when
       *   resolving the range string of this semverist element whether it
       *   observes inheritence or lazy semverist inheritence strategies.
       */

    /**
       *   Semver Range item within a converter Item.
       *
       * @typedef {Object} semverRangeItem - An object keyed by a semver
       *   range. A semver value can be tested against the range and
       *   will only be satisfied by a single semverRangeItem for a
       *   particular semverist element.
       * @property {Object} semverRangeItem.range - A valid semver range
       *   representing the range of semver values to which this
       *   element applies.
       * @property {String} semverRangeItem.lowerBounds - A valid semver
       *   string that indicates the lowest possible value for this semver
       *   range. This is extracted from the conversion (if needed) of the
       *   semverish value associated to this string
       *   to a valid semver string.
       * @property {Object} semverRangeItem.upperBounds -
       * @property {string} semverRangeItem.semveristElement - A semverist
       *   element name that may be the semverist default value, a group
       *   name, or an attribute name.
       * @property {strung} semverRangeItem.semverishValue - A semverish
       *   string value for this semverist element that relates to the
       *   position in the semverist hierarchy that we are tracking
       *   for this semverist Range.
       * @property {Object} semverRangeItem.childrenSemverish - An array of
       *   semverish values that are children of this semverish instance
       *   range string, that share this semverist element amd occur
       *   within the range implied by this semverishValue and the
       *   inheritence declared for this semverist Object. Thus the
       *   child semverish must be considered when resolving the range
       *   string of this semverist element whether it observes inheritence
       *   or lazy semverist inheritence strategies.
       */


    /**
       * setConverter.
       *   Set the converter object to the passed value. Converter objects
       *   are a set of assembly
       *   instructions based on:
       *     1) The contents of the source semverist object.
       *     2) The inheritence type of the semverist config.
       *     3) The lazy semver settings in semverist config.
       *   These instructions store information on how an attribute should be
       *   represented in semver through structured inheritence of attributes
       *   (groups/defaults/attributes) in semver leavesxs
       *   and the order of those elements.
       * @param {converter} converterObject
       *   A converter object.
       *
       * @returns {void}
       */
    setConverter(converterObject) {
      this.converter = converterObject;
    }

    /**
       * Gets the converter object for the related semverish Object.
       *
       * @returns {converter}
       *   Returns the converter with refreshed semverRealizations.
       */
    getConverter() {
      this.converter.semverRealizations = this.getSemverRealizations();
      return this.converter;
    }

    /**
       * Sets semverist classes for this object. A semverist Class is
       *   defined here {@link semveristClasses}.
       * @returns {void}
       */
    setSemveristClasses() {
      this.semveristClasses = {
        default: {},
        group: {},
        attribute: {},
      };
    }

    /**
       * An object that groups semverist elements by type, by name, by range
       *   and contains instances of semverish and range classes for that
       *   specific element.
       *
       * @typedef {Object} semveristClasses - An object that groups semverist
       *   element by semverist element type, semverist instance, semver value
       *   and two operable semverish and range classes for that value.
       * @property {Object} default - An object holding details about defaults
       *   for the semverish object that the semverist classes relate.
       * @property {semveristClassInstance} default.instanceName - A semverist
       *   class instance holding semver value instances of the default for
       *   the semverish object to which these classes relate
       *   {@link semveristClassInstance}.
       * @property {Object} group - An object holding details about groups for
       *   the semverish object and their semverist classes.
       * @property {...semveristClassInstance} group.instanceName - A
       *   semverist class instance holding semver value instances of a
       *   particular group name {@link semveristClassInstance}.
       * @property {Object} attribute - An object holding details about
       *   attributes within the semverish object.
       * @property {...semveristClassInstance} attribute.instanceName - A
       *   semverist class instance holding semver values for a particular
       *   attribute from the semverish object {@link semveristClassInstance}.
       */

    /**
       * An object that groups semverist elements by type, by name, by range
       *   and contains instances of semverish and range classes for that
       *   specific element.
       *
       * @typedef {Object} semveristClassInstance - An instance of a semverist
       *   element (an attribute | group | default) which holds semverValues
       *   that relate to the hierarchical location where an instance of this
       *   particular instance appeared. This can happen multiple times in the
       *   hierarchy but only once at any one semverish value.
       * @property {...classSemverishValue} semveristClassInstance.semverValue
       *   - An object keyeed by the semverish value relating to the
       *   hierarchical location of an item in the semver hierarchy.
       *   This object will contain semverish and range classes for the
       *   element at this semverish value. {@link classSemverishValue}.
       */

    /**
       * An object that groups semverist elements by type, by name, by range
       *   and contains instances of semverish and range classes for that
       *   specific element.
       *
       * @typedef {Object} classSemverishValue - An object that is keyed
       *   by a semver value relating to where this semverist element occured
       *   in the semverish object.
       * @property {Object} classSemverValue.semverish - An instance of the
       *   semverish class for this semverist element and semverish value.
       * @property {Object} classSemverValue.range - An instance of the
       *   semverish range class for this semverist element and semverish
       *   value.
       */

    /**
       * Returns semverist classes for this converter.
       *
       * @returns {semveristClasses} - {@link semveristClasses}
       */
    getSemveristClasses() {
      return this.semveristClasses;
    }

    /**
       * Adds a semverist class item to this converters semveristClass Object.
       *  {@link semveristClasses}.  Creates new objects for elements in the
       *  path if they do not exist.
       *
       * @param {string} elementType - A semverist element type
       *   (group | attribute | default).
       * @param {string} elementName - The name of the semverist Element.
       * @param {string} semverishValue - A semverish value string.
       * @param {string} classType - One of two helper classes
       *   semverish or range
       * @param {Object} classItem - A semverish or range class.
       * @returns {void}
       */
    addSemveristClassItem(elementType, elementName, semverishValue, classType, classItem) {
      // Note: Not using _.set because of the dot separated values
      // in semverish value.
      if (!Object.prototype.hasOwnProperty.call(this.semveristClasses, elementType)) {
        this.semveristClasses[elementType] = {};
      }
      if (!Object.prototype.hasOwnProperty.call(
        this.semveristClasses[elementType],
        elementName
      )) {
        this.semveristClasses[elementType][elementName] = {};
      }
      if (!Object.prototype.hasOwnProperty.call(
        this.semveristClasses[elementType][elementName],
        semverishValue
      )) {
        this.semveristClasses[elementType][elementName][semverishValue] = {};
      }
      this.semveristClasses[elementType][elementName][semverishValue][classType] =
          _.cloneDeep(classItem);
    }

    /**
       * Sets the semverish Object for this converter.
       *
       * @param {Object} semverishObject
       *   A semverish Object for this semverist.
       * @returns {void}
       */
    setSemverishObject(semverishObject) {
      this.semverishObject = semverishObject;
      if (super.setSemverishObject) super.setSemverishObject(semverishObject);
    }

    /**
       * Returns this converters semverish Object.
       *
       * @returns {Object} semverishObject
       */
    getSemverishObject() {
      return this.semverishObject;
    }

    /**
       * Initializes a semverish class from the semverish factory for a given
       *   semver value.
       *
       * @param {Object} semverish - An instance of the semverish
       *   class from the factory.
       * @param {any} levelPrep A semverish Path.
       * @param {any} key - An element or semverish place.
       * @returns {Object} - An initialized semverish class for a given
       *   semver level.
       */
    instantiateSemverish(semverish, levelPrep, key) {
      const configs = this.getSemveristConfig();

      // Run through semverish.
      semverish.init(`${levelPrep}${key}`, configs);
      // Realize it for the converter object.
      if (semverish.getSemverParsed().release) {
        // If this is a prerelease path for the moment we'll require
        // it to have a suffix. Though we should change this to be more
        // configurable.
        if (this.splitStringNoEmpties(semverish.getSemverParsed().release).length === 1) {
          this.addSemverRealizations(`${semverish.getSemver()}.0`);
        }
        else {
          this.addSemverRealizations(semverish.getSemver());
        }
      }
      else {
        // If this is not a prerelease path add semver realization.
        this.addSemverRealizations(semverish.getSemver());
      }
      return semverish;
    }

    /**
       * Initializes an instance of the range class from the factory
       *   for a given semverish Object and configs.
       *
       * @param {Object} range - An instance of the range class.
       * @param {Object} semverish - A semverish class for this range.
       * @returns {Object} - An initialized range class.
       */
    instantiateRange(range, semverish) {
      const configs = this.getSemveristConfig();
      range.init(configs, semverish);
      range.setSemveristRange();
      return range;
    }

    /**
       * A recursive promise bearing function used to traverse and record
       *   the semverist elements into the concerter's semverist classes
       *   within a semverish hierarchical object. If a semverish Object
       *   is encoutered the function calls itself with that new semverish
       *   Object path in order to explore and
       *   traverse.
       *
       * @param {any} level - A string of a full path within a semverish
       *   Object.
       *
       * @returns {Promise.<semveristClasses|Error>} - A promise bearing
       *   semveristClasses or an error.
       */
    semveristAssemble(level) {
      let semveristAtLevel;
      let levelPrep = '';
      const promises = [];
      // If the level is root, we are begining at the very top level
      // of a semverish object.
      if (level === 'root') {
        semveristAtLevel = Object.keys(this.getSemverishObject());
      }
      else {
        // Otherwise the level (path at this level) has been passed
        // via a recursive call.
        semveristAtLevel = Object.keys(_.get(this.getSemverishObject(), level));
        levelPrep = `${level}.`;
      }

      // Now we have an object with any keys below our current level.
      semveristAtLevel.forEach((key) => {
        // We will create semverish and range classes for any keys within.
        // This is useful even if the key in question is not a semverish
        // element for the interface that these two classes provide to that
        // value.
        const semverishClass = semverishFactory('semverist', 'semverish', molotovConfig)
          .then(SemverishClass => new SemverishClass());
        const rangeClass = rangeFactory('semverist', 'range', molotovConfig)
          .then(RangeClass => new RangeClass());

          // Promise both factories.
        const semveristClass = Promise.all([semverishClass, rangeClass])
          .then((semveristClassArray) => {
            // Both factories are ready to produce full fledged classes
            // for this key.
            const semverish = this.instantiateSemverish(semveristClassArray[0], levelPrep, key);
            const range = this.instantiateRange(semveristClassArray[1], _.cloneDeep(semverish));
            // If we don't have an element wee know that we are in a semverish
            // value only.
            if (!semverish.getSemveristElement()) {
              // This is a directory and does not have an element
              // associated with it. Recursively call for semverist Assemble
              // to dig down into this
              // semverish level.
              return this.semveristAssemble(`${levelPrep}${key}`);
            }
            // At this point we do have a semverist element so this is
            // an instance of a group, default or attribute. Add this
            // instances semverish and range classes.
            this.addSemveristClassItem(
              semverish.getSemveristElementType(),
              semverish.getSemveristElement(),
              semverish.getSemverish(),
              'semverish',
              semverish
            );
            this.addSemveristClassItem(
              semverish.getSemveristElementType(),
              semverish.getSemveristElement(),
              semverish.getSemverish(),
              'range',
              range
            );
            return this.getSemveristClasses();
          });
        promises.push(semveristClass, this);
      }, this);

      return Promise.all(promises)
        .then(() => this.getSemveristClasses());
    }

    /**
       * Creates a converter object by assembling classes
       *   from the semverishObject and the translating those classes
       *   into a converter object proper.
       *
       * @returns {Promise.<converter|Error>} - A promise bearing converter
       *   or error.
       */
    createConverter() {
      return this.semveristAssemble('root')
        .then(() => this.toConverter());
    }

    /**
       * A helper function to translates semveristClasses to a converter object.
       *
       * @returns {converter} - A converter Object for this semverish
       *   Object.
       */
    toConverter() {
      // Get semverist classes.
      const tmpClasses = _.cloneDeep(this.getSemveristClasses());
      // For each semverist Element type in the classes.
      Object.keys(tmpClasses).forEach((typeKey) => {
        Object.keys(tmpClasses[typeKey]).forEach((elementKey) => {
          // Create an object for each of these element names within the
          // converter Object. Dig further to semverish keys.
          let semverishKeys = Object.keys(tmpClasses[typeKey][elementKey]);
          // Sort these keys in semverish order.
          semverishKeys = this.sortSemverishArray(semverishKeys);

          // For lazy semverist attributes any semver synonyms i.e.
          // 1, 1.0, 1.0.0 are subject to replacement entirely by more
          // specific version. Thus 1 and 1.0 would be replaced by 1.0.0
          // and 1 by 1.0 and so forth.
          if (this.getSemveristConfig().semveristBehaviors.inheritence === 'lazySemverist'
              && typeKey === 'attribute') {
            // Group up all synonyms keyed by their realized semver.
            const groupedBy = _.groupBy(semverishKeys, this.valueToSemver);
            const finalists = [];
            // Now sort the grouped values by length and get the
            // most specific one.
            _.forEach(groupedBy, (value) => {
              // Add the most specific one to the array we will replace
              // the original keys with.
              finalists.push(_.sortBy(value, item => item.length).pop());
            });
            semverishKeys = this.sortSemverishArray(finalists);
          }

          // Now turn them into range Objects for the converter.
          semverishKeys.forEach((semverishKey, index, collection) => {
            // get the Range object at each of these keys.
            const { range } = tmpClasses[typeKey][elementKey][semverishKey];
            // Now we need to see if this semverishKey has any children.
            const collectionHigherThanThis = _.slice(collection, index + 1);
            const children = _.filter(
              collectionHigherThanThis,
              thing => this.analyzeSemverishAdjacency(semverishKey, thing).child === true
            );

              // Determine how many siblings we have for each item.
              // They are in order. We need to add these to the range
              // as exceptions.
            this.sortSemverishArray(children).forEach((semverishException) => {
              range.addException(semverishException);
            }, this);
            // If we are in a supported lazy semver item. We should
            // consider adding the neighbor as the terminal bound.
            if ((this.getSemveristConfig().semveristBehaviors.inheritence === 'lazySemverist')
              && typeKey === 'attribute') {
              if (collection.length > index + 1) {
                range.adjustTerminalBounds(tmpClasses[typeKey][elementKey][collection[index + 1]].range.getSemverish()); // eslint-disable-line max-len
              }
            }
            else if (
              (this.getSemveristConfig().semveristBehaviors.inheritence === 'semverImplied')
                && semver.parse(this.valueToSemver(semverishKey)).prerelease.length > 0) {
              const adjacent = _.filter(
                collectionHigherThanThis,
                thing => this.analyzeSemverishAdjacency(semverishKey, thing).adjacent === true
              );

              let tmpAdjacent = false;
              if (adjacent.length) {
                range.setTerminalBounds(this.sortSemverishArray(adjacent)[0]);
                tmpAdjacent = true;
              }

              if (!tmpAdjacent) {
                // We had nothing adjacent with this element but we need
                // to check for finality.
                // filter for any prereleases that share the same
                // major.minor.patch but also remove the current value
                // from those relatives.
                const parsed = semver.parse(this.valueToSemver(semverishKey));
                const currentName = parsed.prerelease[0];
                const majMinPatch = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
                const preReleaseRelatives = _.without(_.filter(semverishKeys, (key) => {
                  const newParsed = semver.parse(this.valueToSemver(key));
                  return (newParsed.prerelease.length > 0)
                      &&
                      (`${newParsed.major}.${newParsed.minor}.${newParsed.patch}` === majMinPatch);
                }), semverishKey);

                  // If we have any relatives, look for a higher alpha.
                if (preReleaseRelatives.length > 0) {
                  // is there a higher release name?
                  const preReleaseNames = [currentName];
                  preReleaseRelatives.forEach((item) => {
                    preReleaseNames.push(semver.parse(item).prerelease[0]);
                  });
                  const uniqueArray = _.uniq(preReleaseNames);
                  if (uniqueArray.length > 1) {
                    // There are more than one name.
                    const currentPos = _.indexOf(uniqueArray.sort(), currentName);
                    if (currentPos + 1 < uniqueArray.length) {
                      // We aren't the last gang in town.
                      // Get new terminal bounds.
                      range.setTerminalBounds(`<${majMinPatch}-${uniqueArray[currentPos + 1]}.0`);
                    }
                  }
                }
                else {
                  // Other wise look at semver realizations for any
                  // other prereleases.
                  const otherSemver = this.getSemverRealizations();

                  const otherPreReleaseRelatives = _.filter(otherSemver, (key) => {
                    const newParsed = semver.parse(this.valueToSemver(key));
                    return (newParsed.prerelease.length > 0)
                        &&
                        (
                          `${newParsed.major}.${newParsed.minor}.${newParsed.patch}` === majMinPatch
                        );
                  });
                    // We are only concerned if there are any other
                    // prereleases besides the current one.
                  if (
                    _.without(
                      otherPreReleaseRelatives,
                      this.valueToSemver(semverishKey).length > 0
                    )
                  ) {
                    // Find the current index in prerelease relatives.
                    let tmpValue = this.valueToSemver(semverishKey);
                    if (parsed.prerelease.length === 1) {
                      tmpValue = `${semverishKey}.0`;
                    }
                    const currentIndex = _.indexOf(otherPreReleaseRelatives, tmpValue);
                    const remainingRealizations = _.takeRight(
                      otherPreReleaseRelatives,
                      otherPreReleaseRelatives.length - (currentIndex + 1)
                    );
                    if (remainingRealizations.length > 0) {
                      // We either have an alpha of the same name or
                      // different higher name.
                      if (semver.parse(remainingRealizations[0]).prerelease[0]
                          ===
                          parsed.prerelease[0]
                      ) {
                        // Same alpha or less specific prerelease.
                        const otherNamed = _.without(
                          _.map(
                            remainingRealizations,
                            thing => semver.parse(thing).prerelease[0]
                          ),
                          parsed.prerelease[0]
                        );

                        if (parsed.prerelease.length !== 1) {
                          // Same alpha higher one exists.
                          range.setTerminalBounds(`<${majMinPatch}-${parsed.prerelease[0]}.${parsed.prerelease[1] + 1}`); // eslint-disable-line max-len
                        }
                        else if (otherNamed.length > 0) {
                          // After removing any alphas of the same name
                          // there is still another alpha.
                          range.setTerminalBounds(`<${majMinPatch}-${otherNamed.sort()[0]}.0`);
                        }
                      }
                      else {
                        // different alpha
                        range.setTerminalBounds(`<${majMinPatch}-${semver.parse(remainingRealizations[0]).prerelease[0]}.0`); // eslint-disable-line max-len
                      }
                    }
                  }
                }
              }
            }
            // Make the range and semverist Ranges.
            range.setRange();
            range.setSemveristRange();
            this.addConverterSemveristElement(
              typeKey,
              elementKey,
              range.getRange(),
              range.getSemveristRange()
            );
          });
        });
      });
      // In case we have this promise based scope problems.
      const that = this;
      const gamma = _.cloneDeep(that.getConverter());
      return gamma;
    }

    /**
       * @typedef {Array} semverRealizations - An array of semver string
       *   values that represent all semver values in this semverish object both
       *   declarative, a hierarchy that represents about full semver value
       *   and implied, a hierarchy that is an incomplete
       *   semver value which can be completed by adding the value 0 to the
       *   remaining semver places.
       */

    /**
       * Adds a new semverRealization to the array of all
       *  semver realizations for this converter object.
       * @param {string} semverRealization - Adds  a valid semver to
       *   semverRealizations {@link semverRealizations}.
       * @returns {void}
       */
    addSemverRealizations(semverRealization) {
      if (semver.valid(semverRealization)) {
        this.converter.semverRealizations.push(semverRealization);
      }
      else {
        throw new Error(`Semver realizations must be valid semver, ${semverRealization} is not a valid semver.`);
      }
    }

    /**
       * Get all unique semver realizations for the semverish object related
       *   to this converter object.
       *
       * @returns {semverRealizations} - {@link semverRealizations}
       */
    getSemverRealizations() {
      return this.sortSemverishArray(_.uniq(this.converter.semverRealizations));
    }

    /**
       * Sets the semver realizations. Can be set at once or added
       *   to as new information comes to light.
       *
       * @param {Array} semverRealizations {@link semverRealizations}
       * @returns {void}
       */
    setSemverRealizations(semverRealizations) {
      this.converter.semverRealizations = semverRealizations;
    }

    /**
       *
       * @param {string} elementType
       *   An attribute Type such as (attribute || group || default)
       * @param {string} id
       *   An id.
       * @param {string} semverishRange
       *   A key within the id of a semverishRange.
       * @param {any} attributeValue - A value for that attribute Key.
       * @returns {void}
       */
    addConverterSemveristElement(elementType, id, semverishRange, attributeValue) {
      // note: Not using _.set because of the dot separated
      // values in semverishRange
      if (!this.converter[elementType]) {
        this.converter[elementType] = {};
      }
      if (!this.converter[elementType][id]) {
        this.converter[elementType][id] = {};
      }
      this.converter[elementType][id][semverishRange] = attributeValue;
    }
  });
};
