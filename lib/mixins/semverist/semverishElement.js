/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
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
   * Sets this.semveristElement to the passed string.
   *
   * @param {string} elementName
   *   An string representing the semverist element.
   * @returns {void}
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
