/**
 * A module to load configuration for the semverist.
 * @module configLoader
 */

// Turn off warnings for folks not using config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

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
 * Initializes the manifest class.
 * @alias module:configLoader
 *
 * @param {string} configNameSpace - A namespace in configuration
 *   to draw configuration from for this manifest.
 * @param {semveristBehaviors} configs - A configuration override
 *   object. {@link semveristBehaviors}
 * @returns {string}
 *   Returns the named config.
 */
function configLoader(configNameSpace, configs) {
  // Bring in nameSpace if Provided.
  let tmpConfigNameSpace;
  if (configNameSpace) {
    tmpConfigNameSpace = configNameSpace;
  }
  // Bring in passed configs if provided.
  let tmpConfig;
  if (!configs) {
    tmpConfig = {};
  } else {
    tmpConfig = _.cloneDeep(configs);
  }
  // Set Defaults for manifest.
  const manifestDefaultConfig = {
    default: defaultConfig,
  };

  // Take any passed in configs and overwrite the default.
  const totallyNew = _.assignIn({}, manifestDefaultConfig, tmpConfig);

  let tmpNameSpaceConfig;
  // If we have a nameSpace see if we can get the item.
  // Name spaces allow for seperate individualized configurations for the
  // semverist in the same config organized by named key.
  if (tmpConfigNameSpace) {
    if (_.has(totallyNew, tmpConfigNameSpace)) {
      tmpNameSpaceConfig = _.get(totallyNew, tmpConfigNameSpace);
    } else {
      throw new Error('Name space does not exist in passed configs.');
    }

    // Now we can extend the module defaults with our nameSpace config.
    // This allows namespace config to be lean or expressive.
  } else {
    tmpNameSpaceConfig = totallyNew.default;
  }
  return tmpNameSpaceConfig;
}

module.exports = configLoader;
