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
  /**
   * Sets this.semveristElement to the passed string.
   *
   * @param {string} semveristElementName
   *   An string representing the semverist element.
   */
  setSemveristElement(elementName) {
    this.semveristElement = elementName;
    if (super.setSemveristElement) super.setSemveristElement(elementName);
  }

  /**
   * Returns the name of a semverish element.
   *
   * @returns {string}
   *   A string.
   */
  getSemveristElement() {
    return this.semveristElement;
  }
};
