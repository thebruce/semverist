

const _ = require('lodash');
const semver = require('semver');

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
   * Alters the manifest component for a semverist element
   *   by adding any group objects from the semverish object
   *   whose ranges are satisfied by the passed semver value
   *   and whose members include the semverist element from
   *   the converter item.
   * @param {string} semverValue - A semver string.
   * @param {Object} converterItem - A converter item for
   *   this semverist element and value.
   * @returns {void}
   */
  addItemAlters(semverValue, converterItem) {
    // Get only relevant groups.
    const groupArray = this.getItemGroups(converterItem.semveristElement);
    groupArray.forEach((group) => {
      if (this.getConverterGroups(group)) {
        const groupRanges = Object.keys(this.getConverterGroups(group));
        // Check defaults for any applicable.
        const filterApplies = groupRanges.filter(
          groupRange => semver.satisfies(
            semverValue,
            groupRange
          )
        );
        // check for a default that applies at this semver in the converter.
        if (filterApplies.length) {
          // We had an applicable filter.
          this.addManifestComponentItem(
            converterItem.semveristElement,
            semverValue,
            `${this.getConverterGroups(group)[filterApplies[0]].semverishValue}.${group}`
          );
        }
      }
    });
    super.addItemAlters(semverValue, converterItem);
  }

  /**
   * Adds the group capability to the manifest.
   * @returns {void}
   */
  setManifestCapabilities() {
    // Populate the defaults from the converter object.
    this.manifestCapability.push('group');
    super.setManifestCapabilities();
  }


  /**
   * Checks config for groups to which the element Name belongs.
   *
   * @param {string} elementName - A semverist element name.
   * @returns {array} - An array of groups to whome the passed semverist element
   *   name belongs.
   */
  getItemGroups(elementName) {
    const relevantGroups = [];
    const groupConfig = _.get(this.getConfig(), 'groups', {});
    // If we had one or more groups.
    Object.keys(groupConfig).forEach((groupName) => {
      // Let's check each group for this element's membership.
      if (groupConfig[groupName].members.indexOf(elementName) !== -1) {
        // This element was found as a member.
        relevantGroups.push(groupName);
      }
    });
    return relevantGroups;
  }

  /**
   * Gets the default object from the converter.
   *
   * @param {string} groupName
   *   A group name you would like to retrieve from the converter.
   *
   * @returns {Object}
   *   Returns a named converter group.
   */
  getConverterGroups(groupName) {
    return _.get(this.getConverter(), `group.${groupName}`, null);
  }
};
