'use strict';

// Require supers directory.
const supers = require('./supers');
// Require plugins directory.
const mixins = require('./mixins');
// The molotov class we will extend.
const Molotov = require('molotov/lib/molotov');

const molotovConfig = require('./molotov.json');

const molotovNameSpace = 'semverist';

class SemveristMolotov extends Molotov {
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
 */
module.exports = function semveristMolotov(configObject = {overrides: {}, cocktailClasses: []}) {
  return new SemveristMolotov(configObject.overrides, configObject.cocktailClasses);
};
