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
  init() {
    this.setCompositionType();
    this.setCompositionDestination();
    super.init();
  }

  assembleManifest() {
    // calls to write composition - handled in plugins
    // chained from object writer to directory writer (if directory)
    this.writeComposition();
  }

  setComposition(draft) {
    this.composition = draft;
  }

  getComposition() {
    return this.composition;
  }

  setCompositionType() {
    // Sets the composition type according to config.
    this.compositionType = _.get(this.getConfig(), 'composer.composerType', 'default');
  }

  getCompositionType() {
    return this.compositionType;
  }

  setCompositionDestination() {
    // Sets the composition destination according to config,
    this.compositionDestination = _.get(this.getConfig(), 'composer.destination', null);
    if (this.getCompositionType() === 'directory' && this.compositionDestination === null) {
      throw new Error('If the composition type is directory there must be a destination path');
    }
  }

  getCompositionDestination() {
    return this.compositionDestination;
  }
};
