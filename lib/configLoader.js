'use strict';

// Turn off warnings for folks not using config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const config = require('config');
const _ = require('lodash');
const defaultConfig = require('./semveristDefaultConfig');

/**
 * The semverist Behavior object. A part of semverist configuration
 * which if provided from the config module should be namespaced to
 * 'semverist'.
 *
 * @typedef {Object} semveristBehaviors - An object with semverist behavior
 *   configuration.
 * @property {boolean} [inheritence=semverImplied] -
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
 *   behavior. This is only in effect if the inheritence is
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


/* Initializes the manifest class.
 *
 * @param {string} configNameSpace - A namespace in configuration
 *   to draw configuration from for this manifest.
 * @param {semveristBehaviors} configs - A configurtion override
 *   object.
 */
module.exports = function configLoader(configNameSpace, configs) {
  // Bring in nameSpace if Provided.
  let tmpConfigNameSpace;
  if (configNameSpace) {
    tmpConfigNameSpace = configNameSpace;
  }
  // Bring in passed configs if provided.
  let tmpConfig;
  if (!configs) {
    tmpConfig = {};
  }
  else {
    tmpConfig = _.cloneDeep(configs);
  }
  // Set Defaults for manifest.
  const manifestDefaultConfig = defaultConfig;

  // Take configs that have been passed in and make those my
  // defaults.
  // See: https://github.com/lorenwest/node-config/wiki/Sub-Module-Configuration  // eslint-disable-line max-len
  config.util.extendDeep(manifestDefaultConfig, tmpConfig);
  config.util.setModuleDefaults('semverist', manifestDefaultConfig);
  let tmpNameSpaceConfig;
  // If we have a nameSpace see if we can get the item.
  // Name spaces allow for seperate individualized configurations for the
  // semverist in the same config organized by named key.
  if (tmpConfigNameSpace) {
    // If the key doesn't exist this will throw.
    tmpNameSpaceConfig = config.get(`semverist.${tmpConfigNameSpace}`);
    // Now we can extend the module defaults with our nameSpace config.
    // This allows namespace config to be lean or expressive.
    tmpNameSpaceConfig = _.assignIn({}, manifestDefaultConfig, tmpNameSpaceConfig);
  }
  else {
    tmpNameSpaceConfig = config.get('semverist');
  }
  return tmpNameSpaceConfig;
};
