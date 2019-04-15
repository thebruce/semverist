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
module.exports = superclass =>
  class extends superclass {
    /**
     * Sets a semverish value from the original semverish value with any
     *   trailing semverist element removed from the path.
     *
     * @param {any} semverishValue
     *   A semverish value with or without a trailing semverist element.
     * @returns {void}
     */
    setSemverish(semverishValue) {
      this.semverish = semverishValue;
      if (super.setSemverish) super.setSemverish(semverishValue);
    }

    /**
     * Gets the semverish value with semver element removed.
     *
     * @returns {string}
     *   A semverish value with no semverist element.
     */
    getSemverish() {
      return this.semverish;
    }
  };
