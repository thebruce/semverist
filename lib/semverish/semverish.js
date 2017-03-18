'use strict';

const _ = require('lodash');
const Molotov = require('../molotov');

module.exports = function semverishFactory(superNameSpace, pluginName) {
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

  return setUp.then(extendedClass => class semverish extends extendedClass {
    /**
     * Initializes the semverish object from a semverish value
     *   to a well informed and capable object around that value.
     * @param {string} semverishValue
     *   A semverish value containing atleast a major version. The
     *     value may have additional semver paths down to a build, with
     *     or without a semverist element (attribute/group/default)
     *     as the final portion of the path.
     *
     * @param {object} [configs]
     *   An optional config object to override semverish configs from
     *   the configuration provided to/by the config module.
     */
    init(semverishValue, configs) {
      super.init(configs);
      this.setOriginalSemverishValue(semverishValue);
      this.setSemverish(this.getOriginalSemverishValue());
      this.setSemveristElement(this.getOriginalSemverishValue());
      if (this.getSemveristElement() !== undefined) {
        this.setSemveristElementType(this.getSemveristElement());
      }
      else {
        this.setSemveristElementType(null);
      }
      this.setSemver(this.getSemverish());
      this.setSemverParsed(this.getSemver());
      this.setIsPreReleasePath();
      this.setSemverishArray(this.getOriginalSemverishValue());
    }

    /**
     * Sets the original semverish value for this for reference.
     *
     * @param {string} semverishValue
     *   The semverish value can be a full semver string or a partial string
     *     and may have an attribute, group, or default path as the final
     *     element of the path. I.e. 4.0.1.default || 4.0 || 4 ||
     *     4.0.1-alpha.default || 4.default || 4.0.1-alpha.0+432.default
     * @throws
     *   Throws an error if the semverishValue can not be converted to a semver
     *     value.
     */
    setOriginalSemverishValue(semverishValue) {
      this.semverishValue = semverishValue;
    }

    /**
     * Get the original semverish value used to create this object.
     *
     * @returns {string}
     *   A semverish value.
     */
    getOriginalSemverishValue() {
      return this.semverishValue;
    }

    /**
     * Sets a semverish value from the original semverish value with any
     *   trailing semverist element removed from the path.
     *
     * @param {any} semverishValue
     *   A semverish value with or without a trailing semverist element.
     */
    setSemverish(semverishValue) {
      this.semverish = this.extractSemverishFromPath(semverishValue);
    }

    /**
     * Gets the semverish value with semver element removed.
     *
     * @returns {string}
     *   A semverish value with no semverist element.
     */
    getSemverish() {
      return this.semverish;
    }

    /**
     * Sets a valid semver value related to the semverish value
     *   used to initialize this object. This will fill out missing
     *   elements of the semver if anything less than a patch or 3
     *   position was provided.
     *
     * @param {string} semverish
     *   A semverish value to transform into a valid semver string.
     * @throws
     *   Throws an error is the semverish value can not be transformed
     *   into a valid semver value.
     */
    setSemver(semverishValue) {
      this.semver = this.valueToSemver(semverishValue);
    }

    /**
     * Returns a valid semver value for the semverish value of this object.
     *
     * @returns {string}
     *   A valid semver string.
     */
    getSemver() {
      return this.semver;
    }

    /**
     * Sets this.semveristElement to a semverist element from a semverish
     *   value if one exists in that semverish. Also establishes the raw
     *   value setRawSemveristElement() for that element, as an element can
     *   be a multi part path. For the semverist element we are primarily
     *   interested in the
     *   initial element name.
     *
     * @param {string} semverishValue
     *   A semverish value with or without a semverist element attached.
     */
    setSemveristElement(semverishValue) {
      const tmpElement = this.extractSemveristElementFromPath(semverishValue);
      // Set the raw element which will store the value or deep path if present.
      this.setRawSemveristElement(this.splitStringNoEmpties(tmpElement));
      // For the semverist Element we generally care about
      // only the first part of the path.
      super.setSemveristElement(this.getRawSemveristElement()[0]);
    }

    /**
     * Returns the name of a semverish element path (or the name
     * of the first part of a path if it is a deep path).
     *
     * @returns {string}
     *   A string.
     */
    getSemveristElement() {
      return this.semveristElement;
    }

    /**
     * Sets the raw semverist element array. A place to record the
     *   semverist element in array form. This is particularly useful
     *   if the semverist element is a deep path, or more than one level
     *   deep. i.e. entity.property or entity.property.anotherProperty.
     *
     * @param {array} rawArray
     *   An array of the semverist element path
     */
    setRawSemveristElement(rawArray) {
      this.rawSemveristElement = rawArray;
    }

    /**
     * Returns an array of the semverishs'
     * semverist element's paths.
     *
     * @returns {array}
     *   An array of the semverist element path.
     */
    getRawSemveristElement() {
      return this.rawSemveristElement;
    }

    /**
     * Sets whether or not the semver path is a prerelease path, true or false.
     *
     */
    setIsPreReleasePath() {
      if (!this.getSemverParsed()) {
        if (this.getSemver()) {
          this.setSemverParsed(this.getSemver());
        }
        else {
          throw new Error('There is no semver value to check for prerelease.');
        }
      }
      this.isPreReleasePath = _.has(this.getSemverParsed(), 'release');
    }

    /**
     * Returns a boolean on whether we have a prerelease path or not.
     *
     * @returns {boolean} - returns true if the semverish path is a
     *   pre-release path or false if not.
     */
    getIsPreReleasePath() {
      return this.isPreReleasePath;
    }

    /**
      * Extracts all valid path components that could function
      * as a semver range. i.e. 4, 4.0, 4.0.0, 4.0.0-alpha, 4.0.0-alpha.1
      *
      * @param {string} path - A path converted to a semverish value
      *   i.e. x[.y][.z][.a]
      *
      * @returns {string} - A semverish value. i.e. x[.y][.z][.N] or ''
      *   if no semverish value was found.
      */
    extractSemverishFromPath(semverishValue) {
      try {
        let tmpPath = semverishValue;
        const tmpArray = this.splitStringNoEmpties(semverishValue);
        if (semverishValue.indexOf('.') === 0) {
          throw new Error('The semverish value must have atleast a major portion.');
        }
        else if (semverishValue.lastIndexOf('.') === (tmpPath.length - 1)) {
          // Clear off the last . if it exists.
          tmpPath = tmpPath.slice(0, tmpPath.length - 1);
        }
        if (tmpArray.length > 1) {
          const replacer = `${tmpArray[0]}.${tmpArray[1]}`;
          let element = tmpPath.replace(
            `${replacer}.`, '')
              .replace(this.getPreReleasePattern(), '');
          if ((element !== '') && !_.isFinite(Number(element))) {
            // Check to see if we have a N.{element} or an deepPath.
            const elementArray = this.splitStringNoEmpties(element);
            if (elementArray.length > 1) {
              if (_.isFinite(Number(elementArray[0]))) {
                elementArray.shift();
              }
              element = elementArray.join('.');
              // Check to see that the actual element doesn't start with a zero.
              if (element.indexOf('0') === 0) {
                throw new Error('SemveristElement names can not have leading 0s.');
              }
            }
            else if (element.indexOf('0') === 0 && !_.isFinite(Number(elementArray[0]))) {
              // We have a non number 0 starting element and that is a no no.
              throw new Error('SemveristElement names can not have leading 0s.');
            }
            if (tmpPath.lastIndexOf(element) > -1) {
              tmpPath = tmpPath.slice(0, tmpPath.lastIndexOf(element) - 1);
            }
            else {
              throw new Error('There was a problem with your semverish path and the regex pattern used to identify your prereleases.');
            }
          }
        }

        this.valueToSemver(tmpPath);
        return tmpPath;
      }
      catch (error) {
        throw new Error(`The semverish value must be able to be converted to a semver value. ${error.message}`);
      }
    }

    /**
     * Get a semverist element (attribute||group||default) from a
     *   semverish path.
     *
     * @param {string} path - A semverish path with an attribute attached.
     *
     * @returns {string} - An attribute on the semverish path if it
     *   exists or ''.
     */
    extractSemveristElementFromPath(pather) {
      // semverish must be set.
      if (this.getSemverish()) {
        return pather.replace(this.getSemverish(), '').replace('.', '');
      }
      throw new Error('You must have a semverish value set before extracting an element');
    }
  });
};
