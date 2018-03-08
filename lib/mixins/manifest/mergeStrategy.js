

const _ = require('lodash');
/**
 * This is a manifest plugin
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 * @param {Class} superclass
 * A super class or mixed in super class.
 * @returns {Class}
 *   A mixed in class.
 */
module.exports = superclass => class extends superclass {
  /**
   * Composes a semverist element from its applicable components
   *   by merging objects together in the order assembled by the
   *   config indicated priority.
   *
   * @param {string} elementName - A semverist element name.
   * @param {string} semverValue - A valid semver string.
   * @param {Object} compositionDraft - A draft of the composition
   *   including a semver hierarchy of all of the semver values
   *   in the semver realizations from the manifest's converter, as
   *   well as any previously added semverist elements.
   * @returns {Object} - The composition with the passed element
   *   added at the semver value in the hiearchy.
   */
  strategizeComposition(elementName, semverValue, compositionDraft) {
    // Get the ordered items
    const semverishObject = this.getConverterClass().getSemverishObject();
    const items = this.getManifestComponents()[elementName][semverValue].components;
    // Get the objects from the semverish Origin. and key them by their key.
    const tmpObject = {};
    items.forEach((item) => {
      tmpObject[item] = _.cloneDeep(_.get(semverishObject, item));
    });
    // Merge items in.
    const newThing = _.reduce(tmpObject, _.merge);
    _.set(compositionDraft, `${semverValue}.${elementName}`, newThing);

    return compositionDraft;
  }
};
