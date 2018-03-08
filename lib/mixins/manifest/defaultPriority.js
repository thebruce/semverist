'use strict';

const _ = require('lodash');

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
   * Prioritizes the component items for a semver version
   *   and an attribute element
   *
   * @param {array} componentPathArray - An array of semveristElement
   *   and semver string.
   */
  prioritizeComponent(componentPathArray) {
    let tmpPriority = [];
    const elementName = componentPathArray[0];
    const semverValue = componentPathArray[1];
    let defaultArray = [];
    const groupArray = [];
    const components = this.getManifestComponents()[elementName][semverValue].components;
    const capabilities = this.getManifestCapabilities();
    // Should we look for defaults? check capabilities
    if (capabilities.indexOf('default') !== -1) {
      // We should look for defaults.
      // What is the name of our default.
      const defaultName = this.getConfig().semveristBehaviors.defaultName;
      // Now find any instance of this within the component.
      defaultArray = defaultArray.concat(
        components.filter(
          item => item.indexOf(`.${defaultName}`) !== -1
        )
      );
    }

    // Should we look for groups? check capabilities
    if (capabilities.indexOf('group') !== -1) {
      // Get this elements possible groups
      const groups = this.getItemGroups(elementName);
      // check for these groups.
      groups.forEach((group) => {
        groupArray.push(components.filter(item => item.indexOf(`.${group}`))[0]);
      });
      // sort groupArray.
    }

    // Now the difference should be the attribute item,
    // but just in case something snuck in we will filter.
    const attributeArray = _.difference(
      components,
      groupArray,
      defaultArray).filter(item => item.indexOf(`.${elementName}`));
    // Preserves default priority, since merges happen l to r with
    // subsequent sources overwrite property assignments of previous sources.
    tmpPriority = tmpPriority.concat(defaultArray, groupArray, attributeArray);

    // Now set the components of the element and semver
    // to the newly ordered priority.
    this.manifestComponents[elementName][semverValue].components = tmpPriority;
  }
};
