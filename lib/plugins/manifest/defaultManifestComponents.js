'use strict';

const semver = require('semver');

/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Alters the manifest component for a semverist element
   *   by adding any default objects from the semverish object
   *   whose ranges are satisfied by the passed semver value.
   * @param {string} semverValue - A semver string.
   * @param {Object} converterItem - A converter item for
   *   this semverist element and value.
   */
  addItemAlters(semverValue, converterItem) {
    // register any alters on this semverist element.
    const converterDefaults = this.getConverterDefaults();
    const defaultKey = Object.keys(converterDefaults)[0];
    const defaults = Object.keys(converterDefaults[defaultKey]);
    // Check defaults for any applicable.
    const filterApplies = defaults.filter(
      defaultRange => semver.satisfies(
        semverValue,
        defaultRange
      )
    );

    // check for a default that applies at this semver in the converter.
    if (filterApplies.length) {
      // We had an applicable filter.
      this.addManifestComponentItem(
        converterItem.semveristElement,
        semverValue,
        `${this.getConverterDefaults()[defaultKey][filterApplies[0]].semverishValue}.${defaultKey}`
      );
    }
    // Call supers for any other alters.
    super.addItemAlters(semverValue, converterItem);
  }

  /**
   * Gets the default object from the converter.
   *
   * @returns {Object}
   */
  getConverterDefaults() {
    return this.getConverter().default;
  }

  /**
   * Adds default to the manifest capabilities.
   *
   */
  setManifestCapabilities() {
    // Populate the defaults from the converter object.
    this.manifestCapability.push('default');
    super.setManifestCapabilities();
  }
};
