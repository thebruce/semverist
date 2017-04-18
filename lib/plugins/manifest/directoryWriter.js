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
  writeComposition() {
    // if this has been called the object writer has already written out objects
    // to the composition. We need to take each object and write
    // directories and files
    // out based on the naming and contents.
    this.lintingPower = 'great';
  }
};
