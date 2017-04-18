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
  addItemAlters(semverValue, converterItem) {
    // register any alters on this semverist element.
    const defaultKey = Object.keys(this.getConverterDefaults())[0];
    const defaults = Object.keys(this.getConverterDefaults()[defaultKey]);
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

  setManifestCapabilities() {
    // Populate the defaults from the converter object.
    this.manifestCapability.push('default');
    super.setManifestCapabilities();
  }
};
