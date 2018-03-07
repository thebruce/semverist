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
   * Sets the type of the passed element name. Will default to an attribute
   *   but can be a (attribute || default (or the overridden default name) ||
   *   group).
   *
   * @param {string} elementName
   *  A semverist element name.
   */
  setSemveristElementType(elementName) {
    this.semveristElementType = this.determineSemveristElementType(elementName);
  }


  /**
   * Returns a semverist element type relating to the element attached to
   *   the semverish path or null if there was no semverist element
   *   in this path.
   *
   * @returns {string=attribute}
   *   attribute || default || group || null
   */
  getSemveristElementType() {
    return this.semveristElementType;
  }

  /**
   * Determines whether the semverist element you pass is
   * an attribute, group or default.
   *
   * @param {string} semveristElementName - The name of a semverist element.
   *
   * @returns {string} - A semverist element type (attribute||group||default).
   */
  determineSemveristElementType(semveristElementName) {
    let semverType = 'attribute';
    // Check config for default.
    if (this.isAttributeDefault(semveristElementName)) {
      semverType = 'default';
    }
    else if (
      _.indexOf(
        Object.keys(this.getSemveristGroups()),
        semveristElementName
      ) !== -1
    ) { // check config for groups
      semverType = 'group';
    }
    // otherwise its an attribute.
    return semverType;
  }
};
