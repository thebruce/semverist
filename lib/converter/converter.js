'use strict';

const _ = require('lodash');
const Molotov = require('../molotov');
const semver = require('semver');
const semverishFactory = require('../semverish/semverish');
const rangeFactory = require('../semverish/range');

/**
 * sourceConverter superClass.
 */
module.exports = function converterFactory(superNameSpace, pluginName) {
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
  return setUp
    .then(
      extendedClass => class converter extends extendedClass {
        init(semverishObject, configs) {
          if (configs !== undefined) {
            super.init(configs);
          }
          else {
            super.init();
          }
          this.setConverter({
            semverRealizations: [],
            default: {},
            group: {},
            attribute: {}
          });
          this.setSemveristObject(semverishObject);
          this.setSemveristClasses();
        }


        setSemveristClasses() {
          this.semveristClasses = {
            default: {},
            group: {},
            attribute: {}
          };
        }

        getSemveristClasses() {
          return this.semveristClasses;
        }

        addSemveristClassItem(elementType, id, semverishValue, classType, classItem) {
          // note: Not using _.set because of the dot separated
          // values in semverish value.
          if (!this.semveristClasses[elementType]) {
            this.semveristClasses[elementType] = {};
          }
          if (!this.semveristClasses[elementType][id]) {
            this.semveristClasses[elementType][id] = {};
          }
          if (!this.semveristClasses[elementType][id][semverishValue]) {
            this.semveristClasses[elementType][id][semverishValue] = {};
          }
          this.semveristClasses[elementType][id][semverishValue][classType] =
            _.cloneDeep(classItem);
        }

        setSemveristObject(semveristObject) {
          this.semveristObject = semveristObject;
        }

        getSemveristObject() {
          return this.semveristObject;
        }

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

        instantiateRange(range, semverish) {
          const configs = this.getSemveristConfig();
          range.init(configs, semverish);
          range.setSemveristRange();
          return range;
        }

        semveristAssemble(level) {
          let semveristAtLevel;
          let levelPrep = '';
          const promises = [];
          if (level === 'root') {
            semveristAtLevel = Object.keys(this.getSemveristObject());
          }
          else {
            semveristAtLevel = Object.keys(_.get(this.getSemveristObject(), level));
            levelPrep = `${level}.`;
          }

          semveristAtLevel.forEach((key) => {
            const semverishClass = semverishFactory('semverist', 'semverish')
            .then(SemverishClass => new SemverishClass());
            const rangeClass = rangeFactory('semverist', 'range')
            .then(RangeClass => new RangeClass());

            const semveristClass = Promise.all([semverishClass, rangeClass])
            .then((semveristClassArray) => {
              const semverish = this.instantiateSemverish(semveristClassArray[0], levelPrep, key);
              const range = this.instantiateRange(semveristClassArray[1], _.cloneDeep(semverish));
              if (!semverish.getSemveristElement()) {
                // Recursively call for semverist Assemble.
                return this.semveristAssemble(`${levelPrep}${key}`);
              }
              // Add semverist Class items.
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
          .then(() => {
            const tmpClasses = this.getSemveristClasses();
            return Object.keys(tmpClasses).forEach((typeKey) => {
              Object.keys(tmpClasses[typeKey]).forEach((elementKey) => {
                // Create an object for each of these element keys within the
                // converter Object. Dig further to semverish keys.
                let semverishKeys = Object.keys(tmpClasses[typeKey][elementKey]);
                // Sort these keys in semverish order.
                semverishKeys = this.sortSemverishArray(semverishKeys);
                // Now turn them into range Objects for the converter.
                semverishKeys.forEach((semverishKey, index, collection) => {
                  // get the Range object at each of these keys.
                  const range = tmpClasses[typeKey][elementKey][semverishKey].range;
                  // Now we need to see if this semverishKey has any children.
                  const collectionHigherThanThis = _.slice(collection, index + 1);
                  const children = _.filter(
                    collectionHigherThanThis,
                    thing => this.analyzeSemverishAdjacency(semverishKey, thing).child === true);
                  // If it does we need to add them as exceptions to this range.
                  if (children.length !== -1) {
                    // Determine how many siblings we have for each item.
                    // They are in order. We need to add these to the range
                    // as exceptions.
                    this.sortSemverishArray(children).forEach((semverishException) => {
                      range.addException(semverishException);
                    }, this);
                  }
                  // Make the range and semverist Ranges.
                  if (range !== undefined) {
                    range.setRange();
                    range.setSemveristRange();
                    this.addConverterSemveristElement(
                      typeKey,
                      elementKey,
                      range.getRange(),
                      range.getSemveristRange()
                    );
                  }
                  // add the range as the key to the element Key and the range
                  // object as the value.
                }, this);
              }, this);
            }, this);
          })
          .then(() => this.getConverter());
        }

        /**
         * populateConverter
         *   Populates the converter object from the source.
         */
        populateConverter() {
          // call traverse.
          this.converter = 'fake';
          // With traversed object call assembleConverterComposition.
        }

        addSemverRealizations(semverRealization) {
          if (semver.valid(semverRealization)) {
            this.converter.semverRealizations.push(semverRealization);
          }
          else {
            throw new Error(`Semver realizations must be valid semver, ${semverRealization} is not a valid semver.`);
          }
        }

        getSemverRealizations() {
          return this.sortSemverishArray(_.uniq(this.converter.semverRealizations));
        }

        setSemverRealizations(semverRealizations) {
          this.converter.semverRealizations = semverRealizations;
        }

        /**
         *
         * @param {string} attributeType
         *   An attribute Type such as (attribute || group || default)
         * @param {string} attributeKey
         *   A key within an attribute Type
         * @param {any} attributeValue - A value for that attribute Key.
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

        /**
         * getConverterAttribute
         *   Gets an attribute from the converter object.
         *
         * @param {string} attribute
         *   The name of a converter attribute.
         * @param {string} value
         *   The name of a key within a converter attribute.
         *
         * @returns {any} value
         *   The value for the passed converter object key and value key.
         */
        getConverterAttribute(attributeType, attributeKey) {
          return this.converter[`${attributeType}`][`${attributeKey}`];
        }

        /**
         * assembleConverterComponents.
         *   Take the raw converter object and reconcile the ordering
         *   of the object based on inheritence and lazySemver.
         *   Modify the component.
         */
        assembleConverterComposition() {
          this.coverter = 'fake';
          // break down the raw component item into processed converter.
        }

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
         * @param {obj} converter
         *   A converter object.
         */
        setConverter(converterObject) {
          this.converter = converterObject;
        }

        /**
         * getConverter.
         *
         * @returns {obj}
         */
        getConverter() {
          this.converter.semverRealizations = this.getSemverRealizations();
          return this.converter;
        }
      });
};
