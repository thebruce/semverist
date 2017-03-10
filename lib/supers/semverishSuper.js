'use strict';

const _ = require('lodash');
const semveristSuperBase = require('./semveristSuperBase');
const semverUtils = require('semver-utils');
const semver = require('semver');

/**
 * sourceConverter superClass.
 */
module.exports = class semverishSuper extends semveristSuperBase {
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
  setSemver(semverish) {
    this.semver = this.valueToSemver(semverish);
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
    this.semveristElement = this.getRawSemveristElement()[0];
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
   * Sets the type of the passed element name. Will default to an attribute
   *   but can be a (attribute || default (or the overridden default name) ||
   *   group).
   *
   * @param {string} elementName
   *  A semverist element name.
   */
  setSemveristElementType(elementName) {
    this.semveristElementType = this.determineSemveristElementType(elementName);
  }


  /**
   * Returns a semverist element type relating to the element attached to
   * the semverish path or null if there was no semverist element in this path.
   *
   * @returns {string=attribute}
   *   attribute || default || group || null
   */
  getSemveristElementType() {
    return this.semveristElementType;
  }

  /**
   * Sets the parsed version of the related semver value to the
   *   passed semverish value. Used to establish a parsed version
   *   of this object's semverish value. Note: The semverValue
   *   needed for this function may have more granularity than the
   *   original semverish value as a result of being translated
   *   to a valid semver.
   * @param {string} semverValue
   *   A valid semver string.
   */
  setSemverParsed(semverValue) {
    this.semverParsed = semverUtils.parse(semverValue);
  }

  /**
   * Returns the parsed object for this semver value.
   *
   * @returns {object}
   *   A parsed semver object from semverUtils.
   */
  getSemverParsed() {
    return this.semverParsed;
  }

  /**
   * Sets an array of semver pieces from the original value.
   *
   * @param {string} semverish
   *   A semverish value with the semveristElement Removed.
   * @returns {array}
   *   An array of semverish pieces that can be related to
   *     the original semverist path.
   */
  setSemverishArray(semverish) {
    const tmpSemverish = _.cloneDeep(semverish);
    this.semverishArray = this.splitStringNoEmpties(tmpSemverish);
    // Check to see if tmpSemverish can be parsed.
    if (semverUtils.parse(tmpSemverish)) {
      const tmpParsed = semverUtils.parse(tmpSemverish);
      // The only way this is true is if we have a parseable semverish value.
      if (_.has(tmpParsed, 'release')) {
        // The original semverish value had a prerelease in it.
        this.semverishArray = tmpParsed.version.split('.');
        Array.prototype.push.apply(
          this.semverishArray,
          this.splitStringNoEmpties(tmpParsed.release)
        );
        if (_.has(tmpParsed, 'build')) {
          this.semverishArray.push(tmpParsed.build);
        }
      }
    }
  }

  /**
   * Gets an array of path items related to the original
   *   semverish value.
   * @returns {array}
   *   An array of items with path elements from the original
   *     semverish value.
   */
  getSemverishArray() {
    return this.semverishArray;
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
   * @returns {boolean}
   *   returns true if the semverish path is a pre-release path or false if not.
   */
  getIsPreReleasePath() {
    return this.isPreReleasePath;
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

 /**
   * Extracts all valid path components that could function as a semver range.
   * i.e. 4, 4.0, 4.0.0, 4.0.0-alpha, 4.0.0-alpha.1
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
        let element = tmpPath.replace(`${replacer}.`, '').replace(this.getPreReleasePattern(), '');
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
   * Despecifies the semverish value associated with this object to the desired
   *   level. Can give you less granularity reducing a patch level semver to its
   *   minor or major components etc.
   *
   * @param {integer} desiredLevel - The level of semver positions you want
   *   to report back. Must not be greater than the number of semver positions
   *   in the original semverish value.
   *
   * @returns {string} - A semverish value reduced to the passed desired level
   *   of semver positions.
   */
  despecifySemver(desiredLevel) {
    let tmpLevel = desiredLevel;
    if (desiredLevel === undefined) {
      tmpLevel = 1;
    }
    const tmpSemver = this.getSemverParsed().version.split('.');
    let count = 3;

    let subCount = 0;
    this.getSemverishArray().slice(0, 3).forEach((item) => {
      if (_.isFinite(_.parseInt(item))) {
        subCount += 1;
      }
    });
    if (subCount <= 2) {
      count -= (3 - subCount);
    }

    tmpSemver.slice(0, count + 1);

    if (_.has(this.getSemverParsed(), 'release')) {
      Array.prototype.push.apply(
        tmpSemver,
        this.splitStringNoEmpties(this.getSemverParsed().release)
      );
    }

    if (_.has(this.getSemverParsed(), 'build')) {
      tmpSemver.push(this.getSemverParsed().build);
    }

    return tmpSemver.slice(0, tmpLevel).join('.');
  }

  /**
   * Get a semverist element (attribute||group||default) from a semverish path.
   *
   * @param {string} path - A semverish path with an attribute attached.
   *
   * @returns {string} - An attribute on the semverish path if it exists or ''.
   */
  extractSemveristElementFromPath(pather) {
    // semverish must be set.
    if (this.getSemverish()) {
      return pather.replace(this.getSemverish(), '').replace('.', '');
    }
    throw new Error('You must have a semverish value set before extracting an element');
  }

  /**
   * Determines whether the semverist element you pass is
   * an attribute, group or default.
   *
   * @param {string} semveristElementName - The name of a semverist element.
   *
   * @returns {string} - A semverist element type (attribute||group||default).
   */
  determineSemveristElementType(semveristElementName) {
    let semverType = 'attribute';
    // Check config for default.
    if (this.isAttributeDefault(semveristElementName)) {
      semverType = 'default';
    }
    else if (
      _.indexOf(
        Object.keys(this.getSemveristGroups()),
        semveristElementName
      ) !== -1
    ) { // check config for groups
      semverType = 'group';
    }
    // otherwise its an attribute.
    return semverType;
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
};
