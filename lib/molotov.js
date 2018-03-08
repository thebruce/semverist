

// Require supers directory.
const supers = require('./supers');
// Require plugins directory.
const mixins = require('./mixins');
// The molotov class we will extend.
const Molotov = require('molotov/lib/molotov');

const molotovConfig = require('./molotov.json');

const molotovNameSpace = 'semverist';

/**
 * SemveristMolotov class extending molotov modules Molotov.
 *
 * @class SemveristMolotov
 * @extends {Molotov}
 */
class SemveristMolotov extends Molotov {
  /**
   * Creates an instance of SemveristMolotov.
   * @param {Object} overrides
   *   A molotov config object for semverist. Typically used for dynamic config
   *   or for semverist using modules to pass in reconfigurations of existing
   *   plugins.
   * @param {Array} cocktailClasses
   *   An array of cocktailClasses typically used by modules which wish to
   *   override or provide new plugins or supers for semverist.
   * @memberof SemveristMolotov
   */
  constructor(overrides, cocktailClasses) {
    super(molotovConfig, molotovNameSpace, supers, mixins, overrides, cocktailClasses);
  }
}

/**
 * SchemePunkMolotov Factory.
 * @param {Object} configObject
 *   Options for the semveristkMolotov.
 * @param {Object} configObject.config
 *   Any dynamic molotov configuration to pass along.
 * @param {Array} configObject.cocktailClasses
 *   An array of cocktail classes that modules implementing semverist may
 *   use to override plugins and supers.
 * @returns {SemveristMolotov}
 *  An instance of the SemveristMolotv class.
 */
module.exports = function semveristMolotov(configObject = { overrides: {}, cocktailClasses: [] }) {
  return new SemveristMolotov(configObject.overrides, configObject.cocktailClasses);
};
