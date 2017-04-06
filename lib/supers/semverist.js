'use strict';

// Turn off warnings for folks not using config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const toSemver = require('version-comparison/lib/toSemver');
const _ = require('lodash');
const config = require('config');
const versionComparison = require('version-comparison');

const semverist = class semverSuperBase {
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
   * @property {boolean} [inheritenceType=semverImplied] -
   *   (null|semverImplied|lasySemverist) Enables inheritence for
   *   the semverist object composer. Can be 1) null, or no
   *   inheritence, 2) semverImplied the default
   *   in which Parent semverist elements are inherited to
   *   their child leaves unless they are overridden by another
   *   instance of the same semverist element. Inheritence does not
   *   cross over from parent to its siblings or 3) lazySemverist which Affects
   *   inheritence by treating
   *   the the highest semver occurence of a semverist element (elements
   *   indicated below), as the element to inherit from for all future
   *   parent and children leaves until specifically overriden by another
   *   instance of the same semverist element. Adjacent higher siblings
   *   in the semverist object can inherit elements from a previous sibling or
   *   its children.
   * @property {Object} [lazySemverist] - Configuration for lazySemverist
   *   behavior. This is only in effect if the inheritenceType is
   *   lazySemverist.
   * @property {boolean} [lazySemverist.preReleaseForwards=false] - If true
   *   allows lazy semverist enabled semverist elements to carry forward from
   *   prereleases.
   * @property {boolean} [lazySemverist.attributes=true] - Applies
   *   lazySemverist inheritence to the semverist element, attributes.
   *   Currently this is the only kind of lazySemverist though we plan to add
   *   groups and defaults as well.
   * @property {boolean} [default=true] - Enables default semverist
   *   elements to influence semverist composer inheritence and merge
   *   strategies.
   * @property {string} [defaultName=default] - An override name for
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
   */

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
    // Bring in versionComparison.
    this.versionComparison = versionComparison;
    let tmpConfig;
    if (!configs) {
      tmpConfig = {};
    }
    else {
      tmpConfig = _.cloneDeep(configs);
    }
    // Set Defaults for semverist objects.
    const semveristDefaultConfig = {
      semveristBehaviors: {
        inheritence: 'semverImplied',
        lazySemverist: {
          attribute: true,
          preReleaseForwards: false
        },
        default: true,
        defaultName: 'default',
        groups: true,
        mergeStrategy: 'lastIn',
        preReleasePattern:
          /\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g
      },
      groups: {},
      prereleaseOrdering: {},
      directoryFileIgnorePattern: '.* ,*.!{json}'
    };

    // Take configs that have been passed in and make those my
    // defaults.
    // See: https://github.com/lorenwest/node-config/wiki/Sub-Module-Configuration  // eslint-disable-line max-len
    config.util.extendDeep(semveristDefaultConfig, tmpConfig);
    config.util.setModuleDefaults('semverist', semveristDefaultConfig);

    // Now set needed defaults.
    this.setDefaultName(config.get('semverist.semveristBehaviors.defaultName'));

    this.setSemveristGroups(config.get('semverist.groups'));

    this.setSemveristConfig(config.get('semverist'));
  }

  /**
   * Returns an array of the semverString split.
   *
   * @param {string} semverishString
   *   A semverish string.
   * @returns {array}
   *   An array of semverish values.
   */
  splitStringNoEmpties(semverishString) { // eslint-disable-line class-methods-use-this
    return semverishString.split('.').filter(v => v);
  }

  /**
   * An options object for use when creating and working with ranges.
   *
   * @typedef {Object} semveristItemOptions -An options object.
   * @property {boolean} inheritence - Determines whether inheritence should
   *   be used in considering the item's range.
   * @property {boolean} lazySemverist - Determines whether lazySemverist
   *   should be applied to the item's range.
   * @property {string} type - The type element or semveristObject, attribute,
   *   default, group, semveristObject.
   */

  /**
   * Creates an options object for a given attribute type,
   *
   * @param {string} attributeType - A semverist element
   *   (attribute, group, default) or the semverist object
   *   itself (semveristObject)
   * @param {boolean} [inheritenceOverride]
   * @param {boolean} [lazySemverOverride]
   *
   * @returns {semveristItemOptions}
   *   {@link emveristItemOptions}
   */
  createOptions(attribute, inheritenceOverride) {
    const options = {
      attributeType: attribute,
    };
    if (attribute === 'semveristObject') {
      options.inheritence = null;
    }
    else {
      options.inheritence = this.getSemveristConfig().semveristBehaviors.inheritence;

      if (inheritenceOverride !== undefined) {
        options.inheritence = inheritenceOverride;
      }
    }
    return options;
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
   * Returns an array of semver parts in order of their occurence.
   *
   * @static
   * @returns {Array} - An array of semver parts in order.
   */
  static getSemverLevels() {
    return [
      'major',
      'minor',
      'patch',
      'release',
      'build'
    ];
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
    this.semveristConfig = _.cloneDeep(configuration);
  }

  /**
   * Sets an internal item with itemPath within the config to the
   *   the passed value.
   *
   * @param {string} itemPath
   *   An attribute or . separated path to an attribute.
   * @param {any} value
   *   A value you would like to assignt to the passed path within
   *     semverist config.
   */
  setSemveristConfigItem(itemPath, value) {
    _.set(this.semveristConfig, itemPath, value);
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
    if (pattern !== undefined) {
      this.preReleasePattern = pattern;
    }
    else {
      this.preReleasePattern = /\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g; // eslint-disable-line max-len
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

module.exports = semverist;
