'use strict';

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
  setManifestComponents() {
    // Populate the defaults from the converter object.
    this.manifestComponents.default = {};
    super.setManifestComponents();
  }

  addItemAlters(semver, semveristElement) {
    // register any alters on this semverist elemtn
    // check for a default that applies at this semver in the converter.
    // we need to track what semverish value this comes from as well.
    super.addItemAlters(semver, semveristElement);
  }
};
