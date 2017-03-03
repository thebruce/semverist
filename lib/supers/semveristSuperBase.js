'use strict';

// Turn off warnings for folks not using config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const toSemver = require('version-comparison/lib/toSemver');
const _ = require('lodash');
const semver = require('semver');
const config = require('config');
const versionComparison = require('version-comparison');

const SemveristSuperBase = class semverSuperBase {
  constructor() {
    this.setPreReleasePattern();
  }

  /**
   * The semverist Behavior object. A part of semverist configuration
   * which if provided from the config module should be namespaced to
   * 'semverist'.
   *
   * @typedef {Object} semveristBehaviors - An object with semverist behavior
   *   configuration.
   * @property {boolean} [inheritence=true] - Enables inheritence for the
   *   semverist object composer. Parent semverist elements are inherited to
   *   their child leaves unless they are overridden by another
   *   instance of the same semverist element. Inheritence does not
   *   cross over from parent to its siblings
   * @property {Object} [lazySemverist] - Affects inheritence by treating
   *   the the highest semver occurence of a semverist element (elements
   *   indicated below), as the element to inherit from for all future
   *   parent and children leaves until specifically overriden by another
   *   instance of the same semverist element. Adjacent higher siblings
   *   in the semverist object can inherit elements from a previous sibling or
   *   its children.
   * @property {boolean} [lazySemverist.attributes=true] - Applies
   *   lazySemverist inheritence to the semverist element, attributes.
   *   Currently this is the only kind of lazySemverist though we plan to add
   *   groups and defaults as well.
   * @property {boolean} [defaults=true] - Enables default semverist
   *   elements to influence semverist composer inheritence and merge
   *   strategies.
   * @property {string} [defaultsName=default] - An override name for
   *   defaults.Semverist elements with this name will be utilized as
   *   defaults.
   * @property {boolean} [groups=true] - Enables group semverist
   *   elements to influence semverist composer inheritence and
   *   merge strategies.
   * @property {string} [mergeStrategy=lastIn] - Sets the mergeStrategy
   *   for use with semverist composer realizations of semverist
   *   element attributes.
   * @property {RegExp} [preReleasePattern] - A regex pattern to use to
   *   match your prerelease naming and versioning. Please
   *   note that any item that the bounds of your prerelease pattern could
   *   create conflicts with your semverist attribute names. Please be sure
   *   to tightly cordon off your patterns.
   */

  /**
   * A semverist group element which allows you to create any number
   * of arbirarily named groups for any combination of semverist
   * attributes.
   *
   * @typedef {Object} semveristGroups - An object with any number of
   *   arbitrarily named group configurations
   * @property {...Object} [groups.groupName] - Any number of
   *   group name keyed objects.
   * @property {Array.string} [groups.groupName.members] - An array
   *   of semverist element attributes who belongs to this group.  Any
   *   occurence of a group within the semverist hierarchy will apply to
   *   the members listed here according to the inheritence and merge
   *   strategy in play at that leaf of the hierarchy.
   */

  /**
   * A prerelease configuration object which represents the semver hierarchy
   * object. These should be complete semver hierarchies complete to the patch
   * version where release order for non-alphabetical prerelease names can
   * be indicated.
   *
   * @typedef {Object} preReleasedOrdering -An object with any
   *   number of semver hierarchies.
   * @property {...Object} [majorVersion] - Any number of major
   *   versions.
   * @property {...Object} [majorVersion.minorVersion] - Any number of minor
   *   versions.
   * // eslint-disable-next-line max-len
   * @property {Array.string} [majorVersion.minorVersion.releaseArray]
   *   A patch version key with an array of prerelease names in their release
   *   order. If they are alphabetical this is optional. If however, they
   *   deviate, you will need to indicate their release order here in every
   *   patch were you use a non
   *   alphabetical prerelease tag.

  /**
   * Initialization of semverist classes.
   *
   * @param {Object} [configs] - An optional config object. If it
   *   comes from the config module it will be namespaced to
   *   'semverist'
   * @param {semveristBehaviors} [configs.semveristBehaviors] - An
   *   object with overall semverist behavior configuration.
   *   {@link semveristBehaviors}
   * @param {semveristGroups} [configs.groups] - An object with
   *   any number of arbitrarily named group configurations
   *   {@link semveristGroups}
   * @param {preReleaseOrdering} [configs.preReleasedOrdering] -
   *   An object with any number of semver hierarchies.
   *   {@link preReleaseOrdering}
   */
  init(configs) {
    let tmpConfig;
    if (!configs) {
      tmpConfig = {};
    }
    else {
      tmpConfig = configs;
    }
    // Set Defaults for semverist objects.
    const semveristDefaultConfig = {
      semveristBehaviors: {
        inheritence: true,
        lazySemverist: {
          attributes: true
        },
        defaults: true,
        defaultsName: 'default',
        groups: true,
        mergeStrategy: 'lastIn',
        preReleasePattern: /\d-[a-zA-Z]*/g
      },
      groups: {},
      prereleaseOrdering: {}
    };

    // Take configs that have been passed in and make those my
    // defaults.
    // See: https://github.com/lorenwest/node-config/wiki/Sub-Module-Configuration  // eslint-disable-line max-len
    config.util.extendDeep(semveristDefaultConfig, tmpConfig);
    config.util.setModuleDefaults('semverist', semveristDefaultConfig);

    // Now set needed defaults.
    this.setDefaulttName(config.get('semverist.semveristBehaviors.defaultName'));

    this.setSemveristGroups(config.get('semverist.groups'));

    this.setSemveristConfig(config.get('semverist'));
  }

  /**
   * Sets the default name
   *
   * @param {string} defaultName=default - The name of the
   *   default semverist defaults element. By default it is,
   *   well, "default";
   */
  setDefaultName(defaultName) {
    this.defaultName = defaultName;
  }

  /**
   * Get the name of the semverist defaults element.
   *
   * @returns {string}
   */
  getDefaultName() {
    return this.defaultName;
  }

  /**
   * Sets semverist group elements.
   *
   * @param {Object} groupsConfig - Groups config detailing
   *   membership, typically comes from config.
   */
  setSemveristGroups(groupsConfig) {
    this.semveristGroups = groupsConfig;
  }

  /**
   * Get semverist group element details for this semverist.
   *
   * @returns {Object}
   */
  getSemveristGroups() {
    return this.semveristGroups;
  }

  /**
   * Returns semverist config.
   *
   * @returns {Object} - Configuration for use with the semverist.
   */
  getSemveristConfig() {
    return this.semveristConfig;
  }

  /**
   * Sets configuration from config Module or passed in.
   *
   *  @param {obj} configuration - A configuration object for the
   *   semverist.
   */
  setSemveristConfig(configuration) {
    this.semveristConfig = configuration;
  }

  /**
   * Convert a *semverish* value i.e. 4, 4.0 to a valid semver
   *   value.
   *
   * @param {string} semverString - A semver-ish value to convert
   *   to a propert semver value.
   *
   * @returns {string} - A valid semver string.
   */
  valueToSemver(semverString) { // eslint-disable-line class-methods-use-this
    return toSemver(semverString);
  }

  /**
   * Set the source for semverist subclasses and mixins.
   *
   * @param {Object} source - The semverist base class is capable
   *   of handling objects with a semver style hierarchy.
   *
   * @throws - Will throw an error if the source does not validate.
   */
  setSource(source) {
    if (this.validateSource(source)) {
      this.source = source;
    }
    else {
      throw new Error('Could not set source, it must be an object.');
    }
  }

  /**
   * Returns semverist semver style source object.
   *
   * @returns {Object} - An object with semver style hierarchy.
   */
  getSource() {
    return this.source;
  }

  /**
   * Validates that the source is the correct type.
   *
   * @param {any} source - A source value to validate.
   *
   * @returns {boolean} - True if the source is a valid type
   *    of source, False otherwise.
   */
  validateSource(source) { // eslint-disable-line class-methods-use-this
    if (typeof source === 'object' && Object.keys(source).length !== 0) {
      return true;
    }
    return false;
  }

    /**
     * Sets the prerelease pattern for the semverist.
     *
     * @param {RegExp} pattern
     *   A regex pattern that matches your preRelease pattern
     */
  setPreReleasePattern(pattern) {
    if (pattern) {
      this.preReleasePattern = pattern;
    }
    else {
      this.preReleasePattern = /\d-[a-zA-Z]*/g;
    }
  }

  /**
   * Returns your prerelease pattern.
   *
   * @returns {RegExp}
   */
  getPreReleasePattern() {
    return this.preReleasePattern;
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
  extractSemverishFromPath(pather) {
    let extractedSemver;
    let tmpPath = pather;
    // Try the quick and easy way, this will also catch alphas.
    if (SemveristSuperBase.isPreReleasePath(tmpPath)) {
      // If this went through the path was already a semver string.
      extractedSemver = tmpPath;
    }
    else {
      // OK the easiest way didn't work. The next easiest way is to
      // see if we can convert this to semver.
      try {
        const test = this.valueToSemver(tmpPath);
        if (SemveristSuperBase.isPreReleasePath(test)) {
          return tmpPath;
        }
        // The suffix of this path contained an entity or
        // was not valid in someway.
        throw new Error('Could not convert entity part of path to semver.');
      }
      catch (error) {
        if (tmpPath.indexOf('.') === 0) {
          // Quit while we are ahead.
          return '';
        }
        else if (tmpPath.lastIndexOf('.') === (tmpPath.length - 1)) {
          // Clear off the last . if it exists.
          tmpPath = tmpPath.slice(0, tmpPath.length - 1);
        }
        // OK, if we are here neither of the easy routes worked.
        // Which either means we have an attribute in our path somewhere or
        // we have a bad path.
        const prepSemver = [];
        // Let's test for both.

        const pathArray = tmpPath.split('.');
        // proper semver has a number in each position of the array
        // except for possibly the 3rd position which could have pre-release.
        // and this is good until we have a nonconsecutive item.
        pathArray.forEach((value, index) => {
          if (_.isFinite(Number(value)) && index === prepSemver.length) {
            prepSemver.push(value);
          }
          else if (value.match(this.getPreReleasePattern()) && index === 2) {
            prepSemver.push(value);
          }
        }, this);

        if (prepSemver.length > 0) {
          if (prepSemver.length < 4) {
            // We have atleast 1 semver item.
            extractedSemver = prepSemver.join('.');
          }
          else {
            extractedSemver = '';
            // We may possibly have a bad semver.
            if (!isFinite(Number(prepSemver[2]))) {
              extractedSemver = prepSemver.join('.');
            }
          }
        }
        else {
          // There was no semver part of this.
          extractedSemver = '';
        }
      }
    }
    return extractedSemver;
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
  addSemverishToSemverRange(value, semverRange) {
    // Fakey fakerson.
    this.fake = true;
    let newRange = `1.0.0 ${semverRange}`;
    newRange = false;
    return newRange;
  }

  /**
   * Tests to see if path has supported preRelease components within it.
   *
   * @param {sting} pather - A semverish path, i.e. 4.1.0-alpha, etc.
   *
   * @returns boolean - Returns True if this is a valid preRelease path,
   * False if it is not.
   */
  static isPreReleasePath(pather) {
    if (
      semver.valid(pather) // the semver must be valid.
      &&
      (
        pather.split('.').length < 4 // If it is valid and only 3 length. We are good.
        ||
        (
          pather.split('.').length < 5  // If 4, we need the post prerelease match to be numeric.
          &&
          _.isFinite(Number(pather.split('.')[3]))
        )
      )
    ) {
      return true;
    }
    return false;
  }

  /**
   * Get a semverist element (attribute||group||default) from a semverish path.
   *
   * @param {string} path - A semverish path with an attribute attached.
   *
   * @returns {string} - the item at position 0 of an attribute path.
   */
  extractSemveristElementFromPath(pather) {
    const semverParts = this.extractSemverishFromPath(pather);
    if (semverParts) {
      const tmpAttribute = pather.replace(String.prototype.concat(semverParts, '.'), '');
      if (tmpAttribute !== '') {
        // The item at position 0 will be the main semeverist element, even
        // if we have a deeper path to an attribute within that element.
        return tmpAttribute.split('.')[0];
      }
    }
    // Otherwise we were not able to find any semverist elements.
    return '';
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
   * Compares two semver values. A wrapper to versionCompare.
   *
   * @param {string} semverA
   * @param {string} semverB
   *
   * @return {int} - returns -1, 0, or 1
   *   - -1 if the left string is less than the right string.
   *   - 0 if the left string is equal to the right string.
   *   - 1 if the left string is greater than the right string.
   */
  semverishCompare(semverA, semverB) {  // eslint-disable-line class-methods-use-this
    return versionComparison(semverA, semverB);
  }

  /**
   * Checks to see if the attribute Name passed is the default name.
   *
   * @param {string} attributeName
   *   An attribute name.
   *
   * @returns {boolean} True if they are the same.
   */
  isAttributeDefault(attributeName) {
    return this.getDefaultName() === attributeName;
  }

  /**
   * Gets an array of group names to which the attribute belongs.
   *
   * @param {string} semveristAttribute - The name of a semverist
   *   attribute element.
   *
   * @returns {array} - An array of semverist group names.
   */
  getSemveristAttributeGroups(semveristAttribute) {
    const tmpAttributeGroups = [];
    // Get groups for this attribute.
    Object.keys(this.getSemveristGroups()).forEach((key) => {
      if (this.doesAttributeBelongToGroup(semveristAttribute, key)) {
        tmpAttributeGroups.push(key);
      }
    });

    return tmpAttributeGroups;
  }

  /**
   * Checks to see whether this semverist attribute belongs to the passed group.
   *
   * @param {string} attributeName - a semverist element attribute name.
   *
   * @param {any} groupName - A semverist element group name.
   *
   * @returns {boolean} - True if the attribute belongs to this group,
   * false if otherwise.
   *
   * @throws - Throws error if group does not have members.
   */
  doesAttributeBelongToGroup(attributeName, groupName) {
    if (!_.has(this.getSemveristGroups()[groupName], 'members')) {
      throw new Error(`${groupName} group is not properly formed and has no members array`);
    }
    if (
      this.getSemveristGroups()[groupName].members.find(
        item => item === attributeName
      )
    ) {
      return true;
    }
    return false;
  }
};

module.exports = SemveristSuperBase;
